import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ShoppingService } from './shopping.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Shopping')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/shopping')
export class ShoppingController {
  constructor(private shoppingService: ShoppingService) {}

  @Get()
  @ApiOperation({ summary: 'Ma liste de courses active' })
  getActiveList(@CurrentUser('id') userId: string) {
    return this.shoppingService.getActiveList(userId);
  }

  @Post('add-recipe/:recipeId')
  @ApiOperation({ summary: 'Ajouter une recette au panier' })
  @ApiQuery({ name: 'servings', required: false, type: Number })
  addRecipe(
    @CurrentUser('id') userId: string,
    @Param('recipeId') recipeId: string,
    @Query('servings') servings?: string,
  ) {
    return this.shoppingService.addRecipeToCart(
      userId,
      recipeId,
      servings ? parseInt(servings) : 1,
    );
  }

  @Post('toggle/:itemId')
  @ApiOperation({ summary: 'Cocher/décocher un article' })
  toggleItem(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.shoppingService.toggleItem(userId, itemId);
  }

  @Delete('item/:itemId')
  @ApiOperation({ summary: 'Supprimer un article' })
  removeItem(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.shoppingService.removeItem(userId, itemId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Vider la liste' })
  clearList(@CurrentUser('id') userId: string) {
    return this.shoppingService.clearList(userId);
  }

  @Get('drive-cart')
  @ApiOperation({ summary: 'Générer le panier drive' })
  generateDriveCart(@CurrentUser('id') userId: string) {
    return this.shoppingService.generateDriveCart(userId);
  }
}
