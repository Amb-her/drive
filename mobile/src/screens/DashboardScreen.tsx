import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl,
} from 'react-native';
import { api } from '../lib/api';

export function DashboardScreen() {
  const [daily, setDaily] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const d = await api.getDailyDashboard();
      setDaily(d);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22c55e" />}
      >
        <Text style={styles.title}>Dashboard</Text>

        {daily && (
          <>
            {/* Calories */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Aujourd'hui</Text>
              <View style={styles.calorieRow}>
                <Text style={styles.calorieNumber}>{daily.consumed.calories}</Text>
                <Text style={styles.calorieTarget}>/ {daily.targets.calories} kcal</Text>
              </View>

              <MacroBar label="Protéines" current={daily.consumed.protein} target={daily.targets.protein} color="#ef4444" />
              <MacroBar label="Glucides" current={daily.consumed.carbs} target={daily.targets.carbs} color="#3b82f6" />
              <MacroBar label="Lipides" current={daily.consumed.fat} target={daily.targets.fat} color="#eab308" />
            </View>

            {/* Remaining */}
            <View style={[styles.card, { backgroundColor: '#f0fdf4' }]}>
              <Text style={styles.remainingText}>
                Il te reste {daily.remaining.calories} kcal — {daily.remaining.protein}g P / {daily.remaining.carbs}g G / {daily.remaining.fat}g L
              </Text>
            </View>

            {/* Meals */}
            {daily.meals?.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Repas du jour</Text>
                {daily.meals.map((meal: any) => (
                  <View key={meal.id} style={styles.mealRow}>
                    <View>
                      <Text style={styles.mealType}>{meal.mealType}</Text>
                      <Text style={styles.mealName}>{meal.recipe?.name}</Text>
                    </View>
                    <Text style={styles.mealCal}>{Math.round(meal.calories)} kcal</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MacroBar({ label, current, target, color }: {
  label: string; current: number; target: number; color: string;
}) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <View style={styles.macroContainer}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{Math.round(current)} / {Math.round(target)}g</Text>
      </View>
      <View style={styles.macroBarBg}>
        <View style={[styles.macroBarFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  scroll: { padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 12 },
  calorieRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 16 },
  calorieNumber: { fontSize: 40, fontWeight: 'bold', color: '#22c55e' },
  calorieTarget: { fontSize: 16, color: '#9ca3af', marginLeft: 4 },
  macroContainer: { marginBottom: 10 },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  macroLabel: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  macroValue: { fontSize: 13, color: '#9ca3af' },
  macroBarBg: { height: 8, backgroundColor: '#f3f4f6', borderRadius: 4, overflow: 'hidden' },
  macroBarFill: { height: 8, borderRadius: 4 },
  remainingText: { fontSize: 14, fontWeight: '500', color: '#15803d' },
  mealRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  mealType: { fontSize: 11, color: '#9ca3af', textTransform: 'uppercase' },
  mealName: { fontSize: 15, fontWeight: '500', color: '#374151' },
  mealCal: { fontSize: 15, fontWeight: '600', color: '#f97316' },
});
