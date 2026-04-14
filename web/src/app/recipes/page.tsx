'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { NavBar } from '@/components/NavBar';
import { RecipeCard, NUTRISCORE_COLOR, type Recipe } from '@/components/RecipeCard';

const MEAL_TABS = [
  { value: '',          label: 'Pour toi'  },
  { value: 'BREAKFAST', label: 'Petit-déj' },
  { value: 'LUNCH',     label: 'Déjeuner'  },
  { value: 'DINNER',    label: 'Dîner'     },
  { value: 'SNACK',     label: 'Snack'     },
];

const FILTER_TAGS = [
  { value: 'high-protein', label: 'Protéiné' },
  { value: 'quick',        label: 'Rapide'   },
  { value: 'vegan',        label: 'Vegan'    },
];

type ViewMode = 'grid' | 'list';

export default function RecipesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [filterTag, setFilterTag] = useState('');
  const [viewMode, setViewMode]   = useState<ViewMode>('grid');
  const [search, setSearch]       = useState('');
  const [data, setData]           = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState('');
  const [selected, setSelected]   = useState<Recipe | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const result = await api.getRecommendations(MEAL_TABS[activeTab].value || undefined);
      setData(result);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [activeTab, filterTag]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAddToCart = async (recipe: Recipe) => {
    try { await api.addRecipeToCart(recipe.id); showToast(`${recipe.name} ajouté au panier`); }
    catch (err) { console.error(err); }
  };

  const handleLog = async (recipe: Recipe) => {
    try {
      await api.logMeal({ recipeId: recipe.id, mealType: MEAL_TABS[activeTab].value || 'LUNCH' });
      showToast(`${recipe.name} enregistré`);
      load();
    } catch (err) { console.error(err); }
  };

  const recipes: Recipe[] = data?.recipes ?? [];

  return (
    <>
      <NavBar />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <RecipeDetail
          recipe={selected}
          onClose={() => setSelected(null)}
          onAddToCart={handleAddToCart}
          onLog={handleLog}
        />
      )}

      <main className="max-w-5xl mx-auto px-5 pt-4 pb-8 overflow-x-hidden">
        {/* Search */}
        <div className="mb-4">
          <input
            className="w-full px-5 py-3 rounded-2xl bg-white border-none text-sm placeholder:text-warm-300 focus:ring-2 focus:ring-brand-200 outline-none"
            placeholder="Rechercher une recette..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
        </div>

        {/* Pills — meal types + diet filters */}
        <div className="flex gap-2 flex-wrap mb-5">
          {MEAL_TABS.map((tab, i) => (
            <button
              key={`tab-${tab.value}`}
              onClick={() => { setActiveTab(i); setFilterTag(''); }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                activeTab === i && !filterTag
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-warm-500 hover:text-warm-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="w-px bg-warm-200 shrink-0 my-1" />
          {FILTER_TAGS.map((ft) => (
            <button
              key={`filter-${ft.value}`}
              onClick={() => setFilterTag(ft.value === filterTag ? '' : ft.value)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                filterTag === ft.value
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-warm-500 hover:text-warm-700'
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>

        {/* Grid / List */}
        {loading ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 lg:grid-cols-3 gap-4'
            : 'flex flex-col gap-2'
          }>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`bg-white rounded-3xl animate-pulse ${viewMode === 'grid' ? 'aspect-square' : 'h-20'}`} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-warm-400 text-sm">Aucune recette trouvée</p>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 lg:grid-cols-3 gap-4'
            : 'flex flex-col gap-2'
          }>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                variant={viewMode}
                onAddToCart={handleAddToCart}
                onLog={handleLog}
                onDetail={setSelected}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

// ─── Detail modal ────────────────────────────────────────────────────────────

function RecipeDetail({ recipe, onClose, onAddToCart, onLog }: {
  recipe: Recipe;
  onClose: () => void;
  onAddToCart: (r: Recipe) => void;
  onLog: (r: Recipe) => void;
}) {
  const totalTime = recipe.prepTimeMin + recipe.cookTimeMin;
  const kcal = Math.round(recipe.caloriesPerServing);
  const p    = Math.round(recipe.proteinPerServing);
  const c    = Math.round(recipe.carbsPerServing);
  const f    = Math.round(recipe.fatPerServing);
  const fib  = Math.round(recipe.fiberPerServing);

  const totalFromMacros = p * 4 + c * 4 + f * 9;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full md:max-w-md bg-cream-50 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Photo */}
        <div className="relative shrink-0 p-3 pb-0">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-200">
            {recipe.imageUrl
              ? <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-cream-200" />
            }

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-warm-700 flex items-center justify-center text-sm font-medium hover:bg-white transition-colors"
            >✕</button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
          {/* Title + meta */}
          <div>
            <h2 className="text-xl font-bold text-warm-900 leading-snug mb-1">{recipe.name}</h2>
            <p className="text-sm text-warm-400">{totalTime} min · {recipe.servings} portion{recipe.servings > 1 ? 's' : ''}</p>
          </div>

          {/* Macro pills */}
          <div className="flex gap-2 flex-wrap">
            <MacroPill label="Calories" value={kcal} unit="kcal" color="bg-orange-100 text-orange-600" />
            <MacroPill label="Protéines" value={p} unit="g" color="bg-red-50 text-red-500" />
            <MacroPill label="Glucides" value={c} unit="g" color="bg-blue-50 text-blue-500" />
            <MacroPill label="Lipides" value={f} unit="g" color="bg-amber-50 text-amber-600" />
            <MacroPill label="Fibres" value={fib} unit="g" color="bg-green-50 text-green-600" />
          </div>

          {/* Distribution bar */}
          {totalFromMacros > 0 && (
            <div>
              <div className="flex h-2 rounded-full overflow-hidden gap-px">
                <div className="bg-red-400 rounded-l-full" style={{ width: `${p * 4 / totalFromMacros * 100}%` }} />
                <div className="bg-blue-400" style={{ width: `${c * 4 / totalFromMacros * 100}%` }} />
                <div className="bg-amber-400 rounded-r-full" style={{ width: `${f * 9 / totalFromMacros * 100}%` }} />
              </div>
              <div className="flex gap-4 mt-2 text-[11px] text-warm-400">
                <span>{Math.round(p * 4 / totalFromMacros * 100)}% prot</span>
                <span>{Math.round(c * 4 / totalFromMacros * 100)}% gluc</span>
                <span>{Math.round(f * 9 / totalFromMacros * 100)}% lip</span>
              </div>
            </div>
          )}

          {/* NutriScore */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: NUTRISCORE_COLOR[recipe.nutriScore] ?? '#ccc' }}
            >
              {recipe.nutriScore}
            </div>
            <span className="text-xs text-warm-400">Nutri-Score</span>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-sm text-warm-500 leading-relaxed">{recipe.description}</p>
          )}
        </div>

        {/* CTAs */}
        <div className="p-4 flex gap-3 shrink-0">
          <button
            onClick={() => { onAddToCart(recipe); onClose(); }}
            className="flex-1 py-3.5 rounded-full bg-white text-warm-700 text-sm font-semibold hover:bg-cream-200 transition-colors"
          >
            Ajouter au panier
          </button>
          <button
            onClick={() => { onLog(recipe); onClose(); }}
            className="flex-1 py-3.5 rounded-full bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
          >
            J'ai mangé ça
          </button>
        </div>
      </div>
    </div>
  );
}

function MacroPill({ label, value, unit, color }: {
  label: string; value: number; unit: string; color: string;
}) {
  return (
    <div className={`${color} px-3 py-2 rounded-2xl`}>
      <p className="text-[10px] opacity-70 mb-0.5">{label}</p>
      <p className="text-sm font-bold leading-none">{value}<span className="text-[10px] font-normal ml-0.5">{unit}</span></p>
    </div>
  );
}
