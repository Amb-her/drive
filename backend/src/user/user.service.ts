import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NutritionService } from '../nutrition/nutrition.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ConstraintType } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private nutrition: NutritionService,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { dietaryConstraints: true },
    });

    if (!profile) {
      throw new NotFoundException('Profil non trouvé. Complétez l\'onboarding.');
    }

    return profile;
  }

  async createOrUpdateProfile(userId: string, dto: CreateProfileDto) {
    // Calculer les valeurs nutritionnelles
    const nutritionResult = this.nutrition.calculateAll({
      sex: dto.sex,
      weightKg: dto.weightKg,
      heightCm: dto.heightCm,
      age: dto.age,
      activityLevel: dto.activityLevel,
      goal: dto.goal,
      morphology: dto.morphology,
      trackMenstrualCycle: dto.trackMenstrualCycle,
      cycleStartDate: dto.cycleStartDate ? new Date(dto.cycleStartDate) : null,
      cycleLengthDays: dto.cycleLengthDays ?? null,
    });

    const profileData = {
      age: dto.age,
      sex: dto.sex as any,
      heightCm: dto.heightCm,
      weightKg: dto.weightKg,
      morphology: dto.morphology as any,
      activityLevel: dto.activityLevel as any,
      goal: dto.goal as any,
      adultsCount: dto.adultsCount ?? 1,
      childrenCount: dto.childrenCount ?? 0,
      kitchenEquipment: dto.kitchenEquipment ?? [],
      dislikedIngredients: dto.dislikedIngredients ?? [],
      trackMenstrualCycle: dto.trackMenstrualCycle ?? false,
      cycleStartDate: dto.cycleStartDate ? new Date(dto.cycleStartDate) : null,
      cycleLengthDays: dto.cycleLengthDays ?? null,
      bmr: nutritionResult.bmr,
      dailyCalories: nutritionResult.dailyCalories,
      proteinGrams: nutritionResult.proteinGrams,
      carbGrams: nutritionResult.carbGrams,
      fatGrams: nutritionResult.fatGrams,
    };

    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...profileData },
      update: profileData,
    });

    // Gérer les contraintes alimentaires
    if (dto.dietaryConstraints) {
      await this.prisma.dietaryConstraint.deleteMany({
        where: { profileId: profile.id },
      });

      if (dto.dietaryConstraints.length > 0) {
        await this.prisma.dietaryConstraint.createMany({
          data: dto.dietaryConstraints.map((type) => ({
            profileId: profile.id,
            type: type as ConstraintType,
          })),
        });
      }
    }

    return this.prisma.userProfile.findUnique({
      where: { id: profile.id },
      include: { dietaryConstraints: true },
    });
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profile: {
          include: { dietaryConstraints: true },
        },
      },
    });
  }
}
