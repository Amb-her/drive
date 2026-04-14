import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Recipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les recettes avec filtres' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'tags', required: false, type: String, description: 'Comma-separated tags' })
  @ApiQuery({ name: 'maxPrepTime', required: false, type: Number })
  @ApiQuery({ name: 'difficulty', required: false, enum: ['EASY', 'MEDIUM', 'HARD'] })
  @ApiQuery({ name: 'nutriScore', required: false, enum: ['A', 'B', 'C', 'D', 'E'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('tags') tags?: string,
    @Query('maxPrepTime') maxPrepTime?: string,
    @Query('difficulty') difficulty?: string,
    @Query('nutriScore') nutriScore?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.recipesService.findAll({
      search,
      tags: tags ? tags.split(',') : undefined,
      maxPrepTime: maxPrepTime ? parseInt(maxPrepTime) : undefined,
      difficulty,
      nutriScore,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Recettes recommandées selon macros restantes' })
  @ApiQuery({ name: 'mealType', required: false, enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] })
  getRecommendations(
    @CurrentUser('id') userId: string,
    @Query('mealType') mealType?: string,
  ) {
    return this.recipesService.getRecommendations(userId, mealType);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Mes recettes favorites' })
  getFavorites(@CurrentUser('id') userId: string) {
    return this.recipesService.getFavorites(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une recette' })
  findById(@Param('id') id: string) {
    return this.recipesService.findById(id);
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: 'Ajouter/retirer des favoris' })
  toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('id') recipeId: string,
  ) {
    return this.recipesService.toggleFavorite(userId, recipeId);
  }
}
