import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Alert, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { api } from '../lib/api';
import { useStore } from '../lib/store';

// ─── Config ────────────────────────────────────────────────────────────────────

const STEPS = [
  { title: 'Votre foyer',     subtitle: 'Dites-nous tout sur votre chez vous' },
  { title: 'Votre régime',    subtitle: 'Avez-vous un régime particulier ?' },
  { title: 'Vos goûts',      subtitle: 'Des ingrédients que vous n\'aimez pas ?' },
  { title: 'Votre cuisine',   subtitle: 'Quels équipements avez-vous ?' },
  { title: 'Vos objectifs',   subtitle: 'NutriDrive vous accompagne vers vos objectifs' },
  { title: 'Votre physique',  subtitle: 'Pour calculer vos besoins précis' },
  { title: 'Votre activité',  subtitle: 'Votre niveau d\'activité habituel' },
];

const DIETS = [
  { value: 'VEGETARIAN',   label: 'Végétarien',          emoji: '🥕' },
  { value: 'VEGAN',        label: 'Végétalien (vegan)',   emoji: '🌿' },
  { value: 'HALAL',        label: 'Sans porc',            emoji: '🐷' },
  { value: 'GLUTEN_FREE',  label: 'Sans gluten',          emoji: '🌾' },
  { value: 'LACTOSE_FREE', label: 'Sans laitier',         emoji: '🥛' },
  { value: 'KETO',         label: 'Keto',                 emoji: '🥑' },
];

const DISLIKED_SUGGESTIONS = [
  'Fruits de mer', 'Poisson', 'Coriandre', 'Brocoli',
  'Fruits à coque', 'Œuf', 'Alcool', 'Champignons',
  'Aubergine', 'Céleri', 'Foie', 'Avocat',
];

const EQUIPMENT = [
  { value: 'OVEN',      label: 'Four',        emoji: '🔲' },
  { value: 'MICROWAVE', label: 'Micro-ondes', emoji: '📡' },
  { value: 'AIRFRYER',  label: 'Air-fryer',   emoji: '🌬️' },
  { value: 'BLENDER',   label: 'Mixeur',      emoji: '🌀' },
  { value: 'COOKER',    label: 'Robot',       emoji: '🤖' },
  { value: 'FRYER',     label: 'Friteuse',    emoji: '🍟' },
  { value: 'PLANCHA',   label: 'Plancha',     emoji: '🍳' },
  { value: 'STEAMER',   label: 'Vapeur',      emoji: '💨' },
];

const GOALS = [
  { value: 'FAT_LOSS',       label: 'Perdre du gras',    emoji: '🔥', desc: 'Déficit calorique, protéines élevées' },
  { value: 'MUSCLE_GAIN',    label: 'Prendre du muscle', emoji: '💪', desc: 'Surplus calorique, force & volume' },
  { value: 'MAINTAIN',       label: 'Maintenir',          emoji: '⚖️', desc: 'Stabilité, forme au quotidien' },
  { value: 'HEALTHY_EATING', label: 'Manger sainement',  emoji: '🥗', desc: 'Équilibre, qualité nutritionnelle' },
];

const ACTIVITIES = [
  { value: 'SEDENTARY',      label: 'Sédentaire',       desc: 'Bureau, peu de mouvement', emoji: '🪑' },
  { value: 'LIGHTLY_ACTIVE', label: 'Légèrement actif', desc: 'Marche, sport 1-2×/sem.',  emoji: '🚶' },
  { value: 'ACTIVE',         label: 'Actif',            desc: 'Sport 3-5×/sem.',           emoji: '🏃' },
  { value: 'VERY_ACTIVE',    label: 'Très actif',       desc: 'Sport 6-7×/sem.',           emoji: '🚴' },
  { value: 'ATHLETE',        label: 'Athlète',          desc: 'Entraînement intensif',     emoji: '🏋️' },
];

const MORPHOLOGIES = [
  { value: 'ECTOMORPH', label: 'Ecto', emoji: '🦴' },
  { value: 'MESOMORPH', label: 'Méso', emoji: '💪' },
  { value: 'ENDOMORPH', label: 'Endo', emoji: '🫂' },
];

// ─── Sous-composants ────────────────────────────────────────────────────────────

