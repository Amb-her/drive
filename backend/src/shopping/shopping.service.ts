import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriveService } from './drive.service';

@Injectable()
export class ShoppingService {
  constructor(
    private prisma: PrismaService,
    private drive: DriveService,
  ) {}

  /**
   * Récupérer la liste de courses active
   */
  async getActiveList(userId: string) {
    let list = await this.prisma.shoppingList.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        items: { include: { driveProduct: true }, orderBy: { category: 'asc' } },
      },
    });

    if (!list) {
      list = await this.prisma.shoppingList.create({
        data: { userId, name: 'Ma liste' },
        include: { items: { include: { driveProduct: true } } },
      });
    }

    return list;
  }

  /**
   * Ajouter les ingrédients d'une recette au panier
   * Fusion intelligente: si l'ingrédient existe déjà, on cumule les quantités
   */
  async addRecipeToCart(userId: string, recipeId: string, servings: number = 1) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { ingredients: { include: { ingredient: true } } },
    });

    if (!recipe) {
      throw new NotFoundException('Recette non trouvée');
    }

    const list = await this.getActiveList(userId);

    for (const ri of recipe.ingredients) {
      const adjustedQty = ri.quantity * (servings / recipe.servings);

      // Chercher si l'ingrédient est déjà dans la liste
      const existingItem = await this.prisma.shoppingItem.findFirst({
        where: {
          shoppingListId: list.id,
          ingredientName: ri.ingredient.name,
          unit: ri.unit,
          checked: false,
        },
      });

      if (existingItem) {
        // Fusion: cumuler les quantités
        await this.prisma.shoppingItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + adjustedQty },
        });
      } else {
        // Chercher un produit drive correspondant
        const driveProduct = await this.drive.findProduct(ri.ingredient.name);

        await this.prisma.shoppingItem.create({
          data: {
            shoppingListId: list.id,
            ingredientName: ri.ingredient.name,
            quantity: adjustedQty,
            unit: ri.unit,
            category: ri.ingredient.category,
            driveProductId: driveProduct?.id,
          },
        });
      }
    }

    return this.getActiveList(userId);
  }

  /**
   * Cocher/décocher un item
   */
  async toggleItem(userId: string, itemId: string) {
    const item = await this.prisma.shoppingItem.findUnique({
      where: { id: itemId },
      include: { shoppingList: true },
    });

    if (!item || item.shoppingList.userId !== userId) {
      throw new NotFoundException('Item non trouvé');
    }

    return this.prisma.shoppingItem.update({
      where: { id: itemId },
      data: { checked: !item.checked },
    });
  }

  /**
   * Supprimer un item
   */
  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.shoppingItem.findUnique({
      where: { id: itemId },
      include: { shoppingList: true },
    });

    if (!item || item.shoppingList.userId !== userId) {
      throw new NotFoundException('Item non trouvé');
    }

    await this.prisma.shoppingItem.delete({ where: { id: itemId } });
    return { deleted: true };
  }

  /**
   * Vider la liste
   */
  async clearList(userId: string) {
    const list = await this.getActiveList(userId);
    await this.prisma.shoppingItem.deleteMany({
      where: { shoppingListId: list.id },
    });
    return this.getActiveList(userId);
  }

  /**
   * Générer le panier drive
   */
  async generateDriveCart(userId: string) {
    const list = await this.prisma.shoppingList.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        items: {
          where: { checked: false },
          include: { driveProduct: true },
        },
      },
    });

    if (!list || list.items.length === 0) {
      return { items: [], totalPrice: 0 };
    }

    const driveItems = await Promise.all(
      list.items.map(async (item) => {
        let product = item.driveProduct;
        if (!product) {
          product = await this.drive.findProduct(item.ingredientName);
        }

        return {
          ingredient: item.ingredientName,
          quantity: item.quantity,
          unit: item.unit,
          product: product
            ? {
                name: product.productName,
                price: product.price,
                url: product.productUrl,
                image: product.imageUrl,
              }
            : null,
        };
      }),
    );

    const totalPrice = driveItems.reduce(
      (sum, item) => sum + (item.product?.price ?? 0),
      0,
    );

    return {
      items: driveItems,
      totalPrice: Math.round(totalPrice * 100) / 100,
      driveUrl: this.drive.generateCartUrl(driveItems),
    };
  }
}
