import { Injectable } from '@nestjs/common';

interface NutritionInput {
  sex: 'MALE' | 'FEMALE';
  weightKg: number;
  heightCm: number;
  age: number;
  activityLevel: string;
  goal: string;
  morphology: string;
  trackMenstrualCycle?: boolean;
  cycleStartDate?: Date | null;
  cycleLengthDays?: number | null;
}

interface NutritionResult {
  bmr: number;
  dailyCalories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
}

@Injectable()
export class NutritionService {
  /**
   * Calcul BMR - Formule Mifflin-St Jeor
   * Homme: (10 × poids kg) + (6.25 × taille cm) − (5 × âge) + 5
   * Femme: (10 × poids kg) + (6.25 × taille cm) − (5 × âge) − 161
   */
  calculateBMR(sex: string, weightKg: number, heightCm: number, age: number): number {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return sex === 'MALE' ? base + 5 : base - 161;
  }

  /**
   * Multiplicateur d'activité (TDEE = BMR × multiplicateur)
   */
  getActivityMultiplier(level: string): number {
    const multipliers: Record<string, number> = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.375,
      ACTIVE: 1.55,
      VERY_ACTIVE: 1.725,
      ATHLETE: 1.9,
    };
    return multipliers[level] || 1.55;
  }

  /**
   * Ajustement calorique selon l'objectif
   */
  getGoalAdjustment(goal: string): number {
    const adjustments: Record<string, number> = {
      FAT_LOSS: -0.2,       // -20% déficit
      MUSCLE_GAIN: 0.15,    // +15% surplus
      MAINTAIN: 0,           // Maintenance
      HEALTHY_EATING: 0,     // Maintenance
    };
    return adjustments[goal] || 0;
  }

  /**
   * Ajustement morphologique
   * Ectomorphe: +5% (métabolisme rapide)
   * Endomorphe: -5% (métabolisme lent)
   */
  getMorphologyAdjustment(morphology: string): number {
    const adjustments: Record<string, number> = {
      ECTOMORPH: 0.05,
      MESOMORPH: 0,
      ENDOMORPH: -0.05,
    };
    return adjustments[morphology] || 0;
  }

  /**
   * Ajustement cycle menstruel
   * Phase lutéale (jours 15-28): +5-10% besoins caloriques
   * Phase folliculaire (jours 1-14): standard
   */
  getMenstrualAdjustment(cycleStartDate: Date | null, cycleLengthDays: number | null): number {
    if (!cycleStartDate || !cycleLengthDays) return 0;

    const today = new Date();
    const daysSinceStart = Math.floor(
      (today.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const currentDay = ((daysSinceStart % cycleLengthDays) + cycleLengthDays) % cycleLengthDays;

    // Phase lutéale: seconde moitié du cycle
    if (currentDay >= cycleLengthDays / 2) {
      return 0.07; // +7%
    }
    return 0;
  }

  /**
   * Répartition des macros selon l'objectif
   * Protéines toujours prioritaires basées sur le poids
   */
  calculateMacros(
    dailyCalories: number,
    weightKg: number,
    goal: string,
  ): { proteinGrams: number; carbGrams: number; fatGrams: number } {
    let proteinPerKg: number;
    let fatRatio: number;

    switch (goal) {
      case 'FAT_LOSS':
        proteinPerKg = 2.2;  // Haute protéine pour préserver la masse musculaire
        fatRatio = 0.25;     // 25% des calories en lipides
        break;
      case 'MUSCLE_GAIN':
        proteinPerKg = 2.0;
        fatRatio = 0.25;
        break;
      case 'MAINTAIN':
      case 'HEALTHY_EATING':
      default:
        proteinPerKg = 1.6;
        fatRatio = 0.30;
        break;
    }

    const proteinGrams = Math.round(weightKg * proteinPerKg);
    const proteinCalories = proteinGrams * 4;

    const fatCalories = dailyCalories * fatRatio;
    const fatGrams = Math.round(fatCalories / 9);

    const remainingCalories = dailyCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(Math.max(remainingCalories / 4, 50)); // Minimum 50g glucides

    return { proteinGrams, carbGrams, fatGrams };
  }

  /**
   * Calcul complet : BMR → TDEE → ajustements → macros
   */
  calculateAll(input: NutritionInput): NutritionResult {
    const bmr = this.calculateBMR(input.sex, input.weightKg, input.heightCm, input.age);
    const tdee = bmr * this.getActivityMultiplier(input.activityLevel);

    const goalAdj = this.getGoalAdjustment(input.goal);
    const morphAdj = this.getMorphologyAdjustment(input.morphology);

    let menstrualAdj = 0;
    if (input.sex === 'FEMALE' && input.trackMenstrualCycle) {
      menstrualAdj = this.getMenstrualAdjustment(
        input.cycleStartDate ?? null,
        input.cycleLengthDays ?? null,
      );
    }

    const dailyCalories = Math.round(tdee * (1 + goalAdj + morphAdj + menstrualAdj));
    const macros = this.calculateMacros(dailyCalories, input.weightKg, input.goal);

    return {
      bmr: Math.round(bmr),
      dailyCalories,
      ...macros,
    };
  }
}
