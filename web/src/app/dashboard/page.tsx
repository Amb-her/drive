'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { NavBar } from '@/components/NavBar';
import { MacroProgress } from '@/components/MacroProgress';

export default function DashboardPage() {
  const [daily, setDaily] = useState<any>(null);
  const [weekly, setWeekly] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDailyDashboard(), api.getWeeklyDashboard()])
      .then(([d, w]) => {
        setDaily(d);
        setWeekly(w);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-brand-500">Chargement...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Calories Circle */}
        {daily && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Aujourd'hui</h2>
            <div className="flex items-center gap-8">
              {/* Calorie ring */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="#22c55e" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(daily.progress.calories / 100) * 327} 327`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{daily.consumed.calories}</span>
                  <span className="text-xs text-gray-400">/ {daily.targets.calories}</span>
                  <span className="text-xs text-gray-400">kcal</span>
                </div>
              </div>

              {/* Macro bars */}
              <div className="flex-1 space-y-3">
                <MacroProgress
                  label="Protéines"
                  current={daily.consumed.protein}
                  target={daily.targets.protein}
                  unit="g"
                  color="bg-red-500"
                />
                <MacroProgress
                  label="Glucides"
                  current={daily.consumed.carbs}
                  target={daily.targets.carbs}
                  unit="g"
                  color="bg-blue-500"
                />
                <MacroProgress
                  label="Lipides"
                  current={daily.consumed.fat}
                  target={daily.targets.fat}
                  unit="g"
                  color="bg-yellow-500"
                />
              </div>
            </div>

            {/* Remaining */}
            <div className="mt-4 p-3 bg-brand-50 rounded-xl">
              <p className="text-sm text-brand-700 font-medium">
                Il te reste {daily.remaining.calories} kcal —{' '}
                {daily.remaining.protein}g protéines,{' '}
                {daily.remaining.carbs}g glucides,{' '}
                {daily.remaining.fat}g lipides
              </p>
            </div>
          </div>
        )}

        {/* Today's meals */}
        {daily?.meals && daily.meals.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Repas du jour</h2>
            <div className="divide-y">
              {daily.meals.map((meal: any) => (
                <div key={meal.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 uppercase">{meal.mealType}</span>
                    <p className="font-medium text-gray-700">{meal.recipe?.name || 'Repas'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-500">{Math.round(meal.calories)} kcal</p>
                    <p className="text-xs text-gray-400">
                      P:{Math.round(meal.protein)}g C:{Math.round(meal.carbs)}g L:{Math.round(meal.fat)}g
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly chart */}
        {weekly && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Cette semaine</h2>
            <div className="flex items-end gap-2 h-40">
              {weekly.week.map((day: any) => {
                const target = weekly.targets?.calories || 2000;
                const pct = Math.min(100, Math.round((day.calories / target) * 100));
                const dayName = new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' });

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">{Math.round(day.calories)}</span>
                    <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100px' }}>
                      <div
                        className="bg-brand-400 rounded-t-lg absolute bottom-0 w-full transition-all duration-500"
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{dayName}</span>
                  </div>
                );
              })}
            </div>
            {weekly.averages && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Moyenne: {weekly.averages.calories} kcal/jour
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
