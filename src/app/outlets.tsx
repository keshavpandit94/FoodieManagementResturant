import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, Modal, Alert } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../hooks/use-theme';
import { OutletType } from '../types';
import { router } from 'expo-router';
import { Plus, X, Phone, MapPin, Star, Building2, Flame, IndianRupee, ShoppingBag, Check, ArrowLeft } from 'lucide-react-native';

export default function OutletsScreen() {
  const { 
    outlets, 
    orders, 
    activeOutletId, 
    setActiveOutletId, 
    toggleOutletStatus, 
    addOutlet 
  } = useStore();

  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  // Form fields
  const [outletName, setOutletName] = useState('');
  const [outletAddress, setOutletAddress] = useState('');
  const [outletPhone, setOutletPhone] = useState('');
  const [outletImage, setOutletImage] = useState('');
  const [outletType, setOutletType] = useState<OutletType>('Restaurant');

  const handleOpenModal = () => {
    setOutletName('');
    setOutletAddress('');
    setOutletPhone('');
    setOutletType('Restaurant');
    setOutletImage('https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&auto=format&fit=crop&q=60'); // default mock restaurant image
    setModalVisible(true);
  };

  const handleAddOutlet = () => {
    const normalizedPhone = outletPhone.replace(/\s+/g, '');

    if (!outletName.trim() || !outletAddress.trim() || !/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
      Alert.alert('Invalid outlet', 'Enter an outlet name, address, and valid phone number.');
      return;
    }

    addOutlet({
      name: outletName.trim(),
      address: outletAddress.trim(),
      phone: normalizedPhone,
      image: outletImage || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&auto=format&fit=crop&q=60',
      type: outletType,
      status: 'Open',
    });

    setModalVisible(false);
  };

  // Helper stats for outlet card
  const getOutletStats = (outletId: string) => {
    const outletOrders = orders.filter(o => o.outletId === outletId);
    
    // Revenue (Delivered)
    const revenue = outletOrders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Active Orders (Pending, Preparing, Ready)
    const active = outletOrders.filter(
      o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready'
    ).length;

    return { revenue, active };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} className="px-5" edges={['top']}>
      {/* Header */}
      <View className="pt-2 mb-5 flex-row justify-between items-center">
        <View className="flex-row items-center flex-1 mr-2">
          <Pressable 
            onPress={() => router.back()}
            style={{ backgroundColor: theme.backgroundSelected }}
            className="rounded-full p-2.5 mr-3.5"
          >
            <ArrowLeft size={16} color={theme.text} />
          </Pressable>
          <View className="flex-1">
            <Text style={{ color: theme.text }} className="text-xl font-extrabold">My Kitchens</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs mt-0.5" numberOfLines={1}>Manage home kitchens & brands</Text>
          </View>
        </View>
        <Pressable
          onPress={handleOpenModal}
          className="bg-orange-500 rounded-full px-4 py-2.5 flex-row items-center"
        >
          <Plus size={15} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold ml-1">Add Kitchen</Text>
        </Pressable>
      </View>

      {/* Grid List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {outlets.map((outlet, idx) => {
          const stats = getOutletStats(outlet.id);
          const isSelected = activeOutletId === outlet.id;

          return (
            <Animated.View 
              entering={FadeInDown.delay(idx * 70).duration(450).springify()}
              layout={Layout.springify()}
              key={outlet.id}
              style={{
                backgroundColor: theme.backgroundElement,
                borderColor: isSelected ? theme.primary : theme.backgroundSelected,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                shadowRadius: 12,
                elevation: 2
              }}
              className="border rounded-3xl mb-5 overflow-hidden relative"
            >
              {/* Image banner */}
              <View className="relative h-32 w-full">
                <Image source={{ uri: outlet.image }} className="h-full w-full object-cover" />
                <View className="absolute inset-0 bg-black/40" />
                
                {/* Type Badge */}
                <View className="absolute left-4 top-4 bg-[#0A0B10]/80 border border-gray-800 rounded-full px-3 py-1 flex-row items-center">
                  {outlet.type === 'CloudKitchen' ? (
                    <Flame size={12} color="#FF6B35" />
                  ) : (
                    <Building2 size={12} color="#3B82F6" />
                  )}
                  <Text className={`text-[10px] font-extrabold ml-1 ${
                    outlet.type === 'CloudKitchen' ? 'text-orange-400' : 'text-blue-400'
                  }`}>
                    {outlet.type === 'CloudKitchen' ? 'CLOUD KITCHEN' : 'HOME KITCHEN'}
                  </Text>
                </View>

                {/* Status Toggle on banner */}
                <View className="absolute right-4 top-4 bg-[#0A0B10]/85 px-3 py-1 rounded-full border border-gray-800 flex-row items-center">
                  <View className={`w-2 h-2 rounded-full mr-2 ${outlet.status === 'Open' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <Text className={`text-[10px] font-extrabold ${outlet.status === 'Open' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {outlet.status.toUpperCase()}
                  </Text>
                </View>

                {/* Rating Badge */}
                <View className="absolute right-4 bottom-4 bg-[#0A0B10]/80 border border-gray-800 rounded-full px-2.5 py-0.5 flex-row items-center">
                  <Star size={11} color="#EAB308" className="mr-1" />
                  <Text className="text-yellow-400 text-[10px] font-black">{outlet.rating.toFixed(1)}</Text>
                </View>
              </View>

              {/* Outlet details */}
              <View className="p-5">
                <Text style={{ color: theme.text }} className="font-extrabold text-lg">{outlet.name}</Text>
                
                <View className="flex-row items-center mt-2.5">
                  <MapPin size={13} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary }} className="text-xs ml-1.5 flex-1 font-semibold" numberOfLines={1}>
                    {outlet.address}
                  </Text>
                </View>

                <View className="flex-row items-center mt-2 mb-4">
                  <Phone size={13} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary }} className="text-xs ml-1.5 font-semibold">{outlet.phone}</Text>
                </View>

                {/* Outlets Performance Indicators */}
                <View style={{ borderColor: theme.backgroundSelected }} className="flex-row justify-between border-t pt-4 mb-4">
                  <View className="w-[45%] flex-row items-center">
                    <View className="bg-orange-500/10 w-9 h-9 rounded-xl items-center justify-center mr-2.5 border border-orange-500/10">
                      <IndianRupee size={16} color={theme.primary} />
                    </View>
                    <View>
                      <Text style={{ color: theme.textSecondary }} className="text-[9px] font-bold uppercase tracking-wider">Revenue</Text>
                      <Text style={{ color: theme.text }} className="text-sm font-extrabold">₹{stats.revenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</Text>
                    </View>
                  </View>

                  <View className="w-[45%] flex-row items-center">
                    <View className="bg-blue-500/10 w-9 h-9 rounded-xl items-center justify-center mr-2.5 border border-blue-500/10">
                      <ShoppingBag size={16} color="#3B82F6" />
                    </View>
                    <View>
                      <Text style={{ color: theme.textSecondary }} className="text-[9px] font-bold uppercase tracking-wider">Active</Text>
                      <Text style={{ color: theme.text }} className="text-sm font-extrabold">{stats.active} Orders</Text>
                    </View>
                  </View>
                </View>

                {/* Active Controls */}
                <View className="flex-row gap-2.5 mt-1">
                  <Pressable
                    onPress={() => toggleOutletStatus(outlet.id)}
                    className={`flex-1 py-3.5 border rounded-2xl flex-row items-center justify-center ${
                      outlet.status === 'Open'
                        ? 'bg-rose-500/5 border-rose-500/20'
                        : 'bg-emerald-500/5 border-emerald-500/20'
                    }`}
                  >
                    <Text className={`font-extrabold text-xs ${
                      outlet.status === 'Open' ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {outlet.status === 'Open' ? '🔴 Close Kitchen' : '🟢 Open Kitchen'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setActiveOutletId(isSelected ? null : outlet.id);
                    }}
                    style={{ backgroundColor: isSelected ? theme.primary : theme.backgroundSelected, borderColor: theme.backgroundSelected }}
                    className="px-5 py-3.5 rounded-2xl border flex-row items-center justify-center"
                  >
                    {isSelected && <Check size={14} color="#FFFFFF" />}
                    <Text className={`font-extrabold text-xs ml-1 ${isSelected ? 'text-white' : 'text-gray-400'}`} style={{ color: isSelected ? '#FFFFFF' : theme.text }}>
                      {isSelected ? '✓ Active' : 'Focus'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Add Kitchen Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/75 justify-end">
          <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="rounded-t-3xl border-t p-6 h-[80%]">
            <View style={{ borderColor: theme.backgroundSelected }} className="flex-row justify-between items-center border-b pb-4 mb-5">
              <Text style={{ color: theme.text }} className="text-xl font-bold">Register New Kitchen</Text>
              <Pressable onPress={() => setModalVisible(false)} style={{ backgroundColor: theme.backgroundSelected }} className="rounded-full p-1.5">
                <X size={18} color={theme.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {/* Brand/Outlet Name */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-gray-400 text-xs font-semibold mb-2">Kitchen Name</Text>
                <TextInput
                  placeholder="e.g. Priya's Home Kitchen"
                  placeholderTextColor={theme.textSecondary}
                  value={outletName}
                  onChangeText={setOutletName}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none"
                />
              </View>

              {/* Outlet Type Selection */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-gray-400 text-xs font-semibold mb-2">Operation Model</Text>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setOutletType('Restaurant')}
                    style={{
                      backgroundColor: outletType === 'Restaurant' ? 'rgba(59, 130, 246, 0.1)' : theme.background,
                      borderColor: outletType === 'Restaurant' ? 'rgba(59, 130, 246, 0.3)' : theme.backgroundSelected
                    }}
                    className="flex-1 py-3 rounded-xl border flex-row items-center justify-center"
                  >
                    <Building2 size={15} color={outletType === 'Restaurant' ? '#3B82F6' : '#9CA3AF'} className="mr-2" />
                    <Text className={`text-xs font-bold ${outletType === 'Restaurant' ? 'text-blue-400' : 'text-gray-400'}`} style={{ color: outletType === 'Restaurant' ? undefined : theme.textSecondary }}>
                      Restaurant
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setOutletType('CloudKitchen')}
                    style={{
                      backgroundColor: outletType === 'CloudKitchen' ? 'rgba(255, 126, 64, 0.1)' : theme.background,
                      borderColor: outletType === 'CloudKitchen' ? 'rgba(255, 126, 64, 0.3)' : theme.backgroundSelected
                    }}
                    className="flex-1 py-3 rounded-xl border flex-row items-center justify-center"
                  >
                    <Flame size={15} color={outletType === 'CloudKitchen' ? '#FF7E40' : '#9CA3AF'} className="mr-2" />
                    <Text className={`text-xs font-bold ${outletType === 'CloudKitchen' ? 'text-orange-400' : 'text-gray-400'}`} style={{ color: outletType === 'CloudKitchen' ? undefined : theme.textSecondary }}>
                      Cloud Kitchen
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Address */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-gray-400 text-xs font-semibold mb-2">Kitchen Address</Text>
                <TextInput
                  placeholder="e.g. 12 Lajpat Nagar, New Delhi"
                  placeholderTextColor={theme.textSecondary}
                  value={outletAddress}
                  onChangeText={setOutletAddress}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none"
                />
              </View>

              {/* Phone */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-gray-400 text-xs font-semibold mb-2">Contact Number</Text>
                <TextInput
                  placeholder="e.g. +91 98765 43210"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="phone-pad"
                  value={outletPhone}
                  onChangeText={setOutletPhone}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none"
                />
              </View>

              {/* Banner Image URL */}
              <View className="mb-6">
                <Text style={{ color: theme.textSecondary }} className="text-gray-400 text-xs font-semibold mb-2">Cover Image URL</Text>
                <TextInput
                  placeholder="https://..."
                  placeholderTextColor={theme.textSecondary}
                  value={outletImage}
                  onChangeText={setOutletImage}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none"
                />
              </View>

              {/* Register Button */}
              <Pressable
                onPress={handleAddOutlet}
                disabled={!outletName || !outletAddress || !outletPhone}
                className={`py-3.5 rounded-xl flex-row justify-center items-center ${
                  (!outletName || !outletAddress || !outletPhone) ? 'bg-gray-400' : 'bg-orange-500'
                }`}
              >
                <Text className="text-white text-sm font-bold">Register Kitchen</Text>
              </Pressable>
              
              <View className="h-10" />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
