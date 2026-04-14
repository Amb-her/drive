import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  FlatList, Alert, RefreshControl, ScrollView, Image,
  Modal, Dimensions,
} from 'react-native';
import { api } from '../lib/api';

const { width: SCREEN_W } = Dimensions.get('window');

const NUTRI_BG: Record<string, string> = {
  A: '#22c55e', B: '#84cc16', C: '#eab308', D: '#f97316', E: '#ef4444',
};

const MEAL_TABS = [
  { value: '',          label: '✨ Pour toi' },
  { value: 'BREAKFAST', label: '🌅 Petit-déj' },
  { value: 'LUNCH',     label: '☀️ Déjeuner' },
  { value: 'DINNER',    label: '🌙 Dîner' },
  { value: 'SNACK',     label: '⚡ Snack' },
];

// ── Composant carte recette ─────────────────────────────────────────────────────

function RecipeCard({ recipe, onPress, onAddToCart, onLog }: {
  recipe: any;
  onPress: () => void;
  onAddToCart: (r: any) => void;
  onLog: (r: any) => void;
}) {
  const totalTime = recipe.prepTimeMin + recipe.cookTimeMin;

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.92}>
      {/* Image */}
      <View style={s.imageContainer}>
        {recipe.imageUrl ? (
          <Image source={{ uri: recipe.imageUrl }} style={s.image} resizeMode="cover" />
        ) : (
          <View style={[s.image, s.imagePlaceholder]}>
            <Text style={{ fontSize: 48 }}>🍽️</Text>
          </View>
        )}

        {/* Gradient overlay */}
        <View style={s.imageOverlay} />

        {/* Badges top */}
        <View style={s.badgesTop}>
          <View style={[s.nutriBadge, { backgroundColor: NUTRI_BG[recipe.nutriScore] }]}>
            <Text style={s.nutriText}>{recipe.nutriScore}</Text>
          </View>
          {recipe.matchScore !== undefined && (
            <View style={s.matchBadge}>
              <Text style={s.matchText}>✦ {recipe.matchScore}%</Text>
            </View>
          )}
        </View>

        {/* Meta bottom */}
        <View style={s.imageMeta}>
          <View style={s.metaPill}>
            <Text style={s.metaText}>⏱ {totalTime}min</Text>
          </View>
          <View style={s.metaPill}>
            <Text style={s.metaText}>🌿 {recipe.greenScore}</Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={s.cardBody}>
        <Text style={s.recipeName} numberOfLines={2}>{recipe.name}</Text>
        <Text style={s.recipeDesc} numberOfLines={2}>{recipe.description}</Text>

        {/* ── Macros ── */}
        <View style={s.macrosBox}>
          {/* Calories hero */}
          <View style={s.calorieRow}>
            <Text style={s.calorieNum}>{Math.round(recipe.caloriesPerServing)}</Text>
            <Text style={s.calorieUnit}> kcal / portion</Text>
          </View>

          {/* Barres */}
          <MacroBar label="Protéines" value={recipe.proteinPerServing} max={50} color="#ef4444" />
          <MacroBar label="Glucides"  value={recipe.carbsPerServing}  max={100} color="#3b82f6" />
          <MacroBar label="Lipides"   value={recipe.fatPerServing}    max={40}  color="#eab308" />
          <MacroBar label="Fibres"    value={recipe.fiberPerServing}  max={15}  color="#22c55e" />

          {/* Pills résumé */}
          <View style={s.macroPills}>
            <MacroPill label="Prot" value={recipe.proteinPerServing} color="#fef2f2" text="#ef4444" />
            <MacroPill label="Gluc" value={recipe.carbsPerServing}   color="#eff6ff" text="#3b82f6" />
            <MacroPill label="Lip"  value={recipe.fatPerServing}     color="#fefce8" text="#eab308" />
            <MacroPill label="Fib"  value={recipe.fiberPerServing}   color="#f0fdf4" text="#22c55e" />
          </View>
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity style={s.btnCart} onPress={() => onAddToCart(recipe)}>
            <Text style={s.btnCartText}>🛒 Panier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnLog} onPress={() => onLog(recipe)}>
            <Text style={s.btnLogText}>✅ J'ai mangé ça</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <View style={s.macroBarRow}>
      <Text style={s.macroBarLabel}>{label}</Text>
      <View style={s.macroBarBg}>
        <View style={[s.macroBarFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[s.macroBarVal, { color }]}>{Math.round(value)}g</Text>
    </View>
  );
}

function MacroPill({ label, value, color, text }: { label: string; value: number; color: string; text: string }) {
  return (
    <View style={[s.pill, { backgroundColor: color }]}>
      <Text style={[s.pillVal, { color: text }]}>{Math.round(value)}g</Text>
      <Text style={[s.pillLabel, { color: text }]}>{label}</Text>
    </View>
  );
}

