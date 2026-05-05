import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop&q=80`;

async function upsertIngredient(data: any) {
  return prisma.ingredient.upsert({ where: { name: data.name }, update: {}, create: data });
}

async function main() {
  console.log('🌱 Ajout des ingrédients supplémentaires...');

  const newIngredients = await Promise.all([
    upsertIngredient({ name: 'Lentilles corail',  category: 'GRAIN',    unit: 'g',    caloriesPer100: 352, proteinPer100: 24,  carbsPer100: 60, fatPer100: 1.1, fiberPer100: 8   }),
    upsertIngredient({ name: 'Pois chiches',       category: 'PROTEIN',  unit: 'g',    caloriesPer100: 164, proteinPer100: 9,   carbsPer100: 27, fatPer100: 2.6, fiberPer100: 7.6 }),
    upsertIngredient({ name: 'Yaourt grec 0%',     category: 'DAIRY',    unit: 'g',    caloriesPer100: 57,  proteinPer100: 10,  carbsPer100: 4,  fatPer100: 0.4, fiberPer100: 0   }),
    upsertIngredient({ name: 'Feta',               category: 'DAIRY',    unit: 'g',    caloriesPer100: 264, proteinPer100: 14,  carbsPer100: 4,  fatPer100: 21,  fiberPer100: 0   }),
    upsertIngredient({ name: 'Haricots verts',     category: 'VEGETABLE',unit: 'g',    caloriesPer100: 31,  proteinPer100: 1.8, carbsPer100: 7,  fatPer100: 0.1, fiberPer100: 3.4 }),
    upsertIngredient({ name: 'Concombre',          category: 'VEGETABLE',unit: 'g',    caloriesPer100: 15,  proteinPer100: 0.7, carbsPer100: 3.6,fatPer100: 0.1, fiberPer100: 0.5 }),
    upsertIngredient({ name: 'Lait de coco',       category: 'BEVERAGE', unit: 'ml',   caloriesPer100: 197, proteinPer100: 2,   carbsPer100: 6,  fatPer100: 19,  fiberPer100: 0   }),
    upsertIngredient({ name: 'Edamame',            category: 'PROTEIN',  unit: 'g',    caloriesPer100: 122, proteinPer100: 11,  carbsPer100: 10, fatPer100: 5,   fiberPer100: 5   }),
    upsertIngredient({ name: 'Pain complet',       category: 'GRAIN',    unit: 'tranche', caloriesPer100: 247, proteinPer100: 9, carbsPer100: 42, fatPer100: 3.5, fiberPer100: 7 }),
    upsertIngredient({ name: 'Noix',               category: 'FAT',      unit: 'g',    caloriesPer100: 654, proteinPer100: 15,  carbsPer100: 14, fatPer100: 65,  fiberPer100: 6.7 }),
    upsertIngredient({ name: 'Framboises',         category: 'FRUIT',    unit: 'g',    caloriesPer100: 52,  proteinPer100: 1.2, carbsPer100: 12, fatPer100: 0.7, fiberPer100: 6.5 }),
    upsertIngredient({ name: 'Tahini',             category: 'FAT',      unit: 'g',    caloriesPer100: 595, proteinPer100: 17,  carbsPer100: 21, fatPer100: 54,  fiberPer100: 9   }),
    upsertIngredient({ name: 'Tomates cerises',    category: 'VEGETABLE',unit: 'g',    caloriesPer100: 18,  proteinPer100: 0.9, carbsPer100: 3.9,fatPer100: 0.2, fiberPer100: 1.2 }),
    upsertIngredient({ name: 'Carotte',            category: 'VEGETABLE',unit: 'g',    caloriesPer100: 41,  proteinPer100: 0.9, carbsPer100: 10, fatPer100: 0.2, fiberPer100: 2.8 }),
    upsertIngredient({ name: 'Paprika',            category: 'CONDIMENT',unit: 'g',    caloriesPer100: 282, proteinPer100: 14,  carbsPer100: 54, fatPer100: 13,  fiberPer100: 35  }),
    upsertIngredient({ name: 'Cumin',              category: 'CONDIMENT',unit: 'g',    caloriesPer100: 375, proteinPer100: 18,  carbsPer100: 44, fatPer100: 22,  fiberPer100: 11  }),
    upsertIngredient({ name: 'Gingembre',          category: 'CONDIMENT',unit: 'g',    caloriesPer100: 80,  proteinPer100: 1.8, carbsPer100: 18, fatPer100: 0.8, fiberPer100: 2   }),
    upsertIngredient({ name: 'Ail',                category: 'CONDIMENT',unit: 'g',    caloriesPer100: 149, proteinPer100: 6,   carbsPer100: 33, fatPer100: 0.5, fiberPer100: 2.1 }),
  ]);

  const all = await prisma.ingredient.findMany();
  const ing = (name: string) => {
    const found = all.find(i => i.name === name);
    if (!found) throw new Error(`Ingrédient introuvable: ${name}`);
    return found;
  };

  console.log('🍳 Ajout des recettes...');

  const recipes = [
    // ── PETIT-DÉJ ────────────────────────────────────────────────────────────
    {
      name: 'Pancakes protéinés banane',
      description: 'Moelleux, naturellement sucrés, riches en protéines. Prêts en 10 minutes.',
      imageUrl: img('1567620905732-2d1ec7ab7445'),
      prepTimeMin: 5, cookTimeMin: 10, servings: 2, difficulty: 'EASY' as const,
      instructions: ['Écraser la banane à la fourchette dans un bol.', 'Ajouter les oeufs, le fromage blanc et les flocons d\'avoine. Mélanger.', 'Laisser reposer 2 minutes pour que l\'avoine gonfle.', 'Cuire des petites crêpes épaisses dans une poêle légèrement huilée, 2 min par côté à feu moyen.', 'Servir avec un filet de miel et des myrtilles fraîches.'],
      caloriesPerServing: 340, proteinPerServing: 22, carbsPerServing: 44, fatPerServing: 8, fiberPerServing: 5,
      nutriScore: 'A' as const, greenScore: 78,
      tags: ['breakfast', 'quick', 'vegetarian', 'high-protein'],
      ingredients: [{ name: 'Flocons d\'avoine', qty: 80, unit: 'g' }, { name: 'Oeufs', qty: 2, unit: 'pièce' }, { name: 'Banane', qty: 1, unit: 'pièce' }, { name: 'Fromage blanc 0%', qty: 100, unit: 'g' }, { name: 'Miel', qty: 10, unit: 'g' }, { name: 'Myrtilles', qty: 40, unit: 'g' }],
    },
    {
      name: 'Toast avocat & œuf poché',
      description: 'Le classique healthy. Pain complet, avocat crémeux, œuf coulant et citron.',
      imageUrl: img('1588137378633-dea1336ce1e2'),
      prepTimeMin: 5, cookTimeMin: 8, servings: 1, difficulty: 'EASY' as const,
      instructions: ['Porter une casserole d\'eau frémissante à ébullition avec un filet de vinaigre.', 'Casser l\'oeuf dans une tasse, créer un tourbillon et plonger l\'oeuf doucement. Cuire 3 min.', 'Toaster le pain complet.', 'Écraser l\'avocat avec du citron, sel et poivre.', 'Tartiner le toast, déposer l\'oeuf poché par-dessus. Saler, poivrer.'],
      caloriesPerServing: 360, proteinPerServing: 18, carbsPerServing: 28, fatPerServing: 22, fiberPerServing: 8,
      nutriScore: 'A' as const, greenScore: 72,
      tags: ['breakfast', 'lunch', 'quick', 'vegetarian'],
      ingredients: [{ name: 'Pain complet', qty: 2, unit: 'tranche' }, { name: 'Avocat', qty: 0.5, unit: 'pièce' }, { name: 'Oeufs', qty: 2, unit: 'pièce' }, { name: 'Citron', qty: 0.5, unit: 'pièce' }],
    },
    {
      name: 'Bowl yaourt grec & fruits rouges',
      description: 'Fraîcheur et protéines dès le matin. Yaourt épais, framboises, noix et miel.',
      imageUrl: img('1488477181946-6428a0291777'),
      prepTimeMin: 3, cookTimeMin: 0, servings: 1, difficulty: 'EASY' as const,
      instructions: ['Verser le yaourt grec dans un bol.', 'Ajouter les framboises et les myrtilles.', 'Parsemer de noix concassées.', 'Arroser d\'un filet de miel.', 'Servir immédiatement.'],
      caloriesPerServing: 280, proteinPerServing: 20, carbsPerServing: 25, fatPerServing: 11, fiberPerServing: 5,
      nutriScore: 'A' as const, greenScore: 80,
      tags: ['breakfast', 'snack', 'quick', 'vegetarian', 'gluten-free'],
      ingredients: [{ name: 'Yaourt grec 0%', qty: 200, unit: 'g' }, { name: 'Framboises', qty: 80, unit: 'g' }, { name: 'Myrtilles', qty: 40, unit: 'g' }, { name: 'Noix', qty: 20, unit: 'g' }, { name: 'Miel', qty: 10, unit: 'g' }],
    },
    {
      name: 'Granola maison protéiné',
      description: 'Croquant, naturel, sans sucre ajouté. Se conserve 2 semaines.',
      imageUrl: img('1517686469429-8bdb88b9f907'),
      prepTimeMin: 10, cookTimeMin: 25, servings: 4, difficulty: 'EASY' as const,
      instructions: ['Préchauffer le four à 160°C.', 'Mélanger les flocons d\'avoine avec les noix, le miel et l\'huile d\'olive.', 'Étaler sur une plaque recouverte de papier cuisson.', 'Enfourner 20–25 min en remuant à mi-cuisson.', 'Laisser refroidir complètement (il durcit en refroidissant).', 'Ajouter les myrtilles séchées et conserver dans un bocal.'],
      caloriesPerServing: 380, proteinPerServing: 10, carbsPerServing: 46, fatPerServing: 18, fiberPerServing: 6,
      nutriScore: 'B' as const, greenScore: 82,
      tags: ['breakfast', 'snack', 'vegan', 'vegetarian', 'meal-prep'],
      ingredients: [{ name: 'Flocons d\'avoine', qty: 200, unit: 'g' }, { name: 'Noix', qty: 60, unit: 'g' }, { name: 'Miel', qty: 40, unit: 'g' }, { name: 'Huile d\'olive', qty: 20, unit: 'ml' }, { name: 'Myrtilles', qty: 50, unit: 'g' }],
    },
    // ── DÉJEUNER ─────────────────────────────────────────────────────────────
    {
      name: 'Soupe de lentilles corail & cumin',
      description: 'Soupe onctueuse, rassasiante et économique. Vegan et ultra-facile.',
      imageUrl: img('1547592180-85f173990554'),
      prepTimeMin: 10, cookTimeMin: 25, servings: 3, difficulty: 'EASY' as const,
      instructions: ['Faire revenir l\'ail et les carottes dans un filet d\'huile 3 min.', 'Ajouter le cumin et le paprika, mélanger 1 min.', 'Ajouter les lentilles et 800ml d\'eau. Porter à ébullition.', 'Laisser mijoter 20 min à couvert jusqu\'à ce que les lentilles soient fondantes.', 'Mixer jusqu\'à obtenir une soupe lisse.', 'Servir avec un filet de citron.'],
      caloriesPerServing: 300, proteinPerServing: 18, carbsPerServing: 48, fatPerServing: 5, fiberPerServing: 10,
      nutriScore: 'A' as const, greenScore: 92,
      tags: ['lunch', 'dinner', 'vegan', 'vegetarian', 'gluten-free', 'batch-cooking'],
      ingredients: [{ name: 'Lentilles corail', qty: 250, unit: 'g' }, { name: 'Carotte', qty: 200, unit: 'g' }, { name: 'Ail', qty: 10, unit: 'g' }, { name: 'Cumin', qty: 5, unit: 'g' }, { name: 'Paprika', qty: 3, unit: 'g' }, { name: 'Huile d\'olive', qty: 15, unit: 'ml' }, { name: 'Citron', qty: 1, unit: 'pièce' }],
    },
    {
      name: 'Buddha bowl poulet & légumes rôtis',
      description: 'Bowl complet et coloré. Toutes les bonnes choses dans un seul bol.',
      imageUrl: img('1512621776951-a57141f2eefd'),
      prepTimeMin: 15, cookTimeMin: 25, servings: 1, difficulty: 'MEDIUM' as const,
      instructions: ['Préchauffer le four à 200°C.', 'Couper la courgette, le poivron et les tomates cerises en morceaux.', 'Rôtir les légumes au four 20–25 min avec huile, sel, poivre.', 'Cuire le quinoa selon les instructions.', 'Griller le blanc de poulet à la poêle 5–6 min par côté.', 'Assembler : quinoa, légumes rôtis, poulet tranché. Arroser de citron.'],
      caloriesPerServing: 480, proteinPerServing: 40, carbsPerServing: 45, fatPerServing: 14, fiberPerServing: 7,
      nutriScore: 'A' as const, greenScore: 75,
      tags: ['lunch', 'dinner', 'high-protein', 'gluten-free', 'meal-prep'],
      ingredients: [{ name: 'Blanc de poulet', qty: 150, unit: 'g' }, { name: 'Quinoa', qty: 80, unit: 'g' }, { name: 'Courgette', qty: 100, unit: 'g' }, { name: 'Poivron rouge', qty: 100, unit: 'g' }, { name: 'Tomates cerises', qty: 80, unit: 'g' }, { name: 'Huile d\'olive', qty: 10, unit: 'ml' }, { name: 'Citron', qty: 0.5, unit: 'pièce' }],
    },
    {
      name: 'Wrap saumon fumé & avocat',
      description: 'Rapide, frais et protéiné. Parfait pour emporter.',
      imageUrl: img('1565299624946-b28f40a04ae9'),
      prepTimeMin: 10, cookTimeMin: 0, servings: 1, difficulty: 'EASY' as const,
      instructions: ['Étaler le fromage blanc sur le pain complet (ou tortilla).', 'Disposer les tranches de saumon.', 'Ajouter l\'avocat tranché, le concombre et les épinards.', 'Presser le citron, assaisonner.', 'Rouler serré et couper en deux.'],
      caloriesPerServing: 400, proteinPerServing: 28, carbsPerServing: 28, fatPerServing: 20, fiberPerServing: 6,
      nutriScore: 'A' as const, greenScore: 65,
      tags: ['lunch', 'snack', 'quick', 'high-protein'],
      ingredients: [{ name: 'Saumon frais', qty: 100, unit: 'g' }, { name: 'Avocat', qty: 0.5, unit: 'pièce' }, { name: 'Concombre', qty: 60, unit: 'g' }, { name: 'Fromage blanc 0%', qty: 50, unit: 'g' }, { name: 'Épinards', qty: 30, unit: 'g' }, { name: 'Citron', qty: 0.5, unit: 'pièce' }],
    },
    {
      name: 'Taboulé de quinoa & menthe',
      description: 'Version healthy du taboulé, avec du quinoa pour plus de protéines.',
      imageUrl: img('1505253716362-afaea1d3d1af'),
      prepTimeMin: 15, cookTimeMin: 15, servings: 2, difficulty: 'EASY' as const,
      instructions: ['Cuire le quinoa dans 2x son volume d\'eau, laisser refroidir.', 'Couper les tomates cerises en deux, le concombre en petits cubes.', 'Ciseler les épinards finement (pour remplacer le persil).', 'Mélanger quinoa refroidi, légumes, huile d\'olive et jus de citron.', 'Saler, poivrer, ajouter les herbes. Réfrigérer 30 min avant de servir.'],
      caloriesPerServing: 360, proteinPerServing: 14, carbsPerServing: 52, fatPerServing: 12, fiberPerServing: 6,
      nutriScore: 'A' as const, greenScore: 90,
      tags: ['lunch', 'dinner', 'vegan', 'vegetarian', 'gluten-free', 'meal-prep'],
      ingredients: [{ name: 'Quinoa', qty: 120, unit: 'g' }, { name: 'Tomates cerises', qty: 150, unit: 'g' }, { name: 'Concombre', qty: 100, unit: 'g' }, { name: 'Épinards', qty: 40, unit: 'g' }, { name: 'Huile d\'olive', qty: 20, unit: 'ml' }, { name: 'Citron', qty: 1, unit: 'pièce' }],
    },
    {
      name: 'Salade de pois chiches & feta',
      description: 'Fraîche, croquante, végétarienne. Parfaite pour le midi.',
      imageUrl: img('1540189549657-e27b2b3144c8'),
      prepTimeMin: 10, cookTimeMin: 0, servings: 1, difficulty: 'EASY' as const,
      instructions: ['Égoutter et rincer les pois chiches.', 'Couper les tomates cerises en deux, le concombre en dés.', 'Émietter la feta.', 'Mélanger tous les ingrédients dans un bol.', 'Assaisonner avec huile d\'olive, citron, sel et poivre.', 'Servir frais.'],
      caloriesPerServing: 380, proteinPerServing: 18, carbsPerServing: 38, fatPerServing: 18, fiberPerServing: 9,
      nutriScore: 'A' as const, greenScore: 85,
      tags: ['lunch', 'dinner', 'vegetarian', 'gluten-free', 'quick'],
      ingredients: [{ name: 'Pois chiches', qty: 200, unit: 'g' }, { name: 'Feta', qty: 60, unit: 'g' }, { name: 'Tomates cerises', qty: 100, unit: 'g' }, { name: 'Concombre', qty: 80, unit: 'g' }, { name: 'Huile d\'olive', qty: 15, unit: 'ml' }, { name: 'Citron', qty: 0.5, unit: 'pièce' }],
    },
    // ── DÎNER ────────────────────────────────────────────────────────────────
    {
      name: 'Saumon laqué citron & patate douce',
      description: 'Saumon fondant, patate douce rôtie, haricots verts croquants.',
      imageUrl: img('1467003909585-2f8a72700288'),
      prepTimeMin: 10, cookTimeMin: 25, servings: 1, difficulty: 'EASY' as const,
      instructions: ['Préchauffer le four à 200°C.', 'Couper la patate douce en cubes et rôtir 20 min avec huile, sel, poivre.', 'Badigeonner le saumon de sauce soja + miel + citron.', 'Cuire le saumon au four 12 min.', 'Blanchir les haricots verts 4 min dans l\'eau bouillante salée.', 'Dresser : saumon, patate douce, haricots verts. Arroser du reste de marinade.'],
      caloriesPerServing: 520, proteinPerServing: 38, carbsPerServing: 42, fatPerServing: 20, fiberPerServing: 7,
      nutriScore: 'A' as const, greenScore: 70,
      tags: ['dinner', 'lunch', 'high-protein', 'gluten-free', 'omega-3'],
      ingredients: [{ name: 'Saumon frais', qty: 180, unit: 'g' }, { name: 'Patate douce', qty: 200, unit: 'g' }, { name: 'Haricots verts', qty: 150, unit: 'g' }, { name: 'Sauce soja', qty: 20, unit: 'ml' }, { name: 'Miel', qty: 10, unit: 'g' }, { name: 'Citron', qty: 0.5, unit: 'pièce' }, { name: 'Huile d\'olive', qty: 10, unit: 'ml' }],
    },
    {
      name: 'Curry de pois chiches au lait de coco',
      description: 'Cremeux, parfumé, 100% végétal. Un classique qui réchauffe.',
      imageUrl: img('1565557623262-b51c2513a641'),
      prepTimeMin: 10, cookTimeMin: 25, servings: 2, difficulty: 'EASY' as const,
      instructions: ['Faire revenir l\'ail et le gingembre dans l\'huile 2 min.', 'Ajouter le curry en poudre et le cumin, faire revenir 1 min.', 'Ajouter les tomates, laisser réduire 5 min.', 'Ajouter les pois chiches et le lait de coco.', 'Laisser mijoter 15 min à feu doux en remuant.', 'Servir avec du riz basmati et un filet de citron.'],
      caloriesPerServing: 440, proteinPerServing: 16, carbsPerServing: 55, fatPerServing: 18, fiberPerServing: 10,
      nutriScore: 'A' as const, greenScore: 90,
      tags: ['dinner', 'vegan', 'vegetarian', 'gluten-free', 'batch-cooking', 'comfort-food'],
      ingredients: [{ name: 'Pois chiches', qty: 400, unit: 'g' }, { name: 'Lait de coco', qty: 200, unit: 'ml' }, { name: 'Tomates', qty: 200, unit: 'g' }, { name: 'Ail', qty: 10, unit: 'g' }, { name: 'Gingembre', qty: 10, unit: 'g' }, { name: 'Cumin', qty: 5, unit: 'g' }, { name: 'Huile d\'olive', qty: 15, unit: 'ml' }, { name: 'Riz basmati', qty: 120, unit: 'g' }],
    },
    {
      name: 'Poulet mariné tikka masala léger',
      description: 'Les saveurs de l\'Inde en version légère. Protéiné et savoureux.',
      imageUrl: img('1585937421612-70a008356fbe'),
      prepTimeMin: 15, cookTimeMin: 25, servings: 2, difficulty: 'MEDIUM' as const,
      instructions: ['Mariner le poulet 1h dans yaourt + paprika + cumin + gingembre + citron.', 'Faire revenir l\'ail dans l\'huile, ajouter les tomates et laisser réduire 5 min.', 'Ajouter le poulet mariné, faire dorer 5 min.', 'Verser 100ml d\'eau, couvrir et laisser mijoter 15 min.', 'Servir avec du riz basmati.'],
      caloriesPerServing: 420, proteinPerServing: 42, carbsPerServing: 30, fatPerServing: 14, fiberPerServing: 3,
      nutriScore: 'A' as const, greenScore: 62,
      tags: ['dinner', 'lunch', 'high-protein', 'gluten-free', 'batch-cooking'],
      ingredients: [{ name: 'Blanc de poulet', qty: 350, unit: 'g' }, { name: 'Yaourt grec 0%', qty: 100, unit: 'g' }, { name: 'Tomates', qty: 250, unit: 'g' }, { name: 'Ail', qty: 10, unit: 'g' }, { name: 'Gingembre', qty: 10, unit: 'g' }, { name: 'Paprika', qty: 5, unit: 'g' }, { name: 'Cumin', qty: 3, unit: 'g' }, { name: 'Riz basmati', qty: 100, unit: 'g' }, { name: 'Citron', qty: 0.5, unit: 'pièce' }, { name: 'Huile d\'olive', qty: 10, unit: 'ml' }],
    },
    {
      name: 'Steak haché & haricots verts sautés',
      description: 'Rapide, simple, efficace. Le classique du sportif.',
      imageUrl: img('1546833999-b9f581a1996d'),
      prepTimeMin: 5, cookTimeMin: 15, servings: 1, difficulty: 'EASY' as const,
      instructions: ['Sortir le steak du réfrigérateur 10 min avant.', 'Blanchir les haricots verts dans l\'eau bouillante salée 5 min.', 'Cuire le steak à la poêle très chaude 3–4 min par côté selon cuisson souhaitée.', 'Sauter les haricots dans la même poêle 2 min avec ail et huile d\'olive.', 'Saler et poivrer. Servir avec un filet de citron.'],
      caloriesPerServing: 360, proteinPerServing: 38, carbsPerServing: 10, fatPerServing: 18, fiberPerServing: 4,
      nutriScore: 'B' as const, greenScore: 45,
      tags: ['dinner', 'lunch', 'high-protein', 'gluten-free', 'low-carb', 'quick'],
      ingredients: [{ name: 'Steak haché 5%', qty: 180, unit: 'g' }, { name: 'Haricots verts', qty: 200, unit: 'g' }, { name: 'Ail', qty: 5, unit: 'g' }, { name: 'Huile d\'olive', qty: 10, unit: 'ml' }, { name: 'Citron', qty: 0.5, unit: 'pièce' }],
    },
    {
      name: 'Gratin de courgettes, feta & oeufs',
      description: 'Léger, fondant, végétarien. Un gratin qu\'on ne culpabilise pas.',
      imageUrl: img('1547592166-23ac45744acd'),
      prepTimeMin: 15, cookTimeMin: 30, servings: 2, difficulty: 'EASY' as const,
      instructions: ['Préchauffer le four à 180°C.', 'Râper les courgettes, presser pour enlever l\'excès d\'eau.', 'Mélanger courgettes, oeufs battus, feta émiettée, sel, poivre.', 'Verser dans un plat à gratin huilé.', 'Enfourner 30 min jusqu\'à ce que le dessus soit doré.', 'Laisser tiédir 5 min avant de servir.'],
      caloriesPerServing: 300, proteinPerServing: 22, carbsPerServing: 8, fatPerServing: 20, fiberPerServing: 2,
      nutriScore: 'B' as const, greenScore: 72,
      tags: ['dinner', 'vegetarian', 'gluten-free', 'low-carb', 'keto'],
      ingredients: [{ name: 'Courgette', qty: 400, unit: 'g' }, { name: 'Oeufs', qty: 4, unit: 'pièce' }, { name: 'Feta', qty: 100, unit: 'g' }, { name: 'Huile d\'olive', qty: 10, unit: 'ml' }],
    },
    // ── SNACKS ───────────────────────────────────────────────────────────────
    {
      name: 'Energy balls avoine & beurre de cacahuète',
      description: 'Énergie rapide, sans cuisson, sans sucre ajouté. 5 min à faire.',
      imageUrl: img('1604329760661-e71dc83f8f26'),
      prepTimeMin: 10, cookTimeMin: 0, servings: 3, difficulty: 'EASY' as const,
      instructions: ['Mélanger les flocons d\'avoine avec le beurre de cacahuète et le miel.', 'Si le mélange est trop sec, ajouter un peu de lait d\'amande.', 'Former des boules de la taille d\'une noix avec les mains.', 'Rouler dans des flocons d\'avoine ou des myrtilles lyophilisées.', 'Réfrigérer 30 min. Se conservent 5 jours au frais.'],
      caloriesPerServing: 200, proteinPerServing: 7, carbsPerServing: 24, fatPerServing: 9, fiberPerServing: 3,
      nutriScore: 'B' as const, greenScore: 75,
      tags: ['snack', 'breakfast', 'vegan', 'vegetarian', 'meal-prep', 'quick'],
      ingredients: [{ name: 'Flocons d\'avoine', qty: 120, unit: 'g' }, { name: 'Beurre de cacahuète', qty: 60, unit: 'g' }, { name: 'Miel', qty: 30, unit: 'g' }, { name: 'Myrtilles', qty: 30, unit: 'g' }],
    },
    {
      name: 'Houmous maison & crudités',
      description: 'Houmous crémeux fait maison en 5 min. Riche en fibres et protéines végétales.',
      imageUrl: img('1541014741259-de529411b96a'),
      prepTimeMin: 5, cookTimeMin: 0, servings: 2, difficulty: 'EASY' as const,
      instructions: ['Égoutter et rincer les pois chiches.', 'Mixer pois chiches, tahini, citron, ail et cumin jusqu\'à obtenir une pâte lisse.', 'Ajouter 3–4 cs d\'eau froide pour ajuster la consistance.', 'Servir avec un filet d\'huile d\'olive et du paprika.', 'Accompagner de crudités : carotte, concombre, poivron.'],
      caloriesPerServing: 220, proteinPerServing: 8, carbsPerServing: 24, fatPerServing: 11, fiberPerServing: 7,
      nutriScore: 'A' as const, greenScore: 88,
      tags: ['snack', 'vegan', 'vegetarian', 'gluten-free', 'quick', 'meal-prep'],
      ingredients: [{ name: 'Pois chiches', qty: 240, unit: 'g' }, { name: 'Tahini', qty: 30, unit: 'g' }, { name: 'Citron', qty: 1, unit: 'pièce' }, { name: 'Ail', qty: 5, unit: 'g' }, { name: 'Cumin', qty: 3, unit: 'g' }, { name: 'Huile d\'olive', qty: 15, unit: 'ml' }, { name: 'Carotte', qty: 100, unit: 'g' }, { name: 'Concombre', qty: 80, unit: 'g' }],
    },
    {
      name: 'Frittata aux épinards & tomates',
      description: 'Omelette italienne épaisse qui se mange chaude ou froide. Parfait pour le batch.',
      imageUrl: img('1482049016688-2d3e1b311543'),
      prepTimeMin: 5, cookTimeMin: 15, servings: 2, difficulty: 'EASY' as const,
      instructions: ['Préchauffer le four à 180°C.', 'Battre les oeufs avec du sel et du poivre.', 'Faire revenir les épinards dans une poêle allant au four 2 min.', 'Ajouter les tomates cerises coupées en deux.', 'Verser les oeufs battus, laisser prendre 3 min sur feu moyen.', 'Enfourner 8–10 min jusqu\'à ce que le dessus soit ferme.', 'Laisser tiédir, couper en parts.'],
      caloriesPerServing: 250, proteinPerServing: 22, carbsPerServing: 6, fatPerServing: 16, fiberPerServing: 2,
      nutriScore: 'A' as const, greenScore: 78,
      tags: ['breakfast', 'lunch', 'snack', 'vegetarian', 'gluten-free', 'low-carb', 'keto', 'meal-prep'],
      ingredients: [{ name: 'Oeufs', qty: 6, unit: 'pièce' }, { name: 'Épinards', qty: 150, unit: 'g' }, { name: 'Tomates cerises', qty: 100, unit: 'g' }, { name: 'Huile d\'olive', qty: 10, unit: 'ml' }],
    },
    {
      name: 'Bowl edamame, thon & riz',
      description: 'Protéines maximales, fraîcheur maximale. Vite fait, très nutritif.',
      imageUrl: img('1546069901-ba9599a7e63c'),
      prepTimeMin: 10, cookTimeMin: 20, servings: 1, difficulty: 'EASY' as const,
      instructions: ['Cuire le riz basmati.', 'Décongeler les edamame (les passer sous l\'eau chaude).', 'Émietter le thon en boîte.', 'Couper le concombre et l\'avocat en dés.', 'Assembler le bowl : riz, thon, edamame, concombre, avocat.', 'Assaisonner avec sauce soja et un filet de citron.'],
      caloriesPerServing: 480, proteinPerServing: 40, carbsPerServing: 48, fatPerServing: 14, fiberPerServing: 8,
      nutriScore: 'A' as const, greenScore: 68,
      tags: ['lunch', 'dinner', 'high-protein', 'gluten-free', 'quick'],
      ingredients: [{ name: 'Thon en boîte', qty: 120, unit: 'g' }, { name: 'Edamame', qty: 100, unit: 'g' }, { name: 'Riz basmati', qty: 80, unit: 'g' }, { name: 'Avocat', qty: 0.5, unit: 'pièce' }, { name: 'Concombre', qty: 60, unit: 'g' }, { name: 'Sauce soja', qty: 15, unit: 'ml' }, { name: 'Citron', qty: 0.5, unit: 'pièce' }],
    },
    {
      name: 'Riz sauté aux légumes & oeufs',
      description: 'Le riz sauté version healthy. Anti-gaspi parfait avec les restes.',
      imageUrl: img('1603133872878-684f208fb84b'),
      prepTimeMin: 5, cookTimeMin: 10, servings: 1, difficulty: 'EASY' as const,
      instructions: ['Faire chauffer l\'huile dans un wok ou grande poêle à feu vif.', 'Faire revenir le riz cuit (idéalement de la veille) 3 min.', 'Pousser le riz sur les bords, ajouter les oeufs battus au centre.', 'Brouiller les oeufs puis mélanger avec le riz.', 'Ajouter les épinards et la sauce soja, mélanger 2 min.', 'Servir avec un filet de citron.'],
      caloriesPerServing: 420, proteinPerServing: 18, carbsPerServing: 58, fatPerServing: 12, fiberPerServing: 3,
      nutriScore: 'B' as const, greenScore: 65,
      tags: ['lunch', 'dinner', 'quick', 'vegetarian', 'batch-cooking'],
      ingredients: [{ name: 'Riz basmati', qty: 120, unit: 'g' }, { name: 'Oeufs', qty: 2, unit: 'pièce' }, { name: 'Épinards', qty: 60, unit: 'g' }, { name: 'Sauce soja', qty: 20, unit: 'ml' }, { name: 'Huile d\'olive', qty: 10, unit: 'ml' }, { name: 'Citron', qty: 0.5, unit: 'pièce' }],
    },
  ];

  let count = 0;
  for (const r of recipes) {
    const { tags, ingredients, ...data } = r;

    const recipe = await prisma.recipe.create({
      data: {
        ...data,
        difficulty: data.difficulty,
        nutriScore: data.nutriScore,
        tags: { createMany: { data: tags.map(tag => ({ tag })) } },
        ingredients: {
          createMany: {
            data: ingredients.map(i => ({
              ingredientId: ing(i.name).id,
              quantity: i.qty,
              unit: i.unit,
            })),
          },
        },
      },
    });
    count++;
    console.log(`✅ ${recipe.name}`);
  }

  const total = await prisma.recipe.count();
  console.log(`\n🎉 ${count} recettes ajoutées — ${total} recettes au total.`);
}

main().catch(e => { console.error('❌', e); process.exit(1); }).finally(() => prisma.$disconnect());
