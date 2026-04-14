import { IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogMealDto {
  @ApiProperty({ description: 'ID de la recette' })
  @IsString()
  recipeId: string;

  @ApiProperty({ enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] })
  @IsEnum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const)
  mealType: string;

  @ApiPropertyOptional({ example: 1, description: 'Nombre de portions' })
  @IsOptional()
  @IsNumber()
  @Min(0.25)
  servings?: number;
}
