import { IsEnum, IsInt, IsNumber, IsBoolean, IsOptional, IsArray, IsString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  // ─── Foyer ───────────────────────────────────────────
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  adultsCount?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  childrenCount?: number;

  // ─── Régime ──────────────────────────────────────────
  @ApiPropertyOptional({ example: ['GLUTEN_FREE', 'LACTOSE_FREE'] })
  @IsOptional()
  @IsArray()
  dietaryConstraints?: string[];

  // ─── Goûts (ingrédients à éviter) ────────────────────
  @ApiPropertyOptional({ example: ['Brocoli', 'Coriandre'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dislikedIngredients?: string[];

  // ─── Cuisine ─────────────────────────────────────────
  @ApiPropertyOptional({ example: ['OVEN', 'AIRFRYER', 'BLENDER'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  kitchenEquipment?: string[];

  // ─── Objectifs fitness ────────────────────────────────
  @ApiProperty({ enum: ['FAT_LOSS', 'MUSCLE_GAIN', 'MAINTAIN', 'HEALTHY_EATING'] })
  @IsEnum(['FAT_LOSS', 'MUSCLE_GAIN', 'MAINTAIN', 'HEALTHY_EATING'] as const)
  goal: 'FAT_LOSS' | 'MUSCLE_GAIN' | 'MAINTAIN' | 'HEALTHY_EATING';

  // ─── Physique ─────────────────────────────────────────
  @ApiProperty({ example: 28 })
  @IsInt()
  @Min(14)
  @Max(100)
  age: number;

  @ApiProperty({ enum: ['MALE', 'FEMALE'] })
  @IsEnum(['MALE', 'FEMALE'] as const)
  sex: 'MALE' | 'FEMALE';

  @ApiProperty({ example: 170, description: 'Taille en cm' })
  @IsNumber()
  @Min(100)
  @Max(250)
  heightCm: number;

  @ApiProperty({ example: 70, description: 'Poids en kg' })
  @IsNumber()
  @Min(30)
  @Max(300)
  weightKg: number;

  @ApiProperty({ enum: ['ECTOMORPH', 'MESOMORPH', 'ENDOMORPH'] })
  @IsEnum(['ECTOMORPH', 'MESOMORPH', 'ENDOMORPH'] as const)
  morphology: 'ECTOMORPH' | 'MESOMORPH' | 'ENDOMORPH';

  // ─── Activité ─────────────────────────────────────────
  @ApiProperty({ enum: ['SEDENTARY', 'LIGHTLY_ACTIVE', 'ACTIVE', 'VERY_ACTIVE', 'ATHLETE'] })
  @IsEnum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'ACTIVE', 'VERY_ACTIVE', 'ATHLETE'] as const)
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'ACTIVE' | 'VERY_ACTIVE' | 'ATHLETE';

  // ─── Cycle menstruel ──────────────────────────────────
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  trackMenstrualCycle?: boolean;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  cycleStartDate?: string;

  @ApiPropertyOptional({ example: 28 })
  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(40)
  cycleLengthDays?: number;
}
