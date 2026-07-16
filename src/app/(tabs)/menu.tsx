import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, Modal, Alert } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../hooks/use-theme';
import { MenuItem } from '../../types';
import { Plus, Edit2, Trash2, X, Search, Clock, Eye, EyeOff, LayoutGrid } from 'lucide-react-native';

type CategoryFilter = 'All' | 'Tiffin' | 'Lunch Box' | 'Mains' | 'Snacks' | 'Sweets' | 'Beverages';

export default function MenuScreen() {
  const {
    menuItems,
    outlets,
    activeOutletId,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = useStore();

  const theme = useTheme();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form fields
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState<CategoryFilter>('Mains');
  const [itemOutletId, setItemOutletId] = useState('');
  const [itemPrepTime, setItemPrepTime] = useState('15');
  const [itemImage, setItemImage] = useState('');

  const categories: CategoryFilter[] = ['All', 'Tiffin', 'Lunch Box', 'Mains', 'Snacks', 'Sweets', 'Beverages'];

  const filteredItems = menuItems.filter(item => {
    if (activeOutletId && item.outletId !== activeOutletId) return false;
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleOpenModal = (item: MenuItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.name);
      setItemDescription(item.description);
      setItemPrice(item.price.toString());
      setItemCategory(item.category as CategoryFilter);
      setItemOutletId(item.outletId);
      setItemPrepTime(item.prepTime.toString());
      setItemImage(item.image);
    } else {
      setEditingItem(null);
      setItemName('');
      setItemDescription('');
      setItemPrice('');
      setItemCategory('Mains');
      setItemOutletId(activeOutletId || (outlets.length > 0 ? outlets[0].id : ''));
      setItemPrepTime('15');
      setItemImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60');
    }
    setModalVisible(true);
  };

  const handleSaveItem = () => {
    const price = Number(itemPrice);
    const prepTime = Number(itemPrepTime);
    if (!itemName.trim() || !itemOutletId || !Number.isFinite(price) || price <= 0 || !Number.isInteger(prepTime) || prepTime <= 0) {
      Alert.alert('Invalid item', 'Enter a name, outlet, positive price (₹), and preparation time.');
      return;
    }
    const itemData = {
      name: itemName.trim(),
      description: itemDescription.trim(),
      price,
      category: itemCategory,
      outletId: itemOutletId,
      prepTime,
      image: itemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
      isAvailable: editingItem ? editingItem.isAvailable : true,
    };
    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
    } else {
      addMenuItem(itemData);
    }
    setModalVisible(false);
  };

  const getOutletName = (id: string) => outlets.find(o => o.id === id)?.name || 'Unknown';

  const formatCurrency = (val: number) =>
    `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} className="px-5" edges={['top']}>
      {/* Header */}
      <View className="pt-2 mb-5 flex-row justify-between items-center">
        <View className="flex-1 mr-2">
          <Text style={{ color: theme.text }} className="text-3xl font-extrabold tracking-tight">Menu Catalog</Text>
          <Text style={{ color: theme.textSecondary }} className="text-sm mt-1">Manage your home-cooked dishes</Text>
        </View>
        <Pressable
          onPress={() => handleOpenModal(null)}
          className="bg-orange-500 rounded-full px-4 py-2.5 flex-row items-center"
        >
          <Plus size={15} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold ml-1">Add Dish</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row items-center border rounded-2xl px-4 py-3 mb-5">
        <Search size={17} color={theme.textSecondary} />
        <TextInput
          placeholder="Search dishes, ingredients..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ color: theme.text }}
          className="flex-1 text-sm py-1 ml-2 bg-transparent outline-none font-semibold"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <X size={15} color={theme.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* Category Chips */}
      <View className="mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={{
                  backgroundColor: isActive ? 'rgba(255, 94, 54, 0.1)' : theme.backgroundElement,
                  borderColor: isActive ? 'rgba(255, 94, 54, 0.3)' : theme.backgroundSelected
                }}
                className="px-4.5 py-2.5 rounded-full mr-2.5 border"
              >
                <Text className="text-xs font-extrabold" style={{ color: isActive ? '#FF5E36' : theme.textSecondary }}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Item List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 ? (
          <Animated.View 
            entering={FadeInDown.delay(50).duration(450).springify()}
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
            <LayoutGrid size={44} color={theme.textSecondary} />
            <Text style={{ color: theme.text }} className="font-extrabold text-base mt-4">No dishes found</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs text-center mt-1.5 font-medium leading-5">
              Try a different filter or add a new dish.
            </Text>
          </Animated.View>
        ) : (
          filteredItems.map((item, idx) => (
            <Animated.View
              entering={FadeInDown.delay(idx * 50).duration(400).springify()}
              layout={Layout.springify()}
              key={item.id}
            >
              <View
                style={{ 
                  backgroundColor: theme.backgroundElement, 
                  borderColor: theme.backgroundSelected,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                  shadowRadius: 12,
                  elevation: 2,
                  opacity: !item.isAvailable ? 0.6 : 1
                }}
                className="border rounded-3xl p-4.5 mb-4 flex-row"
              >
                <Image source={{ uri: item.image }} className="w-20 h-20 rounded-2xl mr-4" />
                <View className="flex-1 justify-between py-0.5">
                  <View>
                    <View className="flex-row justify-between items-start">
                      <Text style={{ color: theme.text }} className="font-extrabold text-base flex-1 mr-1.5" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-orange-500 font-extrabold text-base">
                        {formatCurrency(item.price)}
                      </Text>
                    </View>
                    <Text style={{ color: theme.textSecondary }} className="text-xs mt-1 font-semibold leading-4" numberOfLines={2}>{item.description}</Text>
                  </View>

                  <View className="flex-row justify-between items-center mt-3.5">
                    <View className="flex-row items-center">
                      <Clock size={11} color={theme.textSecondary} />
                      <Text style={{ color: theme.textSecondary }} className="text-[10px] ml-1 font-bold">{item.prepTime} min</Text>
                      {!activeOutletId && (
                        <>
                          <Text style={{ color: theme.textSecondary }} className="text-[10px] mx-1.5 font-bold">•</Text>
                          <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold" numberOfLines={1}>
                            {getOutletName(item.outletId)}
                          </Text>
                        </>
                      )}
                    </View>

                    <View className="flex-row items-center gap-2.5">
                      <Pressable
                        onPress={() => updateMenuItem(item.id, { isAvailable: !item.isAvailable })}
                        style={{ backgroundColor: theme.backgroundSelected }}
                        className="p-2 rounded-xl"
                      >
                        {item.isAvailable
                          ? <Eye size={14} color="#10B981" />
                          : <EyeOff size={14} color="#EF4444" />
                        }
                      </Pressable>
                      <Pressable 
                        onPress={() => handleOpenModal(item)} 
                        style={{ backgroundColor: theme.backgroundSelected }}
                        className="p-2 rounded-xl"
                      >
                        <Edit2 size={14} color={theme.primary} />
                      </Pressable>
                      <Pressable 
                        onPress={() => deleteMenuItem(item.id)} 
                        style={{ backgroundColor: theme.backgroundSelected }}
                        className="p-2 rounded-xl"
                      >
                        <Trash2 size={14} color="#EF4444" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))
        )}
        <View className="h-10" />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/75 justify-end">
          <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="rounded-t-3xl border-t p-6 h-[88%]">
            <View style={{ borderColor: theme.backgroundSelected }} className="flex-row justify-between items-center border-b pb-4 mb-5">
              <Text style={{ color: theme.text }} className="text-xl font-bold">
                {editingItem ? 'Edit Dish' : 'Add New Dish'}
              </Text>
              <Pressable onPress={() => setModalVisible(false)} style={{ backgroundColor: theme.backgroundSelected }} className="rounded-full p-1.5">
                <X size={18} color={theme.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {/* Name */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Dish Name</Text>
                <TextInput
                  placeholder="e.g. Butter Chicken Thali"
                  placeholderTextColor={theme.textSecondary}
                  value={itemName}
                  onChangeText={setItemName}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none"
                />
              </View>

              {/* Price & Prep Time */}
              <View className="flex-row justify-between mb-4">
                <View className="w-[47%]">
                  <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Price (₹)</Text>
                  <TextInput
                    placeholder="120"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={itemPrice}
                    onChangeText={setItemPrice}
                    style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                    className="border rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </View>
                <View className="w-[47%]">
                  <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Prep Time (mins)</Text>
                  <TextInput
                    placeholder="15"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={itemPrepTime}
                    onChangeText={setItemPrepTime}
                    style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                    className="border rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </View>
              </View>

              {/* Category */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Category</Text>
                <View className="flex-row flex-wrap gap-2">
                  {categories.filter(c => c !== 'All').map(cat => {
                    const isSelected = itemCategory === cat;
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setItemCategory(cat)}
                        style={{
                          backgroundColor: isSelected ? 'rgba(255, 126, 64, 0.1)' : theme.background,
                          borderColor: isSelected ? 'rgba(255, 126, 64, 0.3)' : theme.backgroundSelected
                        }}
                        className="px-4 py-2.5 rounded-xl border"
                      >
                        <Text className={`text-xs font-semibold ${isSelected ? 'text-orange-400' : 'text-gray-400'}`} style={{ color: isSelected ? undefined : theme.textSecondary }}>
                          {cat}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Outlet Selector */}
              <View className="mb-4">
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

              {/* Description */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Description</Text>
                <TextInput
                  placeholder="Describe ingredients, cooking style, serving..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={3}
                  value={itemDescription}
                  onChangeText={setItemDescription}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none h-20"
                />
              </View>

              {/* Image URL */}
              <View className="mb-6">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Image URL</Text>
                <TextInput
                  placeholder="https://images.unsplash.com/..."
                  placeholderTextColor={theme.textSecondary}
                  value={itemImage}
                  onChangeText={setItemImage}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none"
                />
              </View>

              {/* Submit */}
              <Pressable
                onPress={handleSaveItem}
                disabled={!itemName || !itemPrice || !itemOutletId}
                className={`py-3.5 rounded-xl flex-row justify-center items-center ${
                  (!itemName || !itemPrice || !itemOutletId) ? 'bg-gray-400' : 'bg-orange-500'
                }`}
              >
                <Text className="text-white text-sm font-bold">
                  {editingItem ? 'Save Changes' : 'Add to Menu'}
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
