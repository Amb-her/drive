'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// ─── Étapes ──────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'objectif',  title: 'Quel est ton objectif ?',       sub: 'On adapte tout en fonction de ça.' },
  { id: 'physique',  title: 'Quelques infos sur toi',        sub: 'Pour calculer tes besoins précis.' },
  { id: 'activite',  title: 'Ton niveau d\'activité',        sub: 'Sois honnête, ça change tout.' },
  { id: 'regime',    title: 'Tu suis un régime particulier ?', sub: 'On adapte les recettes.' },
  { id: 'gouts',     title: 'Des aliments que tu n\'aimes pas ?', sub: 'Optionnel — tu peux passer.' },
  { id: 'foyer',     title: 'Tu cuisines pour combien ?',    sub: 'On adapte les quantités.' },
];

const GOALS = [
  { value: 'FAT_LOSS',       label: 'Perdre du gras',    desc: 'Déficit calorique · protéines hautes' },
  { value: 'MUSCLE_GAIN',    label: 'Prendre du muscle',  desc: 'Surplus calorique · force & volume'   },
  { value: 'MAINTAIN',       label: 'Maintenir',          desc: 'Stabilité · forme au quotidien'       },
  { value: 'HEALTHY_EATING', label: 'Manger sainement',   desc: 'Équilibre · qualité nutritionnelle'   },
];

const ACTIVITIES = [
  { value: 'SEDENTARY',      label: 'Sédentaire',        desc: 'Bureau, peu de mouvement' },
  { value: 'LIGHTLY_ACTIVE', label: 'Légèrement actif',  desc: 'Marche, sport 1–2×/sem.' },
  { value: 'ACTIVE',         label: 'Actif',             desc: 'Sport 3–5×/sem.'          },
  { value: 'VERY_ACTIVE',    label: 'Très actif',        desc: 'Sport 6–7×/sem.'          },
  { value: 'ATHLETE',        label: 'Athlète',           desc: 'Entraînement intensif'    },
];

const DIETS = [
  { value: 'VEGETARIAN',   label: 'Végétarien'          },
  { value: 'VEGAN',        label: 'Vegan'               },
  { value: 'GLUTEN_FREE',  label: 'Sans gluten'         },
  { value: 'LACTOSE_FREE', label: 'Sans lactose'        },
  { value: 'HALAL',        label: 'Halal'               },
  { value: 'KETO',         label: 'Keto / Low-carb'     },
];

