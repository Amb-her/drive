'use client';

import { useEffect, useState, useCallback } from 'react';
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

export default function RecipesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [filterTag, setFilterTag] = useState('');
  const [search, setSearch]       = useState('');
  const [data, setData]           = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState('');
  const [selected, setSelected]   = useState<Recipe | null>(null);

  const load = useCallback(async (searchTerm = search) => {
    setLoading(true);
    try {
      let result;
      if (searchTerm.trim()) {
        // Recherche texte → API générale
        result = await api.getRecipes({ search: searchTerm.trim() });
      } else {
        // Recommandations scorées par macros
        result = await api.getRecommendations(MEAL_TABS[activeTab].value || undefined);
      }
      setData(result);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [activeTab, search]);

  useEffect(() => { load(); }, [activeTab, filterTag]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (!value.trim()) {
      // Vider la recherche → retour aux reco
      load('');
    }
  };

  const handleSearchSubmit = () => load(search);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

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
  const isSearchMode = !!search.trim();

  return (
    <>
      <NavBar />

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap">
          {toast}
        </div>
      )}

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
        <div className="mb-4 relative">
          <input
            className="w-full px-5 py-3 pr-12 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-200 border-none"
            style={{ background: 'var(--input)', color: 'var(--t1)' }}
            placeholder="Rechercher une recette, un ingrédient…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
          />
          {search && (
            <button
              onClick={() => { setSearch(''); load(''); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-t4 hover:text-t2 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Pills — masquées en mode recherche */}
        {!isSearchMode && (
          <div className="flex gap-2 flex-wrap mb-5">
            {MEAL_TABS.map((tab, i) => (
              <button
                key={`tab-${tab.value}`}
                onClick={() => { setActiveTab(i); setFilterTag(''); }}
                className="whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200"
                style={activeTab === i && !filterTag
                  ? { background: '#22c55e', color: '#fff' }
                  : { background: 'var(--card)', color: 'var(--t2)' }}
              >
                {tab.label}
              </button>
            ))}
            <div className="w-px shrink-0 my-1" style={{ background: 'var(--border)' }} />
            {FILTER_TAGS.map(ft => (
              <button
                key={`filter-${ft.value}`}
                onClick={() => setFilterTag(ft.value === filterTag ? '' : ft.value)}
                className="whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200"
                style={filterTag === ft.value
                  ? { background: '#22c55e', color: '#fff' }
                  : { background: 'var(--card)', color: 'var(--t2)' }}
              >
                {ft.label}
              </button>
            ))}
          </div>
        )}

        {/* Label recherche active */}
        {isSearchMode && (
          <p className="text-sm text-t3 mb-4">
            Résultats pour <span className="font-medium text-t1">« {search} »</span>
            {!loading && ` — ${recipes.length} recette${recipes.length > 1 ? 's' : ''}`}
          </p>
        )}

        {/* Grille */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-3xl animate-pulse" style={{ background: 'var(--card)' }} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-t3 text-sm">Aucune recette trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
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

      <div className="relative w-full md:max-w-md md:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        style={{ background: 'var(--bg)' }}>

        {/* Photo */}
        <div className="relative shrink-0 p-3 pb-0">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden" style={{ background: 'var(--card-2)' }}>
            {recipe.imageUrl
              ? <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full" />
            }
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-warm-700 flex items-center justify-center text-sm hover:bg-white transition-colors"
            >✕</button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">

          {/* Titre + meta */}
          <div>
            <h2 className="text-xl font-bold text-t1 leading-snug mb-1">{recipe.name}</h2>
            <p className="text-sm text-t3">{totalTime} min · {recipe.servings} portion{recipe.servings > 1 ? 's' : ''}</p>
          </div>

          {/* Macro pills */}
          <div className="flex gap-2 flex-wrap">
            <MacroPill label="Calories"  value={kcal} unit="kcal" bg="rgba(251,146,60,0.12)"  color="#f97316" />
            <MacroPill label="Protéines" value={p}    unit="g"    bg="rgba(248,113,113,0.12)" color="#ef4444" />
            <MacroPill label="Glucides"  value={c}    unit="g"    bg="rgba(96,165,250,0.12)"  color="#3b82f6" />
            <MacroPill label="Lipides"   value={f}    unit="g"    bg="rgba(251,191,36,0.12)"  color="#d97706" />
            <MacroPill label="Fibres"    value={fib}  unit="g"    bg="rgba(74,222,128,0.12)"  color="#16a34a" />
          </div>

          {/* Barre de répartition */}
          {totalFromMacros > 0 && (
            <div>
              <div className="flex h-2 rounded-full overflow-hidden gap-px">
                <div className="bg-red-400 rounded-l-full" style={{ width: `${p * 4 / totalFromMacros * 100}%` }} />
                <div className="bg-blue-400"               style={{ width: `${c * 4 / totalFromMacros * 100}%` }} />
                <div className="bg-amber-400 rounded-r-full" style={{ width: `${f * 9 / totalFromMacros * 100}%` }} />
              </div>
              <div className="flex gap-4 mt-2 text-[11px] text-t3">
                <span>{Math.round(p * 4 / totalFromMacros * 100)}% prot</span>
                <span>{Math.round(c * 4 / totalFromMacros * 100)}% gluc</span>
                <span>{Math.round(f * 9 / totalFromMacros * 100)}% lip</span>
              </div>
            </div>
          )}

          {/* Nutri-Score */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: NUTRISCORE_COLOR[recipe.nutriScore] ?? '#ccc' }}>
              {recipe.nutriScore}
            </div>
            <span className="text-xs text-t3">Nutri-Score</span>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-sm text-t2 leading-relaxed">{recipe.description}</p>
          )}

          {/* ── Préparation étape par étape ── */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-t4 uppercase tracking-widest mb-4">Préparation</p>
              <div className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-t1 leading-relaxed flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="p-4 flex gap-3 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => { onAddToCart(recipe); onClose(); }}
            className="flex-1 py-3.5 rounded-full text-sm font-semibold transition-colors hover:opacity-80"
            style={{ background: 'var(--card)', color: 'var(--t1)' }}
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

function MacroPill({ label, value, unit, bg, color }: {
  label: string; value: number; unit: string; bg: string; color: string;
}) {
  return (
    <div className="px-3 py-2 rounded-2xl" style={{ background: bg }}>
      <p className="text-[10px] mb-0.5" style={{ color, opacity: 0.7 }}>{label}</p>
      <p className="text-sm font-bold leading-none" style={{ color }}>
        {value}<span className="text-[10px] font-normal ml-0.5">{unit}</span>
      </p>
    </div>
  );
}
