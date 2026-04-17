import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface MacroTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    search?: string;
    tags?: string[];
    maxPrepTime?: number;
    difficulty?: string;
    nutriScore?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, tags, maxPrepTime, difficulty, nutriScore, page = 1, limit = 20 } = params;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags && tags.length > 0) {
      where.tags = { some: { tag: { in: tags } } };
    }

    if (maxPrepTime) {
      where.prepTimeMin = { lte: maxPrepTime };
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (nutriScore) {
      where.nutriScore = nutriScore;
    }

    const [recipes, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        include: {
          tags: true,
          ingredients: { include: { ingredient: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.recipe.count({ where }),
    ]);

    return {
      recipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        tags: true,
        ingredients: { include: { ingredient: true } },
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette non trouvée');
    }

    return recipe;
  }

  /**
   * Recommandation de recettes basée sur les macros restantes
   * Algorithme: score de compatibilité = proximité des macros cibles
   */
  async getRecommendations(userId: string, mealType?: string) {
    const mealTypeTag = mealType ? mealType.toLowerCase() : null;

    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { dietaryConstraints: true },
    });

    if (!profile) {
      // Pas de profil = recettes filtrées par mealType si spécifié
      return this.findAll({
        limit: 10,
        tags: mealTypeTag ? [mealTypeTag] : undefined,
      });
    }

    // Calculer les macros déjà consommées aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogs = await this.prisma.mealLog.findMany({
      where: {
        userId,
        date: { gte: today, lt: tomorrow },
      },
    });

    const consumed = todayLogs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fat: acc.fat + log.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    const remaining: MacroTarget = {
      calories: Math.max(0, profile.dailyCalories - consumed.calories),
      protein: Math.max(0, profile.proteinGrams - consumed.protein),
      carbs: Math.max(0, profile.carbGrams - consumed.carbs),
      fat: Math.max(0, profile.fatGrams - consumed.fat),
    };

    // Déterminer les calories idéales par repas restant
    const mealsLeft = this.getMealsLeft(mealType);
    const targetPerMeal: MacroTarget = {
      calories: remaining.calories / mealsLeft,
      protein: remaining.protein / mealsLeft,
      carbs: remaining.carbs / mealsLeft,
      fat: remaining.fat / mealsLeft,
    };

    // Récupérer les recettes compatibles avec les contraintes + mealType
    const constraintTags = this.mapConstraintsToTags(
      profile.dietaryConstraints.map((c) => c.type),
    );

    const mealTypeFilter = mealTypeTag
      ? { some: { tag: mealTypeTag } }
      : undefined;

    const recipes = await this.prisma.recipe.findMany({
      where: mealTypeFilter ? { tags: mealTypeFilter } : {},
      include: {
        tags: true,
        ingredients: { include: { ingredient: true } },
      },
    });

    // Scorer et trier les recettes
    const scored = recipes
      .filter((recipe) => this.isCompatibleWithConstraints(recipe, constraintTags))
      .map((recipe) => ({
        recipe,
        score: this.calculateMatchScore(recipe, targetPerMeal),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return {
      remaining,
      targetPerMeal,
      recipes: scored.map((s) => ({
        ...s.recipe,
        matchScore: Math.round(s.score * 100),
      })),
    };
  }

  /**
   * Score de compatibilité macro (0-1)
   * Plus le score est élevé, mieux la recette correspond aux besoins
   */
  private calculateMatchScore(recipe: any, target: MacroTarget): number {
    if (target.calories <= 0) return 0;

    const calDiff = Math.abs(recipe.caloriesPerServing - target.calories) / target.calories;
    const protDiff =
      target.protein > 0
        ? Math.abs(recipe.proteinPerServing - target.protein) / target.protein
        : 0;
    const carbDiff =
      target.carbs > 0 ? Math.abs(recipe.carbsPerServing - target.carbs) / target.carbs : 0;
    const fatDiff =
      target.fat > 0 ? Math.abs(recipe.fatPerServing - target.fat) / target.fat : 0;

    // Pondération: calories 30%, protéines 40%, glucides 15%, lipides 15%
    const weightedDiff = calDiff * 0.3 + protDiff * 0.4 + carbDiff * 0.15 + fatDiff * 0.15;

    return Math.max(0, 1 - weightedDiff);
  }

  private getMealsLeft(mealType?: string): number {
    if (!mealType) return 2; // Par défaut, 2 repas restants
    const mealsOrder = ['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER'];
    const idx = mealsOrder.indexOf(mealType);
    return Math.max(1, mealsOrder.length - idx);
  }

  private mapConstraintsToTags(constraints: string[]): string[] {
    const mapping: Record<string, string[]> = {
      VEGETARIAN: ['vegetarian'],
      VEGAN: ['vegan'],
      GLUTEN_FREE: ['gluten-free'],
      LACTOSE_FREE: ['lactose-free'],
      NUT_FREE: ['nut-free'],
      KETO: ['keto', 'low-carb'],
    };

    return constraints.flatMap((c) => mapping[c] || []);
  }

  private isCompatibleWithConstraints(recipe: any, requiredTags: string[]): boolean {
    if (requiredTags.length === 0) return true;
    const recipeTags = recipe.tags.map((t: any) => t.tag);
    return requiredTags.every((tag) => recipeTags.includes(tag));
  }

  async toggleFavorite(userId: string, recipeId: string) {
    const existing = await this.prisma.userFavoriteRecipe.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });

    if (existing) {
      await this.prisma.userFavoriteRecipe.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    await this.prisma.userFavoriteRecipe.create({
      data: { userId, recipeId },
    });
    return { favorited: true };
  }

  async getFavorites(userId: string) {
    const favorites = await this.prisma.userFavoriteRecipe.findMany({
      where: { userId },
      include: {
        recipe: {
          include: { tags: true, ingredients: { include: { ingredient: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => f.recipe);
  }
}