function Counter({ label, sublabel, value, onChange, min = 0 }: {
  label: string; sublabel?: string; value: number;
  onChange: (v: number) => void; min?: number;
}) {
  return (
    <View style={s.counterRow}>
      <View>
        <Text style={s.counterLabel}>{label}</Text>
        {sublabel ? <Text style={s.counterSub}>{sublabel}</Text> : null}
      </View>
      <View style={s.counterControls}>
        <TouchableOpacity
          style={[s.counterBtn, value <= min && { opacity: 0.3 }]}
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Text style={s.counterBtnText}>—</Text>
        </TouchableOpacity>
        <Text style={s.counterValue}>{value}</Text>
        <TouchableOpacity style={s.counterBtn} onPress={() => onChange(value + 1)}>
          <Text style={s.counterBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function GridCard({ emoji, label, selected, onPress }: {
  emoji: string; label: string; selected: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.gridCard, selected && s.gridCardSelected]}
      onPress={onPress}
    >
      <Text style={s.gridEmoji}>{emoji}</Text>
      <Text style={[s.gridLabel, selected && s.gridLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

function RadioRow({ emoji, label, desc, selected, onPress }: {
  emoji: string; label: string; desc?: string; selected: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[s.radioRow, selected && s.radioRowSelected]} onPress={onPress}>
      <Text style={s.radioEmoji}>{emoji}</Text>
      <View style={s.radioText}>
        <Text style={[s.radioLabel, selected && s.radioLabelSelected]}>{label}</Text>
        {desc ? <Text style={s.radioDesc}>{desc}</Text> : null}
      </View>
      <View style={[s.radioCircle, selected && s.radioCircleSelected]}>
        {selected && <View style={s.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

// ─── Écran principal ────────────────────────────────────────────────────────────

export function OnboardingScreen() {
  const { init } = useStore();
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    adultsCount: 1,
    childrenCount: 0,
    dietaryConstraints: [] as string[],
    dislikedIngredients: [] as string[],
    kitchenEquipment: [] as string[],
    goal: 'MAINTAIN',
    sex: 'MALE',
    age: 25,
    heightCm: 175,
    weightKg: 75,
    morphology: 'MESOMORPH',
    activityLevel: 'ACTIVE',
  });

  const toggle = (key: 'dietaryConstraints' | 'dislikedIngredients' | 'kitchenEquipment', val: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(val)
        ? (prev[key] as string[]).filter((v) => v !== val)
        : [...(prev[key] as string[]), val],
    }));
  };

  const filteredDisliked = search.trim()
    ? DISLIKED_SUGGESTIONS.filter((i) => i.toLowerCase().includes(search.toLowerCase()))
    : DISLIKED_SUGGESTIONS;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.createProfile(form);
      await init();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  const isLast = step === STEPS.length - 1;
  const isOptionalStep = [1, 2, 3].includes(step);
  const pct = ((step + 1) / STEPS.length) * 100;

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Progress bar */}
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width: `${pct}%` }]} />
        </View>

        {/* Top nav */}
        <View style={s.topNav}>
          {step > 0 ? (
            <TouchableOpacity onPress={() => setStep(step - 1)}>
              <Text style={s.backBtn}>←</Text>
            </TouchableOpacity>
          ) : <View style={{ width: 32 }} />}
          <View />
        </View>

        {/* Title */}
        <Text style={s.title}>{STEPS[step].title}</Text>
        <Text style={s.subtitle}>{STEPS[step].subtitle}</Text>

        {/* Step content */}
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

          {/* ── Foyer ── */}
          {step === 0 && (
            <View style={s.section}>
              <Counter label="Adultes" value={form.adultsCount} min={1}
                onChange={(v) => setForm({ ...form, adultsCount: v })} />
              <Counter label="Enfants ou adolescents" sublabel="De plus de 3 ans"
                value={form.childrenCount}
                onChange={(v) => setForm({ ...form, childrenCount: v })} />
            </View>
          )}

          {/* ── Régime ── */}
          {step === 1 && (
            <View style={s.grid2}>
              {DIETS.map((d) => (
                <GridCard key={d.value} emoji={d.emoji} label={d.label}
                  selected={form.dietaryConstraints.includes(d.value)}
                  onPress={() => toggle('dietaryConstraints', d.value)} />
              ))}
            </View>
          )}

          {/* ── Goûts ── */}
          {step === 2 && (
            <View style={s.section}>
              <View style={s.searchRow}>
                <Text style={s.searchIcon}>🔍</Text>
                <TextInput
                  style={s.searchInput}
                  placeholder="Rechercher un ingrédient"
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={s.pillsWrap}>
                {filteredDisliked.map((ingredient) => {
                  const sel = form.dislikedIngredients.includes(ingredient);
                  return (
                    <TouchableOpacity
                      key={ingredient}
                      style={[s.pill, sel && s.pillSelected]}
                      onPress={() => toggle('dislikedIngredients', ingredient)}
                    >
                      <Text style={[s.pillText, sel && s.pillTextSelected]}>
                        {ingredient} {sel ? '✕' : '+'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Cuisine ── */}
          {step === 3 && (
            <View style={s.grid3}>
              {EQUIPMENT.map((eq) => (
                <GridCard key={eq.value} emoji={eq.emoji} label={eq.label}
                  selected={form.kitchenEquipment.includes(eq.value)}
                  onPress={() => toggle('kitchenEquipment', eq.value)} />
              ))}
            </View>
          )}

          {/* ── Objectifs ── */}
          {step === 4 && (
            <View style={s.section}>
              {GOALS.map((g) => (
                <RadioRow key={g.value} emoji={g.emoji} label={g.label} desc={g.desc}
                  selected={form.goal === g.value}
                  onPress={() => setForm({ ...form, goal: g.value })} />
              ))}
            </View>
          )}

          {/* ── Physique ── */}
          {step === 5 && (
            <View style={s.section}>
              {/* Sexe */}
              <View style={s.grid2}>
                {[{ value: 'MALE', label: 'Homme', emoji: '👨' }, { value: 'FEMALE', label: 'Femme', emoji: '👩' }].map((sx) => (
                  <GridCard key={sx.value} emoji={sx.emoji} label={sx.label}
                    selected={form.sex === sx.value}
                    onPress={() => setForm({ ...form, sex: sx.value })} />
                ))}
              </View>

              {/* Âge */}
              <View style={s.sliderBlock}>
                <View style={s.sliderHeader}>
                  <Text style={s.sliderLabel}>Âge</Text>
                  <Text style={s.sliderValue}>{form.age} ans</Text>
                </View>
                <View style={s.sliderTrack}>
                  <TouchableOpacity style={s.sliderBtn} onPress={() => setForm({ ...form, age: Math.max(14, form.age - 1) })}>
                    <Text style={s.sliderBtnText}>-</Text>
                  </TouchableOpacity>
                  <View style={s.sliderBar}>
                    <View style={[s.sliderFill, { width: `${((form.age - 14) / (80 - 14)) * 100}%` }]} />
                  </View>
                  <TouchableOpacity style={s.sliderBtn} onPress={() => setForm({ ...form, age: Math.min(80, form.age + 1) })}>
                    <Text style={s.sliderBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Taille */}
              <View style={s.sliderBlock}>
                <View style={s.sliderHeader}>
                  <Text style={s.sliderLabel}>Taille</Text>
                  <Text style={s.sliderValue}>{form.heightCm} cm</Text>
                </View>
                <View style={s.sliderTrack}>
                  <TouchableOpacity style={s.sliderBtn} onPress={() => setForm({ ...form, heightCm: Math.max(140, form.heightCm - 1) })}>
                    <Text style={s.sliderBtnText}>-</Text>
                  </TouchableOpacity>
                  <View style={s.sliderBar}>
                    <View style={[s.sliderFill, { width: `${((form.heightCm - 140) / (210 - 140)) * 100}%` }]} />
                  </View>
                  <TouchableOpacity style={s.sliderBtn} onPress={() => setForm({ ...form, heightCm: Math.min(210, form.heightCm + 1) })}>
                    <Text style={s.sliderBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Poids */}
              <View style={s.sliderBlock}>
                <View style={s.sliderHeader}>
                  <Text style={s.sliderLabel}>Poids</Text>
                  <Text style={s.sliderValue}>{form.weightKg} kg</Text>
                </View>
                <View style={s.sliderTrack}>
                  <TouchableOpacity style={s.sliderBtn} onPress={() => setForm({ ...form, weightKg: Math.max(40, form.weightKg - 1) })}>
                    <Text style={s.sliderBtnText}>-</Text>
                  </TouchableOpacity>
                  <View style={s.sliderBar}>
                    <View style={[s.sliderFill, { width: `${((form.weightKg - 40) / (150 - 40)) * 100}%` }]} />
                  </View>
                  <TouchableOpacity style={s.sliderBtn} onPress={() => setForm({ ...form, weightKg: Math.min(150, form.weightKg + 1) })}>
                    <Text style={s.sliderBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Morphologie */}
              <View style={s.grid3}>
                {MORPHOLOGIES.map((m) => (
                  <GridCard key={m.value} emoji={m.emoji} label={m.label}
                    selected={form.morphology === m.value}
                    onPress={() => setForm({ ...form, morphology: m.value })} />
                ))}
              </View>
            </View>
          )}

          {/* ── Activité ── */}
          {step === 6 && (
            <View style={s.section}>
              {ACTIVITIES.map((a) => (
                <RadioRow key={a.value} emoji={a.emoji} label={a.label} desc={a.desc}
                  selected={form.activityLevel === a.value}
                  onPress={() => setForm({ ...form, activityLevel: a.value })} />
              ))}
            </View>
          )}
        </ScrollView>

        {/* CTA */}
        <View style={s.cta}>
          <TouchableOpacity
            style={[s.ctaBtn, loading && { opacity: 0.6 }]}
            onPress={isLast ? handleSubmit : () => setStep(step + 1)}
            disabled={loading}
          >
            <Text style={s.ctaBtnText}>
              {loading ? 'Calcul...' : isLast ? 'Valider' : 'Suivant'}
            </Text>
          </TouchableOpacity>
          {isOptionalStep && (
            <TouchableOpacity style={s.skipBtn} onPress={() => setStep(step + 1)}>
              <Text style={s.skipText}>Passer cette étape</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  progressBg: { height: 4, backgroundColor: '#f3f4f6', marginBottom: 0 },
  progressFill: { height: 4, backgroundColor: '#22c55e', borderRadius: 2 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12 },
  backBtn: { fontSize: 24, color: '#6b7280' },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', textAlign: 'center', marginTop: 24, marginBottom: 4, paddingHorizontal: 20 },
  subtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  section: { gap: 10 },

  // Counter
  counterRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb',
  },
  counterLabel: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  counterSub: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  counterControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', borderRadius: 16, paddingHorizontal: 4 },
  counterBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  counterBtnText: { fontSize: 18, color: '#6b7280', fontWeight: '300' },
  counterValue: { width: 28, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#1f2937' },

  // Grids
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  grid3: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: {
    flex: 1, minWidth: '45%', paddingVertical: 16, paddingHorizontal: 8,
    borderRadius: 16, borderWidth: 2, borderColor: '#e5e7eb',
    alignItems: 'center', justifyContent: 'center',
  },
  gridCardSelected: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  gridEmoji: { fontSize: 28, marginBottom: 6 },
  gridLabel: { fontSize: 12, fontWeight: '600', color: '#4b5563', textAlign: 'center' },
  gridLabelSelected: { color: '#15803d' },

  // Pills (goûts)
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 50,
    paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fafafa',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1f2937' },
  pillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 50,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  pillSelected: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  pillText: { fontSize: 13, fontWeight: '500', color: '#4b5563' },
  pillTextSelected: { color: '#fff' },

  // Radio rows (objectifs & activité)
  radioRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 16, borderWidth: 2, borderColor: '#e5e7eb',
  },
  radioRowSelected: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  radioEmoji: { fontSize: 26 },
  radioText: { flex: 1 },
  radioLabel: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  radioLabelSelected: { color: '#15803d' },
  radioDesc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center' },
  radioCircleSelected: { borderColor: '#22c55e', backgroundColor: '#22c55e' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },

  // Sliders (physique)
  sliderBlock: { gap: 8 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },
  sliderValue: { fontSize: 14, fontWeight: '700', color: '#22c55e' },
  sliderTrack: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sliderBar: { flex: 1, height: 6, backgroundColor: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  sliderFill: { height: 6, backgroundColor: '#22c55e', borderRadius: 3 },
  sliderBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  sliderBtnText: { fontSize: 18, color: '#4b5563', fontWeight: '300' },

  // CTA
  cta: { paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f9fafb' },
  ctaBtn: { backgroundColor: '#22c55e', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  ctaBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  skipBtn: { paddingVertical: 10, alignItems: 'center' },
  skipText: { fontSize: 14, color: '#9ca3af' },
});
