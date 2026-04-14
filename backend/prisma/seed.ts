import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─────────────────────────────────────────────
  // INGRÉDIENTS
  // ─────────────────────────────────────────────
  const ingredients = await Promise.all([
    // Protéines
    prisma.ingredient.upsert({
      where: { name: 'Blanc de poulet' },
      update: {},
      create: {
        name: 'Blanc de poulet',
        category: 'PROTEIN',
        unit: 'g',
        caloriesPer100: 165,
        proteinPer100: 31,
        carbsPer100: 0,
        fatPer100: 3.6,
        fiberPer100: 0,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Saumon frais' },
      update: {},
      create: {
        name: 'Saumon frais',
        category: 'PROTEIN',
        unit: 'g',
        caloriesPer100: 208,
        proteinPer100: 20,
        carbsPer100: 0,
        fatPer100: 13,
        fiberPer100: 0,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Oeufs' },
      update: {},
      create: {
        name: 'Oeufs',
        category: 'PROTEIN',
        unit: 'pièce',
        caloriesPer100: 155,
        proteinPer100: 13,
        carbsPer100: 1.1,
        fatPer100: 11,
        fiberPer100: 0,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Thon en boîte' },
      update: {},
      create: {
        name: 'Thon en boîte',
        category: 'PROTEIN',
        unit: 'g',
        caloriesPer100: 132,
        proteinPer100: 29,
        carbsPer100: 0,
        fatPer100: 1,
        fiberPer100: 0,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Steak haché 5%' },
      update: {},
      create: {
        name: 'Steak haché 5%',
        category: 'PROTEIN',
        unit: 'g',
        caloriesPer100: 137,
        proteinPer100: 26,
        carbsPer100: 0,
        fatPer100: 5,
        fiberPer100: 0,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Tofu ferme' },
      update: {},
      create: {
        name: 'Tofu ferme',
        category: 'PROTEIN',
        unit: 'g',
        caloriesPer100: 144,
        proteinPer100: 17,
        carbsPer100: 3,
        fatPer100: 8,
        fiberPer100: 1,
      },
    }),
    // Féculents
    prisma.ingredient.upsert({
      where: { name: 'Riz basmati' },
      update: {},
      create: {
        name: 'Riz basmati',
        category: 'GRAIN',
        unit: 'g',
        caloriesPer100: 350,
        proteinPer100: 7,
        carbsPer100: 78,
        fatPer100: 0.6,
        fiberPer100: 1.3,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Patate douce' },
      update: {},
      create: {
        name: 'Patate douce',
        category: 'VEGETABLE',
        unit: 'g',
        caloriesPer100: 86,
        proteinPer100: 1.6,
        carbsPer100: 20,
        fatPer100: 0.1,
        fiberPer100: 3,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Pâtes complètes' },
      update: {},
      create: {
        name: 'Pâtes complètes',
        category: 'GRAIN',
        unit: 'g',
        caloriesPer100: 348,
        proteinPer100: 13,
        carbsPer100: 65,
        fatPer100: 2.5,
        fiberPer100: 7,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Flocons d\'avoine' },
      update: {},
      create: {
        name: 'Flocons d\'avoine',
        category: 'GRAIN',
        unit: 'g',
        caloriesPer100: 389,
        proteinPer100: 16.9,
        carbsPer100: 66,
        fatPer100: 6.9,
        fiberPer100: 10.6,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Quinoa' },
      update: {},
      create: {
        name: 'Quinoa',
        category: 'GRAIN',
        unit: 'g',
        caloriesPer100: 368,
        proteinPer100: 14,
        carbsPer100: 64,
        fatPer100: 6,
        fiberPer100: 7,
      },
    }),
    // Légumes
    prisma.ingredient.upsert({
      where: { name: 'Brocoli' },
      update: {},
      create: {
        name: 'Brocoli',
        category: 'VEGETABLE',
        unit: 'g',
        caloriesPer100: 34,
        proteinPer100: 2.8,
        carbsPer100: 7,
        fatPer100: 0.4,
        fiberPer100: 2.6,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Épinards' },
      update: {},
      create: {
        name: 'Épinards',
        category: 'VEGETABLE',
        unit: 'g',
        caloriesPer100: 23,
        proteinPer100: 2.9,
        carbsPer100: 3.6,
        fatPer100: 0.4,
        fiberPer100: 2.2,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Avocat' },
      update: {},
      create: {
        name: 'Avocat',
        category: 'VEGETABLE',
        unit: 'pièce',
        caloriesPer100: 160,
        proteinPer100: 2,
        carbsPer100: 9,
        fatPer100: 15,
        fiberPer100: 7,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Tomates' },
      update: {},
      create: {
        name: 'Tomates',
        category: 'VEGETABLE',
        unit: 'g',
        caloriesPer100: 18,
        proteinPer100: 0.9,
        carbsPer100: 3.9,
        fatPer100: 0.2,
        fiberPer100: 1.2,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Courgette' },
      update: {},
      create: {
        name: 'Courgette',
        category: 'VEGETABLE',
        unit: 'g',
        caloriesPer100: 17,
        proteinPer100: 1.2,
        carbsPer100: 3.1,
        fatPer100: 0.3,
        fiberPer100: 1,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Poivron rouge' },
      update: {},
      create: {
        name: 'Poivron rouge',
        category: 'VEGETABLE',
        unit: 'g',
        caloriesPer100: 31,
        proteinPer100: 1,
        carbsPer100: 6,
        fatPer100: 0.3,
        fiberPer100: 2.1,
      },
    }),
    // Produits laitiers
    prisma.ingredient.upsert({
      where: { name: 'Fromage blanc 0%' },
      update: {},
      create: {
        name: 'Fromage blanc 0%',
        category: 'DAIRY',
        unit: 'g',
        caloriesPer100: 48,
        proteinPer100: 8,
        carbsPer100: 4,
        fatPer100: 0.2,
        fiberPer100: 0,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Mozzarella' },
      update: {},
      create: {
        name: 'Mozzarella',
        category: 'DAIRY',
        unit: 'g',
        caloriesPer100: 280,
        proteinPer100: 22,
        carbsPer100: 2.2,
        fatPer100: 17,
        fiberPer100: 0,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Lait d\'amande' },
      update: {},
      create: {
        name: 'Lait d\'amande',
        category: 'BEVERAGE',
        unit: 'ml',
        caloriesPer100: 15,
        proteinPer100: 0.6,
        carbsPer100: 0.3,
        fatPer100: 1.1,
        fiberPer100: 0.2,
      },
    }),
    // Graisses
    prisma.ingredient.upsert({
      where: { name: 'Huile d\'olive' },
      update: {},
      create: {
        name: 'Huile d\'olive',
        category: 'FAT',
        unit: 'ml',
        caloriesPer100: 884,
        proteinPer100: 0,
        carbsPer100: 0,
        fatPer100: 100,
        fiberPer100: 0,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Beurre de cacahuète' },
      update: {},
      create: {
        name: 'Beurre de cacahuète',
        category: 'FAT',
        unit: 'g',
        caloriesPer100: 588,
        proteinPer100: 25,
        carbsPer100: 20,
        fatPer100: 50,
        fiberPer100: 6,
      },
    }),
    // Fruits
    prisma.ingredient.upsert({
      where: { name: 'Banane' },
      update: {},
      create: {
        name: 'Banane',
        category: 'FRUIT',
        unit: 'pièce',
        caloriesPer100: 89,
        proteinPer100: 1.1,
        carbsPer100: 23,
        fatPer100: 0.3,
        fiberPer100: 2.6,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Myrtilles' },
      update: {},
      create: {
        name: 'Myrtilles',
        category: 'FRUIT',
        unit: 'g',
        caloriesPer100: 57,
        proteinPer100: 0.7,
        carbsPer100: 14,
        fatPer100: 0.3,
        fiberPer100: 2.4,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Citron' },
      update: {},
      create: {
        name: 'Citron',
        category: 'FRUIT',
        unit: 'pièce',
        caloriesPer100: 29,
        proteinPer100: 1.1,
        carbsPer100: 9,
        fatPer100: 0.3,
        fiberPer100: 2.8,
      },
    }),
    // Condiments
    prisma.ingredient.upsert({
      where: { name: 'Sauce soja' },
      update: {},
      create: {
        name: 'Sauce soja',
        category: 'CONDIMENT',
        unit: 'ml',
        caloriesPer100: 53,
        proteinPer100: 8,
        carbsPer100: 5,
        fatPer100: 0,
        fiberPer100: 0.8,
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Miel' },
      update: {},
      create: {
        name: 'Miel',
        category: 'CONDIMENT',
        unit: 'g',
        caloriesPer100: 304,
        proteinPer100: 0.3,
        carbsPer100: 82,
        fatPer100: 0,
        fiberPer100: 0,
      },
    }),
  ]);

  const ingredientMap = new Map(ingredients.map((i) => [i.name, i]));
  const ing = (name: string) => ingredientMap.get(name)!;

  // ─────────────────────────────────────────────
  // RECETTES
  // ─────────────────────────────────────────────

  // 1. Poulet grillé, riz & brocoli
  const recipe1 = await prisma.recipe.create({
    data: {
      name: 'Poulet grillé, riz basmati & brocoli',
      description: 'Le classique du meal prep fitness. Simple, efficace, riche en protéines.',
      prepTimeMin: 10,
      cookTimeMin: 25,
      servings: 2,
      difficulty: 'EASY',
      instructions: [
        'Faire cuire le riz basmati selon les instructions du paquet.',
        'Couper le blanc de poulet en tranches, assaisonner avec sel, poivre et paprika.',
        'Griller le poulet à la poêle avec un filet d\'huile d\'olive, 5-6 min par côté.',
        'Faire cuire le brocoli à la vapeur pendant 5 minutes.',
        'Dresser dans l\'assiette : riz, poulet, brocoli. Arroser d\'un filet de citron.',
      ],
      caloriesPerServing: 485,
      proteinPerServing: 42,
      carbsPerServing: 52,
      fatPerServing: 10,
      fiberPerServing: 4,
      nutriScore: 'A',
      greenScore: 65,
      tags: {
        createMany: {
          data: [
            { tag: 'high-protein' },
            { tag: 'meal-prep' },
            { tag: 'gluten-free' },
            { tag: 'batch-cooking' },
          ],
        },
      },
      ingredients: {
        createMany: {
          data: [
            { ingredientId: ing('Blanc de poulet').id, quantity: 300, unit: 'g' },
            { ingredientId: ing('Riz basmati').id, quantity: 150, unit: 'g' },
            { ingredientId: ing('Brocoli').id, quantity: 200, unit: 'g' },
            { ingredientId: ing('Huile d\'olive').id, quantity: 10, unit: 'ml' },
            { ingredientId: ing('Citron').id, quantity: 0.5, unit: 'pièce' },
          ],
        },
      },
    },
  });

  // 2. Bowl saumon avocat
  const recipe2 = await prisma.recipe.create({
    data: {
      name: 'Poke bowl saumon & avocat',
      description: 'Bowl frais et nutritif inspiré d\'Hawaï. Omega-3 et bonnes graisses.',
      prepTimeMin: 15,
      cookTimeMin: 20,
      servings: 1,
      difficulty: 'EASY',
      instructions: [
        'Cuire le riz et laisser refroidir.',
        'Couper le saumon en dés.',
        'Couper l\'avocat en tranches.',
        'Disposer le riz dans un bowl, ajouter le saumon, l\'avocat et les épinards.',
        'Assaisonner avec sauce soja et un filet de citron.',
      ],
      caloriesPerServing: 580,
      proteinPerServing: 35,
      carbsPerServing: 48,
      fatPerServing: 26,
      fiberPerServing: 8,
      nutriScore: 'A',
      greenScore: 55,
      tags: {
        createMany: {
          data: [
            { tag: 'high-protein' },
            { tag: 'omega-3' },
            { tag: 'gluten-free' },
          ],
        },
      },
      ingredients: {
        createMany: {
          data: [
            { ingredientId: ing('Saumon frais').id, quantity: 150, unit: 'g' },
            { ingredientId: ing('Riz basmati').id, quantity: 80, unit: 'g' },
            { ingredientId: ing('Avocat').id, quantity: 0.5, unit: 'pièce' },
            { ingredientId: ing('Épinards').id, quantity: 50, unit: 'g' },
            { ingredientId: ing('Sauce soja').id, quantity: 15, unit: 'ml' },
            { ingredientId: ing('Citron').id, quantity: 0.5, unit: 'pièce' },
          ],
        },
      },
    },
  });

  // 3. Overnight oats
  const recipe3 = await prisma.recipe.create({
    data: {
      name: 'Overnight oats protéinés',
      description: 'Petit-déjeuner prêt la veille. Pratique, riche en fibres et protéines.',
      prepTimeMin: 5,
      cookTimeMin: 0,
      servings: 1,
      difficulty: 'EASY',
      instructions: [
        'Mélanger les flocons d\'avoine avec le lait d\'amande dans un bocal.',
        'Ajouter le beurre de cacahuète et le miel, bien mélanger.',
        'Couvrir et laisser au réfrigérateur toute la nuit (min 6h).',
        'Au matin, ajouter la banane en rondelles et les myrtilles.',
      ],
      caloriesPerServing: 420,
      proteinPerServing: 18,
      carbsPerServing: 55,
      fatPerServing: 16,
      fiberPerServing: 8,
      nutriScore: 'A',
      greenScore: 80,
      tags: {
        createMany: {
          data: [
            { tag: 'breakfast' },
            { tag: 'meal-prep' },
            { tag: 'vegetarian' },
            { tag: 'vegan' },
            { tag: 'lactose-free' },
          ],
        },
      },
      ingredients: {
        createMany: {
          data: [
            { ingredientId: ing('Flocons d\'avoine').id, quantity: 60, unit: 'g' },
            { ingredientId: ing('Lait d\'amande').id, quantity: 200, unit: 'ml' },
            { ingredientId: ing('Beurre de cacahuète').id, quantity: 15, unit: 'g' },
            { ingredientId: ing('Banane').id, quantity: 1, unit: 'pièce' },
            { ingredientId: ing('Myrtilles').id, quantity: 50, unit: 'g' },
            { ingredientId: ing('Miel').id, quantity: 10, unit: 'g' },
          ],
        },
      },
    },
  });

  // 4. Salade de quinoa
  const recipe4 = await prisma.recipe.create({
    data: {
      name: 'Salade de quinoa, tofu & légumes grillés',
      description: 'Salade complète végétarienne riche en protéines végétales.',
      prepTimeMin: 15,
      cookTimeMin: 20,
      servings: 2,
      difficulty: 'MEDIUM',
      instructions: [
        'Cuire le quinoa dans 2x son volume d\'eau pendant 15 min.',
        'Couper le tofu en cubes, mariner dans la sauce soja.',
        'Couper la courgette et le poivron en morceaux.',
        'Griller le tofu et les légumes au four à 200°C pendant 15 min.',
        'Mélanger le quinoa refroidi avec les légumes et le tofu.',
        'Assaisonner avec huile d\'olive, citron, sel et poivre.',
      ],
      caloriesPerServing: 410,
      proteinPerServing: 24,
      carbsPerServing: 45,
      fatPerServing: 15,
      fiberPerServing: 8,
      nutriScore: 'A',
      greenScore: 90,
      tags: {
        createMany: {
          data: [
            { tag: 'vegetarian' },
            { tag: 'vegan' },
            { tag: 'high-protein' },
            { tag: 'gluten-free' },
            { tag: 'batch-cooking' },
          ],
        },
      },
      ingredients: {
        createMany: {
          data: [
            { ingredientId: ing('Quinoa').id, quantity: 120, unit: 'g' },
            { ingredientId: ing('Tofu ferme').id, quantity: 200, unit: 'g' },
            { ingredientId: ing('Courgette').id, quantity: 150, unit: 'g' },
            { ingredientId: ing('Poivron rouge').id, quantity: 150, unit: 'g' },
            { ingredientId: ing('Sauce soja').id, quantity: 20, unit: 'ml' },
            { ingredientId: ing('Huile d\'olive').id, quantity: 15, unit: 'ml' },
            { ingredientId: ing('Citron').id, quantity: 1, unit: 'pièce' },
          ],
        },
      },
    },
  });

  // 5. Pâtes bolognaise protéinées
  const recipe5 = await prisma.recipe.create({
    data: {
      name: 'Pâtes complètes bolognaise protéinées',
      description: 'Bolognaise maison avec steak haché 5% MG. Comfort food version healthy.',
      prepTimeMin: 10,
      cookTimeMin: 30,
      servings: 2,
      difficulty: 'EASY',
      instructions: [
        'Cuire les pâtes complètes al dente.',
        'Faire revenir le steak haché dans une poêle chaude.',
        'Ajouter les tomates coupées en dés et la courgette râpée.',
        'Laisser mijoter 20 min à feu doux.',
        'Servir la sauce sur les pâtes.',
      ],
      caloriesPerServing: 520,
      proteinPerServing: 38,
      carbsPerServing: 58,
      fatPerServing: 12,
      fiberPerServing: 9,
      nutriScore: 'A',
      greenScore: 55,
      tags: {
        createMany: {
          data: [
            { tag: 'high-protein' },
            { tag: 'batch-cooking' },
            { tag: 'comfort-food' },
          ],
        },
      },
      ingredients: {
        createMany: {
          data: [
            { ingredientId: ing('Pâtes complètes').id, quantity: 160, unit: 'g' },
            { ingredientId: ing('Steak haché 5%').id, quantity: 250, unit: 'g' },
            { ingredientId: ing('Tomates').id, quantity: 300, unit: 'g' },
            { ingredientId: ing('Courgette').id, quantity: 100, unit: 'g' },
            { ingredientId: ing('Huile d\'olive').id, quantity: 10, unit: 'ml' },
          ],
        },
      },
    },
  });

  // 6. Omelette aux épinards
  const recipe6 = await prisma.recipe.create({
    data: {
      name: 'Omelette épinards & fromage blanc',
      description: 'Rapide, protéinée et idéale pour un déjeuner express.',
      prepTimeMin: 5,
      cookTimeMin: 8,
      servings: 1,
      difficulty: 'EASY',
      instructions: [
        'Battre les oeufs avec le fromage blanc.',
        'Faire revenir les épinards dans une poêle avec un peu d\'huile.',
        'Verser les oeufs battus sur les épinards.',
        'Cuire à feu moyen 3-4 min, puis retourner.',
        'Servir avec une tranche de pain complet.',
      ],
      caloriesPerServing: 340,
      proteinPerServing: 32,
      carbsPerServing: 8,
      fatPerServing: 20,
      fiberPerServing: 2,
      nutriScore: 'A',
      greenScore: 75,
      tags: {
        createMany: {
          data: [
            { tag: 'high-protein' },
            { tag: 'low-carb' },
            { tag: 'quick' },
            { tag: 'keto' },
            { tag: 'vegetarian' },
            { tag: 'gluten-free' },
          ],
        },
      },
      ingredients: {
        createMany: {
          data: [
            { ingredientId: ing('Oeufs').id, quantity: 3, unit: 'pièce' },
            { ingredientId: ing('Épinards').id, quantity: 100, unit: 'g' },
            { ingredientId: ing('Fromage blanc 0%').id, quantity: 50, unit: 'g' },
            { ingredientId: ing('Huile d\'olive').id, quantity: 5, unit: 'ml' },
          ],
        },
      },
    },
  });

  // 7. Bowl patate douce et thon
  const recipe7 = await prisma.recipe.create({
    data: {
      name: 'Bowl patate douce & thon',
      description: 'Bowl simple et rassasiant. Parfait pour le batch cooking.',
      prepTimeMin: 10,
      cookTimeMin: 25,
      servings: 1,
      difficulty: 'EASY',
      instructions: [
        'Couper la patate douce en cubes, cuire au four à 200°C pendant 25 min.',
        'Émietter le thon.',
        'Couper l\'avocat en tranches.',
        'Assembler: patate douce, thon, avocat, épinards.',
        'Assaisonner avec huile d\'olive et citron.',
      ],
      caloriesPerServing: 450,
      proteinPerServing: 36,
      carbsPerServing: 38,
      fatPerServing: 16,
      fiberPerServing: 9,
      nutriScore: 'A',
      greenScore: 60,
      tags: {
        createMany: {
          data: [
            { tag: 'high-protein' },
            { tag: 'gluten-free' },
            { tag: 'meal-prep' },
          ],
        },
      },
      ingredients: {
        createMany: {
          data: [
            { ingredientId: ing('Patate douce').id, quantity: 200, unit: 'g' },
            { ingredientId: ing('Thon en boîte').id, quantity: 120, unit: 'g' },
            { ingredientId: ing('Avocat').id, quantity: 0.5, unit: 'pièce' },
            { ingredientId: ing('Épinards').id, quantity: 50, unit: 'g' },
            { ingredientId: ing('Huile d\'olive').id, quantity: 10, unit: 'ml' },
            { ingredientId: ing('Citron').id, quantity: 0.5, unit: 'pièce' },
          ],
        },
      },
    },
  });

  // 8. Smoothie bowl
  const recipe8 = await prisma.recipe.create({
    data: {
      name: 'Smoothie bowl banane & myrtilles',
      description: 'Petit-déjeuner frais et vitaminé. Prêt en 5 minutes.',
      prepTimeMin: 5,
      cookTimeMin: 0,
      servings: 1,
      difficulty: 'EASY',
      instructions: [
        'Mixer la banane congelée avec le lait d\'amande et les myrtilles.',
        'Verser dans un bowl.',
        'Topper avec des flocons d\'avoine et du beurre de cacahuète.',
      ],
      caloriesPerServing: 350,
      proteinPerServing: 12,
      carbsPerServing: 52,
      fatPerServing: 12,
      fiberPerServing: 7,
      nutriScore: 'A',
      greenScore: 85,
      tags: {
        createMany: {
          data: [
            { tag: 'breakfast' },
            { tag: 'quick' },
            { tag: 'vegetarian' },
            { tag: 'vegan' },
            { tag: 'lactose-free' },
          ],
        },
      },
      ingredients: {
        createMany: {
          data: [
            { ingredientId: ing('Banane').id, quantity: 1, unit: 'pièce' },
            { ingredientId: ing('Myrtilles').id, quantity: 80, unit: 'g' },
            { ingredientId: ing('Lait d\'amande').id, quantity: 150, unit: 'ml' },
            { ingredientId: ing('Flocons d\'avoine').id, quantity: 20, unit: 'g' },
            { ingredientId: ing('Beurre de cacahuète').id, quantity: 10, unit: 'g' },
          ],
        },
      },
    },
  });

  // 9. Wok poulet légumes
  const recipe9 = await prisma.recipe.create({
    data: {
      name: 'Wok poulet & légumes sauce soja',
      description: 'Sauté rapide à l\'asiatique. Beaucoup de protéines, peu de gras.',
      prepTimeMin: 10,
      cookTimeMin: 12,
      servings: 2,
      difficulty: 'MEDIUM',
      instructions: [
        'Couper le poulet en lamelles.',
        'Émincer le poivron et la courgette.',
        'Faire chauffer l\'huile dans un wok à feu vif.',
        'Saisir le poulet 4-5 min, réserver.',
        'Sauter les légumes 3-4 min, remettre le poulet.',
        'Déglacer avec la sauce soja et le miel.',
        'Servir avec du riz basmati.',
      ],
      caloriesPerServing: 440,
      proteinPerServing: 38,
      carbsPerServing: 42,
      fatPerServing: 11,
      fiberPerServing: 4,
      nutriScore: 'A',
      greenScore: 60,
      tags: {
        createMany: {
          data: [
            { tag: 'high-protein' },
            { tag: 'quick' },
            { tag: 'lactose-free' },
          ],
        },
      },
      ingredients: {
        createMany: {
          data: [
            { ingredientId: ing('Blanc de poulet').id, quantity: 300, unit: 'g' },
            { ingredientId: ing('Poivron rouge').id, quantity: 150, unit: 'g' },
            { ingredientId: ing('Courgette').id, quantity: 150, unit: 'g' },
            { ingredientId: ing('Riz basmati').id, quantity: 120, unit: 'g' },
            { ingredientId: ing('Sauce soja').id, quantity: 30, unit: 'ml' },
            { ingredientId: ing('Miel').id, quantity: 15, unit: 'g' },
            { ingredientId: ing('Huile d\'olive').id, quantity: 10, unit: 'ml' },
          ],
        },
      },
    },
  });

  // 10. Caprese protéiné
  const recipe10 = await prisma.recipe.create({
    data: {
      name: 'Salade caprese protéinée au poulet',
      description: 'Salade italienne enrichie en protéines. Fraîche et rassasiante.',
      prepTimeMin: 10,
      cookTimeMin: 10,
      servings: 1,
      difficulty: 'EASY',
      instructions: [
        'Griller le blanc de poulet, couper en tranches.',
        'Couper les tomates et la mozzarella en rondelles.',
        'Disposer en alternance: tomate, mozzarella, poulet.',
        'Arroser d\'huile d\'olive et de citron.',
        'Assaisonner avec du basilic frais.',
      ],
      caloriesPerServing: 460,
      proteinPerServing: 45,
      carbsPerServing: 10,
      fatPerServing: 27,
      fiberPerServing: 2,
      nutriScore: 'B',
      greenScore: 65,
      tags: {
        createMany: {
          data: [
            { tag: 'high-protein' },
            { tag: 'low-carb' },
            { tag: 'quick' },
            { tag: 'gluten-free' },
            { tag: 'keto' },
          ],
        },
      },
      ingredients: {
        createMany: {
          data: [
            { ingredientId: ing('Blanc de poulet').id, quantity: 150, unit: 'g' },
            { ingredientId: ing('Mozzarella').id, quantity: 80, unit: 'g' },
            { ingredientId: ing('Tomates').id, quantity: 200, unit: 'g' },
            { ingredientId: ing('Huile d\'olive').id, quantity: 10, unit: 'ml' },
            { ingredientId: ing('Citron').id, quantity: 0.5, unit: 'pièce' },
          ],
        },
      },
    },
  });

  console.log(`✅ Seeded ${ingredients.length} ingredients`);
  console.log(`✅ Seeded 10 recipes`);
  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
