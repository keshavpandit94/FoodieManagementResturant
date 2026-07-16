import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../hooks/use-theme';
import { InventoryItem } from '../types';
import { ArrowLeft, Search, Plus, Edit2, Trash2, X, AlertTriangle, Scale } from 'lucide-react-native';

export default function InventoryScreen() {
  const router = useRouter();
  const { 
    inventory, 
    outlets, 
    activeOutletId, 
    addInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem 
  } = useStore();

  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [minStock, setMinStock] = useState('10');
  const [itemOutletId, setItemOutletId] = useState('');

  // Filter list
  const filteredInventory = inventory.filter(item => {
    if (activeOutletId && item.outletId !== activeOutletId) return false;
    if (searchQuery.trim()) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleOpenModal = (item: InventoryItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setQuantity(item.quantity.toString());
      setUnit(item.unit);
      setMinStock(item.minStock.toString());
      setItemOutletId(item.outletId);
    } else {
      setEditingItem(null);
      setName('');
      setQuantity('');
      setUnit('kg');
      setMinStock('10');
      setItemOutletId(activeOutletId || (outlets.length > 0 ? outlets[0].id : ''));
    }
    setModalVisible(true);
  };

  const handleSaveItem = () => {
    const parsedQuantity = Number(quantity);
    const parsedMinStock = Number(minStock);

    if (!name.trim() || !unit.trim() || isNaN(parsedQuantity) || parsedQuantity < 0 || isNaN(parsedMinStock) || parsedMinStock < 0 || !itemOutletId) {
      Alert.alert('Invalid fields', 'Make sure to fill all fields and enter valid quantities.');
      return;
    }

    const itemData = {
      name: name.trim(),
      quantity: parsedQuantity,
      unit: unit.trim(),
      minStock: parsedMinStock,
      outletId: itemOutletId,
    };

    if (editingItem) {
      updateInventoryItem(editingItem.id, itemData);
    } else {
      addInventoryItem(itemData);
    }

    setModalVisible(false);
  };

  const getOutletName = (id: string) => outlets.find(o => o.id === id)?.name || 'Unknown Kitchen';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      {/* Header */}
      <View style={{ borderColor: theme.backgroundSelected }} className="flex-row items-center justify-between px-5 py-3.5 border-b">
        <View className="flex-row items-center flex-1">
          <Pressable 
            onPress={() => router.back()}
            style={{ backgroundColor: theme.backgroundSelected }}
            className="rounded-full p-2.5 mr-3.5"
          >
            <ArrowLeft size={16} color={theme.text} />
          </Pressable>
          <View>
            <Text style={{ color: theme.text }} className="text-lg font-extrabold">Kitchen Inventory</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs">Manage raw ingredients stock</Text>
          </View>
        </View>

        <Pressable
          onPress={() => handleOpenModal(null)}
          className="bg-orange-500 rounded-full px-4 py-2.5 flex-row items-center"
        >
          <Plus size={14} color="#FFFFFF" className="mr-1.5" />
          <Text className="text-white text-xs font-bold">Add Raw</Text>
        </Pressable>
      </View>

      {/* Search Input */}
      <View className="px-5 mt-5">
        <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row items-center border rounded-2xl px-4 py-3">
          <Search size={18} color={theme.textSecondary} className="mr-2.5" />
          <TextInput
            placeholder="Search raw ingredients..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ color: theme.text }}
            className="flex-1 text-sm bg-transparent border-0 outline-none py-1 font-semibold"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={16} color={theme.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Inventory Items list */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false} className="px-5 mt-5">
        {filteredInventory.length === 0 ? (
          <View 
            style={{ 
              backgroundColor: theme.backgroundElement, 
              borderColor: theme.backgroundSelected,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
              shadowRadius: 12,
              elevation: 2
            }} 
            className="border rounded-3xl p-12 items-center justify-center mt-4"
          >
            <Scale size={48} color={theme.textSecondary} className="mb-3" />
            <Text style={{ color: theme.text }} className="font-extrabold text-base">No ingredients registered</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs text-center mt-1.5 leading-5 font-semibold">
              Add your raw materials or change filters to view stock levels.
            </Text>
          </View>
        ) : (
          filteredInventory.map(item => {
            const isLowStock = item.quantity <= item.minStock;

            return (
              <View 
                key={item.id}
                style={{ 
                  backgroundColor: theme.backgroundElement, 
                  borderColor: isLowStock ? 'rgba(239, 68, 68, 0.4)' : theme.backgroundSelected,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                  shadowRadius: 12,
                  elevation: 2
                }}
                className="border rounded-3xl p-5 mb-4 flex-row justify-between items-center"
              >
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center flex-wrap gap-1.5">
                    <Text style={{ color: theme.text }} className="font-extrabold text-base mr-1">{item.name}</Text>
                    {isLowStock && (
                      <View className="bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full flex-row items-center">
                        <AlertTriangle size={10} color="#EF4444" className="mr-1" />
                        <Text className="text-red-500 text-[8px] font-black">LOW STOCK</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ color: theme.textSecondary }} className="text-xs mt-1.5 font-semibold">
                    Kitchen: {getOutletName(item.outletId)}
                  </Text>
                  <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mt-0.5">
                    Alert Min: {item.minStock} {item.unit}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className={`text-lg font-black ${isLowStock ? 'text-red-500' : 'text-emerald-500'}`}>
                    {item.quantity} {item.unit}
                  </Text>

                  <View className="flex-row gap-2 mt-3">
                    <Pressable
                      onPress={() => handleOpenModal(item)}
                      style={{ backgroundColor: theme.backgroundSelected }}
                      className="p-2 rounded-xl"
                    >
                      <Edit2 size={13} color="#FF5E36" />
                    </Pressable>
                    <Pressable
                      onPress={() => deleteInventoryItem(item.id)}
                      style={{ backgroundColor: theme.backgroundSelected }}
                      className="p-2 rounded-xl"
                    >
                      <Trash2 size={13} color="#EF4444" />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })
        )}
        <View className="h-10" />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/75 justify-end">
          <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="rounded-t-3xl border-t p-6 h-[72%]">
            <View style={{ borderColor: theme.backgroundSelected }} className="flex-row justify-between items-center border-b pb-4 mb-5">
              <Text style={{ color: theme.text }} className="text-xl font-bold">
                {editingItem ? 'Edit Ingredient' : 'Add Raw Material'}
              </Text>
              <Pressable onPress={() => setModalVisible(false)} style={{ backgroundColor: theme.backgroundSelected }} className="rounded-full p-1.5">
                <X size={18} color={theme.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {/* Ingredient Name */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Item Name</Text>
                <TextInput
                  placeholder="e.g. Basmati Rice, Paneer, Spices"
                  placeholderTextColor={theme.textSecondary}
                  value={name}
                  onChangeText={setName}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none"
                />
              </View>

              {/* Quantity and Unit */}
              <View className="flex-row justify-between mb-4">
                <View className="w-[47%]">
                  <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Current Quantity</Text>
                  <TextInput
                    placeholder="e.g. 10.5"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                    style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                    className="border rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </View>
                <View className="w-[47%]">
                  <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Unit</Text>
                  <TextInput
                    placeholder="e.g. kg, liters, pcs"
                    placeholderTextColor={theme.textSecondary}
                    value={unit}
                    onChangeText={setUnit}
                    style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                    className="border rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </View>
              </View>

              {/* Alert Min Stock */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Min Warning Level (Alert Stock)</Text>
                <TextInput
                  placeholder="e.g. 5"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  value={minStock}
                  onChangeText={setMinStock}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none"
                />
              </View>

              {/* Kitchen Selector */}
              <View className="mb-6">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Assign to Kitchen</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {outlets.map(outlet => {
                    const isSelected = itemOutletId === outlet.id;
                    return (
                      <Pressable
                        key={outlet.id}
                        onPress={() => setItemOutletId(outlet.id)}
                        style={{
                          backgroundColor: isSelected ? 'rgba(255, 126, 64, 0.1)' : theme.background,
                          borderColor: isSelected ? 'rgba(255, 126, 64, 0.3)' : theme.backgroundSelected
                        }}
                        className="flex-row items-center px-4 py-2.5 rounded-xl mr-2 border"
                      >
                        <Image source={{ uri: outlet.image }} className="w-5 h-5 rounded-full mr-2" />
                        <Text className={`text-xs font-semibold ${isSelected ? 'text-orange-400' : 'text-gray-400'}`} style={{ color: isSelected ? undefined : theme.textSecondary }}>
                          {outlet.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Save Button */}
              <Pressable
                onPress={handleSaveItem}
                disabled={!name || !quantity || !unit || !minStock || !itemOutletId}
                className={`py-3.5 rounded-xl flex-row justify-center items-center ${
                  (!name || !quantity || !unit || !minStock || !itemOutletId) ? 'bg-gray-400' : 'bg-orange-500'
                }`}
              >
                <Text className="text-white text-sm font-bold">
                  {editingItem ? 'Save Changes' : 'Register Ingredient'}
                </Text>
              </Pressable>
              <View className="h-10" />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
