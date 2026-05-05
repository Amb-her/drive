'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { NavBar } from '@/components/NavBar';

const CATEGORY_LABELS: Record<string, string> = {
  PROTEIN:   'Protéines',
  DAIRY:     'Produits laitiers',
  GRAIN:     'Céréales & féculents',
  VEGETABLE: 'Légumes',
  FRUIT:     'Fruits',
  FAT:       'Matières grasses',
  CONDIMENT: 'Condiments',
  BEVERAGE:  'Boissons',
  SNACK:     'Snacks',
  OTHER:     'Autres',
};

export default function ShoppingPage() {
  const [list, setList]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState('');

  const load = async () => {
    try { setList(await api.getShoppingList()); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const toggleItem = async (itemId: string) => {
    await api.toggleShoppingItem(itemId);
    load();
  };

  const removeItem = async (itemId: string) => {
    await api.removeShoppingItem(itemId);
    load();
  };

  const clearList = async () => {
    await api.clearShoppingList();
    load();
    showToast('Liste vidée');
  };

  const grouped: Record<string, any[]> = {};
  if (list?.items) {
    for (const item of list.items) {
      const cat = item.category || 'OTHER';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }
  }

  const total     = list?.items?.length ?? 0;
  const checked   = list?.items?.filter((i: any) => i.checked).length ?? 0;
  const remaining = total - checked;

  return (
    <>
      <NavBar />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap">
          {toast}
        </div>
      )}

      <main className="max-w-2xl mx-auto px-5 pt-5 pb-24">

        {/* Header */}
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-t1">Mes courses</h1>
            {!loading && total > 0 && (
              <p className="text-sm text-t3 mt-0.5">
                {remaining > 0 ? `${remaining} article${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}` : 'Tout est coché !'}
              </p>
            )}
          </div>
          {total > 0 && (
            <button
              onClick={clearList}
              className="text-xs text-t4 hover:text-red-400 transition-colors"
            >
              Tout vider
            </button>
          )}
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="h-1 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--card-2)' }}>
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${(checked / total) * 100}%` }}
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: 'var(--card)' }} />
            ))}
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--card)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--t4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <p className="text-t2 font-medium mb-1">Ton panier est vide</p>
            <p className="text-sm text-t4">Ajoute des recettes depuis l'onglet Recettes</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="text-[11px] font-semibold text-t4 uppercase tracking-widest mb-2 px-1">
                  {CATEGORY_LABELS[category] || category}
                </p>
                <div className="rounded-3xl overflow-hidden" style={{ background: 'var(--card)' }}>
                  {items.map((item: any, i: number) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-4 py-3.5 transition-opacity duration-200"
                      style={{
                        opacity: item.checked ? 0.4 : 1,
                        borderBottom: i < items.length - 1 ? '1px solid var(--border)' : undefined,
                      }}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 active:scale-90"
                        style={{
                          borderColor: item.checked ? '#22c55e' : 'var(--border)',
                          background:  item.checked ? '#22c55e' : 'transparent',
                        }}
                      >
                        {item.checked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>

                      {/* Nom */}
                      <span
                        className="flex-1 text-sm font-medium text-t1 transition-all duration-200"
                        style={{ textDecoration: item.checked ? 'line-through' : 'none' }}
                      >
                        {item.ingredientName}
                      </span>

                      {/* Quantité */}
                      <span className="text-sm text-t3 shrink-0">
                        {item.quantity} {item.unit}
                      </span>

                      {/* Supprimer */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors hover:bg-red-100 hover:text-red-500"
                        style={{ color: 'var(--t4)' }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
