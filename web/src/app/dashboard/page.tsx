'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { NavBar } from '@/components/NavBar';
import { useStore } from '@/lib/store';

const GOAL_LABELS: Record<string, string> = {
  MUSCLE_GAIN: 'Prise de muscle',
  FAT_LOSS:    'Perte de gras',
  MAINTAIN:    'Maintien',
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  BREAKFAST: 'Petit-déjeuner',
  LUNCH:     'Déjeuner',
  DINNER:    'Dîner',
  SNACK:     'Snack',
};

export default function DashboardPage() {
  const { user } = useStore();
  const [daily, setDaily]     = useState<any>(null);
  const [weekly, setWeekly]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDailyDashboard(), api.getWeeklyDashboard()])
      .then(([d, w]) => { setDaily(d); setWeekly(w); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const goal    = user?.profile?.goal;
  const hour    = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="max-w-5xl mx-auto px-5 pt-6 pb-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-3xl h-36 animate-pulse" style={{ background: 'var(--card)' }} />
          ))}
        </main>
      </>
    );
  }

  const kcalConsumed  = daily?.consumed?.calories ?? 0;
  const kcalTarget    = daily?.targets?.calories ?? 2000;
  const kcalPct       = Math.min(100, (kcalConsumed / kcalTarget) * 100);
  const circumference = 2 * Math.PI * 52;

  return (
    <>
      <NavBar />
      <main className="max-w-5xl mx-auto px-5 pt-6 pb-8 space-y-4">

        {/* Greeting */}
        <div className="pb-1">
          <h1 className="text-2xl font-bold text-t1">
            {greeting}{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="text-sm text-t3 mt-0.5">
            {goal ? `Objectif · ${GOAL_LABELS[goal] ?? goal}` : 'Bienvenue sur NutriDrive'}
          </p>
        </div>

        {/* Calories + macros */}
        {daily && (
          <div className="rounded-3xl p-5" style={{ background: 'var(--card)' }}>
            <p className="text-[11px] font-semibold text-t4 uppercase tracking-widest mb-5">Aujourd'hui</p>

            <div className="flex items-center gap-6">
              {/* Anneau calories */}
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--card-2)" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="#f97316" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(kcalPct / 100) * circumference} ${circumference}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-t1">{Math.round(kcalConsumed)}</span>
                  <span className="text-[10px] text-t3">/ {Math.round(kcalTarget)}</span>
                  <span className="text-[10px] text-t3">kcal</span>
                </div>
              </div>

              {/* Barres macros */}
              <div className="flex-1 space-y-3">
                <InlineMacro label="Protéines" current={daily.consumed.protein} target={daily.targets.protein} color="#f87171" />
                <InlineMacro label="Glucides"  current={daily.consumed.carbs}   target={daily.targets.carbs}   color="#60a5fa" />
                <InlineMacro label="Lipides"   current={daily.consumed.fat}     target={daily.targets.fat}     color="#fbbf24" />
              </div>
            </div>

            {daily.remaining && (
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-sm text-t2">
                  Il te reste{' '}
                  <span className="font-semibold text-orange-500">{Math.round(daily.remaining.calories)} kcal</span>
                  {' — '}
                  {Math.round(daily.remaining.protein)}g prot ·{' '}
                  {Math.round(daily.remaining.carbs)}g gluc ·{' '}
                  {Math.round(daily.remaining.fat)}g lip
                </p>
              </div>
            )}
          </div>
        )}

        {/* Repas du jour */}
        {daily?.meals?.length > 0 && (
          <div className="rounded-3xl p-5" style={{ background: 'var(--card)' }}>
            <p className="text-[11px] font-semibold text-t4 uppercase tracking-widest mb-4">Repas du jour</p>
            {daily.meals.map((meal: any, i: number) => (
              <div
                key={meal.id}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: i < daily.meals.length - 1 ? '1px solid var(--border)' : undefined }}
              >
                <div>
                  <p className="text-[11px] text-t4 uppercase tracking-wide mb-0.5">
                    {MEAL_TYPE_LABELS[meal.mealType] ?? meal.mealType}
                  </p>
                  <p className="text-sm font-medium text-t1">{meal.recipe?.name ?? 'Repas'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-orange-500">{Math.round(meal.calories)} kcal</p>
                  <p className="text-[11px] text-t3">{Math.round(meal.protein)}g protéines</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Graphe semaine */}
        {weekly && (
          <div className="rounded-3xl p-5" style={{ background: 'var(--card)' }}>
            <p className="text-[11px] font-semibold text-t4 uppercase tracking-widest mb-5">Cette semaine</p>
            <div className="flex items-end gap-2 h-24">
              {weekly.week.map((day: any) => {
                const target  = weekly.targets?.calories ?? 2000;
                const pct     = Math.min(100, (day.calories / target) * 100);
                const dayName = new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' });
                const isToday = new Date().toDateString() === new Date(day.date).toDateString();

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full rounded-full overflow-hidden relative" style={{ height: 72, background: 'var(--card-2)' }}>
                      <div
                        className="rounded-full absolute bottom-0 w-full transition-all duration-500"
                        style={{ height: `${pct}%`, background: isToday ? '#f97316' : 'var(--border)' }}
                      />
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: isToday ? '#f97316' : 'var(--t3)' }}>
                      {dayName}
                    </span>
                  </div>
                );
              })}
            </div>
            {weekly.averages && (
              <p className="mt-4 text-xs text-t3 text-center">
                Moyenne · <span className="font-medium text-t2">{Math.round(weekly.averages.calories)} kcal/jour</span>
              </p>
            )}
          </div>
        )}

      </main>
    </>
  );
}

function InlineMacro({ label, current, target, color }: {
  label: string; current: number; target: number; color: string;
}) {
  const pct = Math.min(100, Math.round((current / (target || 1)) * 100));
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-t2">{label}</span>
        <span className="text-xs text-t3">{Math.round(current)}g / {Math.round(target)}g</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--card-2)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
