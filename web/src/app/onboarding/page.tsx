'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// ─── Config étapes ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 'foyer',    title: 'Votre foyer',    subtitle: 'Dites-nous tout sur votre chez vous' },
  { id: 'regime',   title: 'Votre régime',   subtitle: 'Avez-vous un régime particulier ?' },
  { id: 'gouts',    title: 'Vos goûts',      subtitle: 'Des ingrédients que vous n\'aimez pas ?' },
  { id: 'cuisine',  title: 'Votre cuisine',  subtitle: 'Quels équipements avez-vous ?' },
  { id: 'objectifs',title: 'Vos objectifs',  subtitle: 'NutriDrive vous accompagne vers vos objectifs' },
  { id: 'physique', title: 'Votre physique', subtitle: 'Pour calculer vos besoins précis' },
  { id: 'activite', title: 'Votre activité', subtitle: 'Votre niveau d\'activité habituel' },
];

const DIETS = [
  { value: 'VEGETARIAN',   label: 'Végétarien',          emoji: '🥕' },
  { value: 'VEGAN',        label: 'Végétalien (vegan)',   emoji: '🌿' },
  { value: 'HALAL',        label: 'Sans porc (Halal)',    emoji: '🐷' },
  { value: 'GLUTEN_FREE',  label: 'Sans gluten',          emoji: '🌾' },
  { value: 'LACTOSE_FREE', label: 'Sans produit laitier', emoji: '🥛' },
  { value: 'KETO',         label: 'Keto / Low-carb',      emoji: '🥑' },
];

const DISLIKED = [
  'Fruits de mer', 'Poisson', 'Coriandre', 'Brocoli',
  'Fruits à coque', 'Œuf', 'Alcool', 'Champignons',
  'Aubergine', 'Céleri', 'Foie', 'Avocat',
];

const EQUIPMENT = [
  { value: 'OVEN',        label: 'Four',             emoji: '🔲' },
  { value: 'MICROWAVE',   label: 'Micro-ondes',      emoji: '📡' },
  { value: 'AIRFRYER',    label: 'Air-fryer',        emoji: '🌬️' },
  { value: 'BLENDER',     label: 'Mixeur/Blender',   emoji: '🌀' },
  { value: 'COOKER',      label: 'Robot cuiseur',    emoji: '🤖' },
  { value: 'FRYER',       label: 'Friteuse',         emoji: '🍟' },
  { value: 'PLANCHA',     label: 'Plancha/Poêle',    emoji: '🍳' },
  { value: 'STEAMER',     label: 'Cuiseur vapeur',   emoji: '💨' },
];

const GOALS = [
  { value: 'FAT_LOSS',      label: 'Perdre du gras',    emoji: '🔥', desc: 'Déficit calorique, protéines élevées' },
  { value: 'MUSCLE_GAIN',   label: 'Prendre du muscle', emoji: '💪', desc: 'Surplus calorique, force & volume' },
  { value: 'MAINTAIN',      label: 'Maintenir',          emoji: '⚖️', desc: 'Stabilité, forme au quotidien' },
  { value: 'HEALTHY_EATING',label: 'Manger sainement',  emoji: '🥗', desc: 'Équilibre, qualité nutritionnelle' },
];

const ACTIVITIES = [
  { value: 'SEDENTARY',      label: 'Sédentaire',         desc: 'Bureau, peu de mouvement', emoji: '🪑' },
  { value: 'LIGHTLY_ACTIVE', label: 'Légèrement actif',   desc: 'Marche, sport 1-2×/sem.', emoji: '🚶' },
  { value: 'ACTIVE',         label: 'Actif',              desc: 'Sport 3-5×/sem.',          emoji: '🏃' },
  { value: 'VERY_ACTIVE',    label: 'Très actif',         desc: 'Sport 6-7×/sem.',          emoji: '🚴' },
  { value: 'ATHLETE',        label: 'Athlète',            desc: 'Entraînement intensif',    emoji: '🏋️' },
];

// ─── Composant compteur ─────────────────────────────────────────────────────────

