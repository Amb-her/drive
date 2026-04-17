import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const MEAL_TAGS: Record<string, string[]> = {
  'Poulet grillé, riz basmati & brocoli':      ['lunch', 'dinner'],
  'Poke bowl saumon & avocat':                  ['lunch', 'dinner'],
  'Overnight oats protéinés':                   [],                   // has 'breakfast'
  'Salade de quinoa, tofu & légumes grillés':   ['lunch', 'dinner'],
  'Pâtes complètes bolognaise protéinées':      ['dinner'],
  'Omelette épinards & fromage blanc':          ['breakfast', 'lunch', 'snack'],
  'Bowl patate douce & thon':                   ['lunch', 'dinner'],
  'Smoothie bowl banane & myrtilles':           ['snack'],            // has 'breakfast'
  'Wok poulet & légumes sauce soja':            ['lunch', 'dinner'],
  'Salade caprese protéinée au poulet':         ['lunch', 'snack'],
};

async function main() {
  for (const [name, tags] of Object.entries(MEAL_TAGS)) {
    const recipe = await prisma.recipe.findFirst({ where: { name } });
    if (!recipe) { console.log(`❌ Not found: ${name}`); continue; }
    for (const tag of tags) {
      await prisma.recipeTag.upsert({
        where: { recipeId_tag: { recipeId: recipe.id, tag } },
        update: {},
        create: { recipeId: recipe.id, tag },
      });
    }
    console.log(`✅ ${name} → [${tags.join(', ')}]`);
  }
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
