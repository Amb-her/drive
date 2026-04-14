'use client';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  prepTimeMin: number;
  cookTimeMin: number;
  servings: number;
  difficulty: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  fiberPerServing: number;
  nutriScore: string;
  greenScore: number;
  matchScore?: number;
  tags?: { tag: string }[];
}

interface RecipeCardProps {
  recipe: Recipe;
  variant?: 'grid' | 'list';
  onAddToCart?: (recipe: Recipe) => void;
  onLog?: (recipe: Recipe) => void;
  onDetail?: (recipe: Recipe) => void;
}

export const NUTRISCORE_COLOR: Record<string, string> = {
  A: '#22c55e', B: '#84cc16', C: '#eab308', D: '#f97316', E: '#ef4444',
};

export function RecipeCard({ recipe, variant = 'grid', onDetail }: RecipeCardProps) {
  const totalTime = recipe.prepTimeMin + recipe.cookTimeMin;
  const kcal = Math.round(recipe.caloriesPerServing);
  const prot = Math.round(recipe.proteinPerServing);

  if (variant === 'list') {
    return (
      <div
        className="flex items-center gap-4 p-3 bg-white rounded-2xl hover:bg-cream-50 transition-colors cursor-pointer"
        onClick={() => onDetail?.(recipe)}
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-200 shrink-0">
          {recipe.imageUrl
            ? <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-warm-900 truncate">{recipe.name}</p>
          <p className="text-xs text-warm-400 mt-0.5">{kcal} kcal · {prot}g prot · {totalTime} min</p>
        </div>
      </div>
    );
  }

  // ── Grid card — style Jow : minimal, warm, photo-first ──
  return (
    <div
      className="group bg-white rounded-3xl p-3 cursor-pointer hover:scale-[1.02] transition-transform duration-300 ease-out"
      onClick={() => onDetail?.(recipe)}
    >
      {/* Photo — padded inside card, own radius */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-200 mb-3">
        {recipe.imageUrl
          ? <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
            />
          : <div className="w-full h-full bg-cream-200" />
        }

        {/* Time pill — bottom right, subtle */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-warm-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
          {totalTime} min
        </div>
      </div>

      {/* Text */}
      <div className="px-1 pb-1">
        <h3 className="font-semibold text-warm-900 text-[15px] leading-snug mb-1 line-clamp-2">
          {recipe.name}
        </h3>
        <p className="text-[12px] text-warm-400">
          {kcal} kcal · {prot}g protéines
        </p>
      </div>
    </div>
  );
}