function Counter({ label, sublabel, value, onChange, min = 0 }: {
  label: string; sublabel?: string; value: number;
  onChange: (v: number) => void; min?: number;
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        {sublabel && <p className="text-sm text-gray-400">{sublabel}</p>}
      </div>
      <div className="flex items-center gap-3 bg-blue-50 rounded-2xl px-2 py-1">
        <button
          className="w-9 h-9 flex items-center justify-center text-xl text-gray-400 hover:text-gray-700 disabled:opacity-30"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >—</button>
        <span className="w-6 text-center font-semibold text-gray-800 text-lg">{value}</span>
        <button
          className="w-9 h-9 flex items-center justify-center text-xl text-gray-500 hover:text-gray-700"
          onClick={() => onChange(value + 1)}
        >+</button>
      </div>
    </div>
  );
}

// ─── Composant carte sélectionnable ────────────────────────────────────────────

function SelectCard({ emoji, label, selected, onClick, wide = false }: {
  emoji: string; label: string; selected: boolean; onClick: () => void; wide?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all text-center ${
        wide ? 'col-span-3' : ''
      } ${
        selected
          ? 'border-brand-500 bg-brand-50 text-brand-700'
          : 'border-gray-200 text-gray-600 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <span className="text-3xl mb-2">{emoji}</span>
      <span className="text-sm font-medium leading-tight">{label}</span>
    </button>
  );
}

// ─── Page principale ────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // Foyer
    adultsCount: 1,
    childrenCount: 0,
    // Régime
    dietaryConstraints: [] as string[],
    // Goûts
    dislikedIngredients: [] as string[],
    // Cuisine
    kitchenEquipment: [] as string[],
    // Objectifs
    goal: 'MAINTAIN' as string,
    // Physique
    sex: 'MALE' as string,
    age: 25,
    heightCm: 175,
    weightKg: 75,
    morphology: 'MESOMORPH',
    // Activité
    activityLevel: 'ACTIVE',
  });

  const toggle = (key: 'dietaryConstraints' | 'dislikedIngredients' | 'kitchenEquipment', value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const filteredDisliked = search.trim()
    ? DISLIKED.filter((i) => i.toLowerCase().includes(search.toLowerCase()))
    : DISLIKED;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.createProfile(form);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 pt-6">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full mb-6">
          <div
            className="h-1.5 bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Back / Close */}
        <div className="flex justify-between items-center mb-8">
          {step > 0 ? (
            <button
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              onClick={() => setStep(step - 1)}
            >←</button>
          ) : <div />}
          <button
            className="text-gray-300 hover:text-gray-500"
            onClick={() => router.push('/dashboard')}
          >✕</button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-1">
          {STEPS[step].title}
        </h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          {STEPS[step].subtitle}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 overflow-y-auto">

        {/* ─── Étape 1 : Foyer ─── */}
        {step === 0 && (
          <div className="space-y-3 max-w-sm mx-auto">
            <Counter
              label="Adultes"
              value={form.adultsCount}
              min={1}
              onChange={(v) => setForm({ ...form, adultsCount: v })}
            />
            <Counter
              label="Enfants ou adolescents"
              sublabel="De plus de 3 ans"
              value={form.childrenCount}
              onChange={(v) => setForm({ ...form, childrenCount: v })}
            />
          </div>
        )}

        {/* ─── Étape 2 : Régime ─── */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {DIETS.map((d) => (
              <SelectCard
                key={d.value}
                emoji={d.emoji}
                label={d.label}
                selected={form.dietaryConstraints.includes(d.value)}
                onClick={() => toggle('dietaryConstraints', d.value)}
              />
            ))}
          </div>
        )}

        {/* ─── Étape 3 : Goûts ─── */}
        {step === 2 && (
          <div className="max-w-sm mx-auto space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-400 outline-none text-sm"
                placeholder="Rechercher un ingrédient"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredDisliked.map((ingredient) => {
                const selected = form.dislikedIngredients.includes(ingredient);
                return (
                  <button
                    key={ingredient}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      selected
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                    onClick={() => toggle('dislikedIngredients', ingredient)}
                  >
                    {ingredient}
                    <span className={selected ? 'text-white' : 'text-gray-400'}>
                      {selected ? '✕' : '+'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Étape 4 : Cuisine ─── */}
        {step === 3 && (
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {EQUIPMENT.map((eq) => (
              <SelectCard
                key={eq.value}
                emoji={eq.emoji}
                label={eq.label}
                selected={form.kitchenEquipment.includes(eq.value)}
                onClick={() => toggle('kitchenEquipment', eq.value)}
              />
            ))}
          </div>
        )}

        {/* ─── Étape 5 : Objectifs ─── */}
        {step === 4 && (
          <div className="space-y-3 max-w-sm mx-auto">
            {GOALS.map((g) => (
              <button
                key={g.value}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                  form.goal === g.value
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setForm({ ...form, goal: g.value })}
              >
                <span className="text-3xl shrink-0">{g.emoji}</span>
                <div>
                  <p className={`font-semibold ${form.goal === g.value ? 'text-brand-700' : 'text-gray-800'}`}>
                    {g.label}
                  </p>
                  <p className="text-xs text-gray-400">{g.desc}</p>
                </div>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  form.goal === g.value ? 'border-brand-500 bg-brand-500' : 'border-gray-300'
                }`}>
                  {form.goal === g.value && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ─── Étape 6 : Physique ─── */}
        {step === 5 && (
          <div className="space-y-6 max-w-sm mx-auto">
            {/* Sexe */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'MALE', label: 'Homme', emoji: '👨' },
                { value: 'FEMALE', label: 'Femme', emoji: '👩' },
              ].map((s) => (
                <SelectCard
                  key={s.value}
                  emoji={s.emoji}
                  label={s.label}
                  selected={form.sex === s.value}
                  onClick={() => setForm({ ...form, sex: s.value })}
                />
              ))}
            </div>

            {/* Sliders */}
            {[
              { key: 'age', label: 'Âge', unit: 'ans', min: 14, max: 80 },
              { key: 'heightCm', label: 'Taille', unit: 'cm', min: 140, max: 210 },
              { key: 'weightKg', label: 'Poids', unit: 'kg', min: 40, max: 150 },
            ].map(({ key, label, unit, min, max }) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <span className="text-sm font-bold text-brand-600">
                    {form[key as keyof typeof form]} {unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={form[key as keyof typeof form] as number}
                  onChange={(e) => setForm({ ...form, [key]: +e.target.value })}
                  className="w-full accent-brand-500 h-1.5 rounded-full"
                />
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>{min}</span><span>{max}</span>
                </div>
              </div>
            ))}

            {/* Morphologie */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Morphologie</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'ECTOMORPH', label: 'Ecto', desc: 'Mince', emoji: '🦴' },
                  { value: 'MESOMORPH', label: 'Méso', desc: 'Athlétique', emoji: '💪' },
                  { value: 'ENDOMORPH', label: 'Endo', desc: 'Rond', emoji: '🫂' },
                ].map((m) => (
                  <button
                    key={m.value}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      form.morphology === m.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setForm({ ...form, morphology: m.value })}
                  >
                    <div className="text-2xl mb-1">{m.emoji}</div>
                    <div className={`text-xs font-semibold ${form.morphology === m.value ? 'text-brand-700' : 'text-gray-600'}`}>
                      {m.label}
                    </div>
                    <div className="text-xs text-gray-400">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Étape 7 : Activité ─── */}
        {step === 6 && (
          <div className="space-y-3 max-w-sm mx-auto">
            {ACTIVITIES.map((a) => (
              <button
                key={a.value}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                  form.activityLevel === a.value
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setForm({ ...form, activityLevel: a.value })}
              >
                <span className="text-2xl shrink-0">{a.emoji}</span>
                <div>
                  <p className={`font-semibold ${form.activityLevel === a.value ? 'text-brand-700' : 'text-gray-800'}`}>
                    {a.label}
                  </p>
                  <p className="text-xs text-gray-400">{a.desc}</p>
                </div>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  form.activityLevel === a.value ? 'border-brand-500 bg-brand-500' : 'border-gray-300'
                }`}>
                  {form.activityLevel === a.value && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CTA fixé en bas */}
      <div className="p-4 pt-3 pb-8 bg-white border-t border-gray-50">
        <button
          className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition-all ${
            loading ? 'bg-brand-300' : 'bg-brand-500 hover:bg-brand-600 active:scale-98'
          }`}
          onClick={isLast ? handleSubmit : () => setStep(step + 1)}
          disabled={loading}
        >
          {loading ? 'Calcul en cours...' : isLast ? 'Valider' : 'Suivant'}
        </button>

        {/* Skip pour les étapes optionnelles */}
        {[1, 2, 3].includes(step) && (
          <button
            className="w-full py-2 mt-2 text-sm text-gray-400 hover:text-gray-600"
            onClick={() => setStep(step + 1)}
          >
            Passer cette étape
          </button>
        )}
      </div>
    </div>
  );
}
