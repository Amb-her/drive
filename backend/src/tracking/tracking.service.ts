import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogMealDto } from './dto/log-meal.dto';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Logger un repas (cocher une recette "mangée")
   */
  async logMeal(userId: string, dto: LogMealDto) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: dto.recipeId },
    });

    if (!recipe) {
      throw new NotFoundException('Recette non trouvée');
    }

    const servings = dto.servings ?? 1;

    return this.prisma.mealLog.create({
      data: {
        userId,
        recipeId: dto.recipeId,
        mealType: dto.mealType as any,
        servings,
        calories: recipe.caloriesPerServing * servings,
        protein: recipe.proteinPerServing * servings,
        carbs: recipe.carbsPerServing * servings,
        fat: recipe.fatPerServing * servings,
      },
      include: { recipe: true },
    });
  }

  /**
   * Supprimer un log
   */
  async deleteMealLog(userId: string, logId: string) {
    const log = await this.prisma.mealLog.findUnique({
      where: { id: logId },
    });

    if (!log || log.userId !== userId) {
      throw new NotFoundException('Log non trouvé');
    }

    await this.prisma.mealLog.delete({ where: { id: logId } });
    return { deleted: true };
  }

  /**
   * Dashboard journalier
   */
  async getDailyDashboard(userId: string, dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    const logs = await this.prisma.mealLog.findMany({
      where: {
        userId,
        date: { gte: date, lt: nextDay },
      },
      include: { recipe: true },
      orderBy: { date: 'asc' },
    });

    const consumed = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fat: acc.fat + log.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    const targets = profile
      ? {
          calories: profile.dailyCalories,
          protein: profile.proteinGrams,
          carbs: profile.carbGrams,
          fat: profile.fatGrams,
        }
      : { calories: 2000, protein: 120, carbs: 250, fat: 70 };

    return {
      date: date.toISOString().split('T')[0],
      targets,
      consumed: {
        calories: Math.round(consumed.calories),
        protein: Math.round(consumed.protein),
        carbs: Math.round(consumed.carbs),
        fat: Math.round(consumed.fat),
      },
      remaining: {
        calories: Math.round(Math.max(0, targets.calories - consumed.calories)),
        protein: Math.round(Math.max(0, targets.protein - consumed.protein)),
        carbs: Math.round(Math.max(0, targets.carbs - consumed.carbs)),
        fat: Math.round(Math.max(0, targets.fat - consumed.fat)),
      },
      progress: {
        calories: Math.min(100, Math.round((consumed.calories / targets.calories) * 100)),
        protein: Math.min(100, Math.round((consumed.protein / targets.protein) * 100)),
        carbs: Math.min(100, Math.round((consumed.carbs / targets.carbs) * 100)),
        fat: Math.min(100, Math.round((consumed.fat / targets.fat) * 100)),
      },
      meals: logs,
    };
  }

  /**
   * Dashboard hebdomadaire
   */
  async getWeeklyDashboard(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Lundi de cette semaine
    const monday = new Date(today);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);

    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    const logs = await this.prisma.mealLog.findMany({
      where: {
        userId,
        date: { gte: monday, lt: nextMonday },
      },
      orderBy: { date: 'asc' },
    });

    // Regrouper par jour
    const days: Record<string, { calories: number; protein: number; carbs: number; fat: number }> =
      {};

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      days[key] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    for (const log of logs) {
      const key = log.date.toISOString().split('T')[0];
      if (days[key]) {
        days[key].calories += log.calories;
        days[key].protein += log.protein;
        days[key].carbs += log.carbs;
        days[key].fat += log.fat;
      }
    }

    const weekData = Object.entries(days).map(([date, macros]) => ({
      date,
      ...macros,
    }));

    const avgCalories =
      weekData.reduce((sum, d) => sum + d.calories, 0) / 7;

    return {
      week: weekData,
      averages: {
        calories: Math.round(avgCalories),
        protein: Math.round(weekData.reduce((s, d) => s + d.protein, 0) / 7),
        carbs: Math.round(weekData.reduce((s, d) => s + d.carbs, 0) / 7),
        fat: Math.round(weekData.reduce((s, d) => s + d.fat, 0) / 7),
      },
      targets: profile
        ? {
            calories: profile.dailyCalories,
            protein: profile.proteinGrams,
            carbs: profile.carbGrams,
            fat: profile.fatGrams,
          }
        : null,
    };
  }
}