// ── Modal détail ────────────────────────────────────────────────────────────────

function RecipeModal({ recipe, onClose, onAddToCart, onLog }: {
  recipe: any; onClose: () => void;
  onAddToCart: (r: any) => void; onLog: (r: any) => void;
}) {
  const totalTime = recipe.prepTimeMin + recipe.cookTimeMin;
  const total = recipe.caloriesPerServing;
  const protPct = Math.round((recipe.proteinPerServing * 4 / total) * 100);
  const carbPct = Math.round((recipe.carbsPerServing * 4 / total) * 100);
  const fatPct = Math.round((recipe.fatPerServing * 9 / total) * 100);

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Image */}
        <View style={{ height: 240, backgroundColor: '#f3f4f6' }}>
          {recipe.imageUrl ? (
            <Image source={{ uri: recipe.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 64 }}>🍽️</Text>
            </View>
          )}
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />

          {/* Close */}
          <TouchableOpacity
            style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
            onPress={onClose}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
          </TouchableOpacity>

          {/* Badges */}
          <View style={{ position: 'absolute', top: 16, left: 16, flexDirection: 'row', gap: 8 }}>
            <View style={{ backgroundColor: NUTRI_BG[recipe.nutriScore], width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>{recipe.nutriScore}</Text>
            </View>
            {recipe.matchScore !== undefined && (
              <View style={{ backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Text style={{ color: '#15803d', fontWeight: '700', fontSize: 12 }}>✦ {recipe.matchScore}%</Text>
              </View>
            )}
          </View>

          {/* Title overlay */}
          <View style={{ position: 'absolute', bottom: 16, left: 16, right: 80 }}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 26 }}>{recipe.name}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>
              ⏱ {totalTime}min · 🌿 {recipe.greenScore}/100
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Calories */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 }}>
            <Text style={{ fontSize: 40, fontWeight: '900', color: '#f97316' }}>{Math.round(recipe.caloriesPerServing)}</Text>
            <Text style={{ fontSize: 16, color: '#9ca3af', marginLeft: 4 }}>kcal / portion</Text>
          </View>

          {/* Macro cards 2x2 */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Protéines', val: recipe.proteinPerServing, icon: '🥩', from: '#f87171', to: '#ef4444', note: 'Construisent le muscle' },
              { label: 'Glucides',  val: recipe.carbsPerServing,  icon: '🌾', from: '#60a5fa', to: '#3b82f6', note: 'Énergie principale' },
              { label: 'Lipides',   val: recipe.fatPerServing,    icon: '🫒', from: '#fbbf24', to: '#eab308', note: 'Hormones & absorption' },
              { label: 'Fibres',    val: recipe.fiberPerServing,  icon: '🥦', from: '#4ade80', to: '#22c55e', note: 'Transit & satiété' },
            ].map((m) => (
              <View key={m.label} style={{ width: (SCREEN_W - 50) / 2, backgroundColor: m.to, borderRadius: 16, padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={{ fontSize: 18 }}>{m.icon}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600' }}>{m.label}</Text>
                </View>
                <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900' }}>
                  {Math.round(m.val)}<Text style={{ fontSize: 14, fontWeight: '400', opacity: 0.8 }}>g</Text>
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>{m.note}</Text>
              </View>
            ))}
          </View>

          {/* Répartition */}
          <View style={{ backgroundColor: '#f9fafb', borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: 10 }}>
              Répartition calorique
            </Text>
            <View style={{ flexDirection: 'row', height: 12, borderRadius: 8, overflow: 'hidden', gap: 2 }}>
              <View style={{ width: `${protPct}%`, backgroundColor: '#ef4444', borderRadius: 4 }} />
              <View style={{ width: `${carbPct}%`, backgroundColor: '#3b82f6', borderRadius: 4 }} />
              <View style={{ width: `${fatPct}%`, backgroundColor: '#eab308', borderRadius: 4 }} />
            </View>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
              {[
                { color: '#ef4444', label: `Protéines ${protPct}%` },
                { color: '#3b82f6', label: `Glucides ${carbPct}%` },
                { color: '#eab308', label: `Lipides ${fatPct}%` },
              ].map((l) => (
                <View key={l.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: l.color }} />
                  <Text style={{ fontSize: 11, color: '#9ca3af' }}>{l.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 22, marginBottom: 20 }}>{recipe.description}</Text>
        </ScrollView>

        {/* CTA */}
        <View style={{ flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 2, borderColor: '#22c55e', alignItems: 'center' }}
            onPress={() => { onAddToCart(recipe); onClose(); }}
          >
            <Text style={{ color: '#22c55e', fontWeight: '700', fontSize: 15 }}>🛒 Panier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: '#22c55e', alignItems: 'center' }}
            onPress={() => { onLog(recipe); onClose(); }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>✅ J'ai mangé ça</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// ── Écran principal ─────────────────────────────────────────────────────────────

export function RecipesScreen() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [remaining, setRemaining] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const load = async () => {
    try {
      const mealType = MEAL_TABS[activeTab].value || undefined;
      const data = await api.getRecommendations(mealType);
      setRecipes(data.recipes || []);
      setRemaining(data.remaining);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [activeTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [activeTab]);

  const handleAddToCart = async (recipe: any) => {
    try {
      await api.addRecipeToCart(recipe.id);
      Alert.alert('✅ Ajouté', `${recipe.name} ajouté au panier`);
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    }
  };

  const handleLog = async (recipe: any) => {
    try {
      const mealType = MEAL_TABS[activeTab].value || 'LUNCH';
      await api.logMeal({ recipeId: recipe.id, mealType });
      Alert.alert('✅ Enregistré', `${recipe.name} logué`);
      load();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Modal */}
      {selected && (
        <RecipeModal
          recipe={selected}
          onClose={() => setSelected(null)}
          onAddToCart={handleAddToCart}
          onLog={handleLog}
        />
      )}

      {/* Header */}
      <View style={s.header}>
        <Text style={s.pageTitle}>Recettes</Text>
        {remaining && (
          <Text style={s.remainingText}>
            Reste : <Text style={{ color: '#f97316' }}>{remaining.calories}kcal</Text>
            {' · '}<Text style={{ color: '#ef4444' }}>{remaining.protein}g P</Text>
            {' · '}<Text style={{ color: '#3b82f6' }}>{remaining.carbs}g G</Text>
          </Text>
        )}
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabsContainer}
        style={s.tabsScroll}
      >
        {MEAL_TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab.value}
            style={[s.tab, activeTab === i && s.tabActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[s.tabText, activeTab === i && s.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => setSelected(item)}
            onAddToCart={handleAddToCart}
            onLog={handleLog}
          />
        )}
        contentContainerStyle={s.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22c55e" />
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🍽️</Text>
            <Text style={s.emptyText}>Aucune recette disponible</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  pageTitle: { fontSize: 30, fontWeight: '800', color: '#111827' },
  remainingText: { fontSize: 12, color: '#9ca3af', marginTop: 2 },

  tabsScroll: { maxHeight: 52 },
  tabsContainer: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
  },
  tabActive: { backgroundColor: '#111827', borderColor: '#111827' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#fff' },

  list: { padding: 16, gap: 16, paddingBottom: 32 },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12 },
  imageContainer: { height: 200, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  imageOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)' },
  badgesTop: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 8 },
  nutriBadge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4 },
  nutriText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  matchBadge: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  matchText: { color: '#15803d', fontWeight: '700', fontSize: 12 },
  imageMeta: { position: 'absolute', bottom: 12, right: 12, flexDirection: 'row', gap: 6 },
  metaPill: { backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  metaText: { color: '#fff', fontSize: 11, fontWeight: '500' },

  cardBody: { padding: 16 },
  recipeName: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 4 },
  recipeDesc: { fontSize: 13, color: '#9ca3af', lineHeight: 18, marginBottom: 12 },

  // Macros box
  macrosBox: { backgroundColor: '#f9fafb', borderRadius: 16, padding: 12, marginBottom: 12 },
  calorieRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  calorieNum: { fontSize: 28, fontWeight: '900', color: '#f97316' },
  calorieUnit: { fontSize: 13, color: '#9ca3af' },

  macroBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  macroBarLabel: { width: 62, fontSize: 11, color: '#9ca3af' },
  macroBarBg: { flex: 1, height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' },
  macroBarFill: { height: 6, borderRadius: 3 },
  macroBarVal: { width: 32, fontSize: 11, fontWeight: '700', textAlign: 'right' },

  macroPills: { flexDirection: 'row', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  pill: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 10 },
  pillVal: { fontSize: 14, fontWeight: '800' },
  pillLabel: { fontSize: 10, marginTop: 1 },

  // Actions
  actions: { flexDirection: 'row', gap: 8 },
  btnCart: { flex: 1, paddingVertical: 11, borderRadius: 14, borderWidth: 2, borderColor: '#22c55e', alignItems: 'center' },
  btnCartText: { color: '#22c55e', fontWeight: '700', fontSize: 13 },
  btnLog: { flex: 1, paddingVertical: 11, borderRadius: 14, backgroundColor: '#22c55e', alignItems: 'center' },
  btnLogText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, color: '#9ca3af' },
});
