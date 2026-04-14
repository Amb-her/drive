'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { NavBar } from '@/components/NavBar';

const CATEGORY_LABELS: Record<string, string> = {
  PROTEIN: 'Protéines',
  DAIRY: 'Produits laitiers',
  GRAIN: 'Céréales',
  VEGETABLE: 'Légumes',
  FRUIT: 'Fruits',
  FAT: 'Matières grasses',
  CONDIMENT: 'Condiments',
  BEVERAGE: 'Boissons',
  SNACK: 'Snacks',
  OTHER: 'Autres',
};

export default function ShoppingPage() {
  const [list, setList] = useState<any>(null);
  const [driveCart, setDriveCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const result = await api.getShoppingList();
      setList(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
  };

  const generateDrive = async () => {
    const cart = await api.getDriveCart();
    setDriveCart(cart);
  };

  // Grouper par catégorie
  const grouped: Record<string, any[]> = {};
  if (list?.items) {
    for (const item of list.items) {
      const cat = item.category || 'OTHER';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }
  }

  const uncheckedCount = list?.items?.filter((i: any) => !i.checked).length ?? 0;

  return (
    <>
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Mes courses</h1>
          <div className="flex gap-2">
            {uncheckedCount > 0 && (
              <button className="btn-primary text-sm py-2" onClick={generateDrive}>
                Commander en drive
              </button>
            )}
            {list?.items?.length > 0 && (
              <button className="text-sm text-red-500 hover:text-red-700" onClick={clearList}>
                Vider
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : !list?.items?.length ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg mb-2">Ton panier est vide</p>
            <p className="text-gray-400 text-sm">
              Ajoute des recettes depuis l'onglet Recettes
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              {uncheckedCount} article{uncheckedCount > 1 ? 's' : ''} restant{uncheckedCount > 1 ? 's' : ''}
            </p>

            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="card">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  {CATEGORY_LABELS[category] || category}
                </h3>
                <div className="divide-y divide-gray-50">
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      className={`py-2 flex items-center gap-3 ${item.checked ? 'opacity-40' : ''}`}
                    >
                      <button
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.checked
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'border-gray-300'
                        }`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {item.checked && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className={`flex-1 ${item.checked ? 'line-through' : 'text-gray-800'}`}>
                        {item.ingredientName}
                      </span>
                      <span className="text-sm text-gray-400">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        onClick={() => removeItem(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Drive cart modal */}
        {driveCart && (
          <div className="card border-brand-200 bg-brand-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-brand-700">Panier Drive</h3>
              <button
                className="text-sm text-gray-400"
                onClick={() => setDriveCart(null)}
              >
                Fermer
              </button>
            </div>
            <div className="space-y-2">
              {driveCart.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.ingredient} ({item.quantity} {item.unit})
                  </span>
                  <span className="text-gray-500">
                    {item.product ? `${item.product.price.toFixed(2)}€` : 'Non trouvé'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-brand-200 flex justify-between">
              <span className="font-bold text-brand-700">Total estimé</span>
              <span className="font-bold text-brand-700">{driveCart.totalPrice?.toFixed(2)}€</span>
            </div>
            {driveCart.driveUrl && (
              <a
                href={driveCart.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center mt-4 block"
              >
                Ouvrir le Drive
              </a>
            )}
          </div>
        )}
      </main>
    </>
  );
}
