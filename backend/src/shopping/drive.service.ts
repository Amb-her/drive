import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Mock Drive Service
 * En production, cette classe serait remplacée par des appels réels
 * aux APIs Carrefour, Leclerc, etc.
 */
@Injectable()
export class DriveService {
  constructor(private prisma: PrismaService) {}

  /**
   * Chercher un produit dans le drive (mock)
   * En production: appel API Carrefour/Leclerc
   */
  async findProduct(ingredientName: string) {
    // Chercher dans notre base de données de produits drive
    const product = await this.prisma.driveProduct.findFirst({
      where: {
        ingredient: {
          name: { contains: ingredientName, mode: 'insensitive' },
        },
      },
      orderBy: { price: 'asc' },
    });

    return product;
  }

  /**
   * Générer une URL de panier drive (mock)
   * En production: utiliser l'API du drive pour créer un panier
   */
  generateCartUrl(items: any[]): string {
    // Mock URL - en production, ceci serait un lien vers le panier Carrefour/Leclerc
    const productIds = items
      .filter((i) => i.product)
      .map((i) => encodeURIComponent(i.product.name))
      .join(',');

    return `https://drive.mock.example/cart?products=${productIds}`;
  }

  /**
   * Mapper un ingrédient vers un produit drive
   * Algorithme: recherche par nom + catégorie + meilleur prix
   */
  async mapIngredientToProduct(ingredientId: string) {
    const products = await this.prisma.driveProduct.findMany({
      where: { ingredientId },
      orderBy: { price: 'asc' },
    });

    return products[0] || null;
  }
}
