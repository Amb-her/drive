import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const images: Record<string, string> = {
  'Poulet grillé, riz basmati & brocoli':
    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80',
  'Poke bowl saumon & avocat':
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  'Overnight oats protéinés':
    'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80',
  'Salade de quinoa, tofu & légumes grillés':
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  'Pâtes complètes bolognaise protéinées':
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
  'Omelette épinards & fromage blanc':
    'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80',
  'Bowl patate douce & thon':
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  'Smoothie bowl banane & myrtilles':
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80',
  'Wok poulet & légumes sauce soja':
    'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
  'Salade caprese protéinée au poulet':
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
};

async function main() {
  for (const [name, imageUrl] of Object.entries(images)) {
    const result = await prisma.recipe.updateMany({ where: { name }, data: { imageUrl } });
    console.log(`✅ ${name}: ${result.count} mis à jour`);
  }
  console.log('🎉 Images mises à jour !');
  await prisma.$disconnect();
}

main().catch(console.error);