const DISLIKED = [
  'Fruits de mer', 'Poisson', 'Coriandre', 'Brocoli',
  'Fruits à coque', 'Champignons', 'Aubergine', 'Avocat',
  'Céleri', 'Foie', 'Alcool', 'Œuf',
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router  = useRouter();
  const [step, setStep]       = useState(0);
  const [dir, setDir]         = useState<1|-1>(1);   // direction animation
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState('');

  const [form, setForm] = useState({
    goal:               'MAINTAIN',
    sex:                'MALE',
    age:                25,
    heightCm:           175,
    weightKg:           75,
    morphology:         'MESOMORPH',
    activityLevel:      'ACTIVE',
    dietaryConstraints: [] as string[],
    dislikedIngredients:[] as string[],
    kitchenEquipment:   [] as string[],
    adultsCount:        1,
    childrenCount:      0,
  });

  const toggle = (key: 'dietaryConstraints'|'dislikedIngredients'|'kitchenEquipment', val: string) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }));
  };

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1);
    setVisible(false);
    setTimeout(() => { setStep(next); setVisible(true); }, 180);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.createProfile(form);
      router.push('/dashboard');
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const isLast     = step === STEPS.length - 1;
  const isOptional = [3, 4, 5].includes(step);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── Barre de progression ── */}
      <div className="px-5 pt-6">
        <div className="h-1 rounded-full overflow-hidden mb-5" style={{ background: 'var(--card)' }}>
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          {step > 0
            ? <button onClick={() => goTo(step - 1)} className="w-9 h-9 flex items-center justify-center rounded-full text-t2 hover:bg-card transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            : <div className="w-9" />
          }
          <span className="text-xs text-t4 font-medium">{step + 1} / {STEPS.length}</span>
          <button onClick={() => router.push('/dashboard')} className="w-9 h-9 flex items-center justify-center rounded-full text-t3 hover:bg-card transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* ── Titre ── */}
      <div className="px-5 mb-8"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : `translateX(${dir * 20}px)`, transition: 'opacity 0.18s, transform 0.18s' }}>
        <h1 className="text-2xl font-bold text-t1 leading-snug mb-1">{STEPS[step].title}</h1>
        <p className="text-sm text-t3">{STEPS[step].sub}</p>
      </div>

      {/* ── Contenu ── */}
      <div className="flex-1 px-5 overflow-y-auto pb-4"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : `translateX(${dir * 20}px)`, transition: 'opacity 0.18s, transform 0.18s' }}>

        {/* Objectif */}
        {step === 0 && (
          <div className="space-y-2 max-w-sm mx-auto">
            {GOALS.map(g => (
              <OptionRow
                key={g.value}
                label={g.label}
                desc={g.desc}
                selected={form.goal === g.value}
                onClick={() => setForm(f => ({ ...f, goal: g.value }))}
              />
            ))}
          </div>
        )}

        {/* Physique */}
        {step === 1 && (
          <div className="space-y-6 max-w-sm mx-auto">
            {/* Sexe */}
            <div className="flex rounded-2xl p-1" style={{ background: 'var(--card)' }}>
              {[{ v: 'MALE', l: 'Homme' }, { v: 'FEMALE', l: 'Femme' }].map(({ v, l }) => (
                <button key={v}
                  onClick={() => setForm(f => ({ ...f, sex: v }))}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={form.sex === v
                    ? { background: 'var(--bg)', color: 'var(--t1)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                    : { color: 'var(--t3)' }}
                >{l}</button>
              ))}
            </div>

            {/* Sliders */}
            {[
              { key: 'age',      label: 'Âge',    unit: 'ans', min: 14, max: 80  },
              { key: 'heightCm', label: 'Taille', unit: 'cm',  min: 140, max: 210 },
              { key: 'weightKg', label: 'Poids',  unit: 'kg',  min: 40,  max: 150 },
            ].map(({ key, label, unit, min, max }) => (
              <div key={key}>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-t1">{label}</span>
                  <span className="text-sm font-bold text-brand-500">
                    {form[key as keyof typeof form]} {unit}
                  </span>
                </div>
                <input
                  type="range" min={min} max={max}
                  value={form[key as keyof typeof form] as number}
                  onChange={e => setForm(f => ({ ...f, [key]: +e.target.value }))}
                  className="w-full h-1.5 rounded-full appearance-none accent-brand-500 cursor-pointer"
                  style={{ background: `linear-gradient(to right, #22c55e ${((form[key as keyof typeof form] as number - min) / (max - min)) * 100}%, var(--card-2) 0)` }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--t4)' }}>
                  <span>{min}</span><span>{max}</span>
                </div>
              </div>
            ))}

            {/* Morphologie */}
            <div>
              <p className="text-sm font-medium text-t1 mb-3">Morphologie</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: 'ECTOMORPH', l: 'Ectomorphe', d: 'Mince naturellement' },
                  { v: 'MESOMORPH', l: 'Mésomorphe', d: 'Athlétique'          },
                  { v: 'ENDOMORPH', l: 'Endomorphe', d: 'Garde facilement'    },
                ].map(({ v, l, d }) => (
                  <button key={v}
                    onClick={() => setForm(f => ({ ...f, morphology: v }))}
                    className="p-3 rounded-2xl text-center transition-all duration-200"
                    style={{
                      background: form.morphology === v ? '#22c55e' : 'var(--card)',
                      color:      form.morphology === v ? '#fff'    : 'var(--t1)',
                    }}
                  >
                    <p className="text-xs font-semibold leading-tight">{l}</p>
                    <p className="text-[10px] mt-0.5 opacity-70">{d}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activité */}
        {step === 2 && (
          <div className="space-y-2 max-w-sm mx-auto">
            {ACTIVITIES.map(a => (
              <OptionRow
                key={a.value}
                label={a.label}
                desc={a.desc}
                selected={form.activityLevel === a.value}
                onClick={() => setForm(f => ({ ...f, activityLevel: a.value }))}
              />
            ))}
          </div>
        )}

        {/* Régime */}
        {step === 3 && (
          <div className="flex flex-wrap gap-2 max-w-sm mx-auto">
            {DIETS.map(d => (
              <PillToggle
                key={d.value}
                label={d.label}
                selected={form.dietaryConstraints.includes(d.value)}
                onClick={() => toggle('dietaryConstraints', d.value)}
              />
            ))}
          </div>
        )}

        {/* Goûts */}
        {step === 4 && (
          <div className="max-w-sm mx-auto space-y-4">
            <input
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-200"
              style={{ background: 'var(--card)', color: 'var(--t1)', border: '1px solid var(--border)' }}
              placeholder="Rechercher un aliment…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {(search ? DISLIKED.filter(i => i.toLowerCase().includes(search.toLowerCase())) : DISLIKED).map(item => (
                <PillToggle
                  key={item}
                  label={item}
                  selected={form.dislikedIngredients.includes(item)}
                  onClick={() => toggle('dislikedIngredients', item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Foyer */}
        {step === 5 && (
          <div className="space-y-3 max-w-sm mx-auto">
            <WarmCounter
              label="Adultes"
              value={form.adultsCount}
              min={1}
              onChange={v => setForm(f => ({ ...f, adultsCount: v }))}
            />
            <WarmCounter
              label="Enfants ou ados"
              sub="De plus de 3 ans"
              value={form.childrenCount}
              onChange={v => setForm(f => ({ ...f, childrenCount: v }))}
            />
          </div>
        )}
      </div>

      {/* ── CTA fixé en bas ── */}
      <div className="px-5 pt-3 pb-10 shrink-0" style={{ background: 'var(--bg)' }}>
        <button
          onClick={isLast ? handleSubmit : () => goTo(step + 1)}
          disabled={loading}
          className="w-full py-4 rounded-full bg-brand-500 text-white font-semibold text-[15px]
                     hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {loading
            ? <span className="flex items-center justify-center gap-2"><Spinner /> Calcul en cours…</span>
            : isLast ? 'Calculer mes besoins' : 'Continuer'
          }
        </button>
        {isOptional && (
          <button
            onClick={() => goTo(step + 1)}
            className="w-full py-2.5 mt-2 text-sm text-t4 hover:text-t2 transition-colors"
          >
            Passer cette étape
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sous-composants ─────────────────────────────────────────────────────────

function OptionRow({ label, desc, selected, onClick }: {
  label: string; desc: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 rounded-2xl text-left transition-all duration-200"
      style={{ background: selected ? '#22c55e' : 'var(--card)' }}
    >
      <div>
        <p className="font-semibold text-[15px]" style={{ color: selected ? '#fff' : 'var(--t1)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: selected ? 'rgba(255,255,255,0.75)' : 'var(--t3)' }}>{desc}</p>
      </div>
      <div className="shrink-0 ml-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
        style={{ borderColor: selected ? '#fff' : 'var(--border)', background: selected ? '#fff' : 'transparent' }}>
        {selected && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>
    </button>
  );
}

function PillToggle({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
      style={selected
        ? { background: '#22c55e', color: '#fff' }
        : { background: 'var(--card)', color: 'var(--t2)' }}
    >
      {label}
    </button>
  );
}

function WarmCounter({ label, sub, value, min = 0, onChange }: {
  label: string; sub?: string; value: number; min?: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4 rounded-2xl" style={{ background: 'var(--card)' }}>
      <div>
        <p className="font-medium text-t1">{label}</p>
        {sub && <p className="text-xs text-t4 mt-0.5">{sub}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30"
          style={{ background: 'var(--bg)', color: 'var(--t2)' }}
        >−</button>
        <span className="text-xl font-bold text-t1 w-6 text-center">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all"
          style={{ background: 'var(--bg)', color: 'var(--t2)' }}
        >+</button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}
