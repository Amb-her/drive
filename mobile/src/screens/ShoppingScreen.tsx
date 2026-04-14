import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, SectionList, Alert, RefreshControl,
} from 'react-native';
import { api } from '../lib/api';

const CATEGORY_LABELS: Record<string, string> = {
  PROTEIN: 'Protéines', DAIRY: 'Produits laitiers', GRAIN: 'Céréales',
  VEGETABLE: 'Légumes', FRUIT: 'Fruits', FAT: 'Matières grasses',
  CONDIMENT: 'Condiments', BEVERAGE: 'Boissons', OTHER: 'Autres',
};

export function ShoppingScreen() {
  const [list, setList] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const result = await api.getShoppingList();
      setList(result);
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

  const toggleItem = async (id: string) => {
    await api.toggleShoppingItem(id);
    load();
  };

  const removeItem = async (id: string) => {
    await api.removeShoppingItem(id);
    load();
  };

  const clearList = () => {
    Alert.alert('Vider la liste ?', 'Tous les articles seront supprimés.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Vider', style: 'destructive', onPress: async () => { await api.clearShoppingList(); load(); } },
    ]);
  };

  // Grouper par catégorie
  const sections: { title: string; data: any[] }[] = [];
  if (list?.items) {
    const grouped: Record<string, any[]> = {};
    for (const item of list.items) {
      const cat = item.category || 'OTHER';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }
    for (const [key, items] of Object.entries(grouped)) {
      sections.push({ title: CATEGORY_LABELS[key] || key, data: items });
    }
  }

  const uncheckedCount = list?.items?.filter((i: any) => !i.checked).length ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes courses</Text>
        {list?.items?.length > 0 && (
          <TouchableOpacity onPress={clearList}>
            <Text style={styles.clearBtn}>Vider</Text>
          </TouchableOpacity>
        )}
      </View>

      {uncheckedCount > 0 && (
        <Text style={styles.count}>{uncheckedCount} article{uncheckedCount > 1 ? 's' : ''} restant{uncheckedCount > 1 ? 's' : ''}</Text>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={[styles.itemRow, item.checked && { opacity: 0.4 }]}>
            <TouchableOpacity
              style={[styles.checkbox, item.checked && styles.checkboxChecked]}
              onPress={() => toggleItem(item.id)}
            >
              {item.checked && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={[styles.itemName, item.checked && styles.itemChecked]}>
              {item.ingredientName}
            </Text>
            <Text style={styles.itemQty}>{item.quantity} {item.unit}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={styles.removeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22c55e" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Ton panier est vide</Text>
            <Text style={styles.emptySubtext}>Ajoute des recettes depuis l'onglet Recettes</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937' },
  clearBtn: { color: '#ef4444', fontWeight: '600', fontSize: 14 },
  count: { fontSize: 13, color: '#9ca3af', paddingHorizontal: 16, marginTop: 4 },
  list: { padding: 16, paddingBottom: 32 },
  sectionHeader: {
    fontSize: 12, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase',
    marginTop: 16, marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, marginBottom: 6,
    gap: 10,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2,
    borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  itemName: { flex: 1, fontSize: 15, color: '#374151' },
  itemChecked: { textDecorationLine: 'line-through' },
  itemQty: { fontSize: 13, color: '#9ca3af' },
  removeBtn: { color: '#d1d5db', fontSize: 16, paddingHorizontal: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, color: '#9ca3af', fontWeight: '500' },
  emptySubtext: { fontSize: 14, color: '#d1d5db', marginTop: 4 },
});
