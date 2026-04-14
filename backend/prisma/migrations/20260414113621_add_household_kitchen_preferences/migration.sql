-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "adultsCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "childrenCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dislikedIngredients" TEXT[],
ADD COLUMN     "kitchenEquipment" TEXT[];
