import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../hooks/use-theme';
import { Coupon } from '../types';
import { ArrowLeft, Plus, Edit2, Trash2, X, Ticket, Calendar, Percent, IndianRupee } from 'lucide-react-native';

export default function CouponsScreen() {
  const router = useRouter();
  const { 
    coupons, 
    addCoupon, 
    updateCoupon, 
    deleteCoupon 
  } = useStore();

  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('150');
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const handleOpenModal = (coupon: Coupon | null = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCode(coupon.code);
      setDiscountType(coupon.discountType);
      setDiscountValue(coupon.discountValue.toString());
      setMinOrderAmount(coupon.minOrderAmount.toString());
      setStartDate(coupon.startDate);
      setEndDate(coupon.endDate);
    } else {
      setEditingCoupon(null);
      setCode('');
      setDiscountType('Percentage');
      setDiscountValue('');
      setMinOrderAmount('150');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('2026-12-31');
    }
    setModalVisible(true);
  };

  const handleSaveCoupon = () => {
    const normalizedCode = code.trim().toUpperCase();
    const parsedDiscountValue = Number(discountValue);
    const parsedMinOrderAmount = Number(minOrderAmount);

    if (!/^[A-Z0-9_-]+$/.test(normalizedCode) || isNaN(parsedDiscountValue) || parsedDiscountValue <= 0 || isNaN(parsedMinOrderAmount) || parsedMinOrderAmount < 0) {
      Alert.alert('Invalid fields', 'Fill all fields. Discount must be positive and Minimum Order must be non-negative.');
      return;
    }

    const couponData = {
      code: normalizedCode,
      discountType,
      discountValue: parsedDiscountValue,
      minOrderAmount: parsedMinOrderAmount,
      startDate,
      endDate,
      isActive: editingCoupon ? editingCoupon.isActive : true,
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, couponData);
    } else {
      addCoupon(couponData);
    }

    setModalVisible(false);
  };

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
            <Text style={{ color: theme.text }} className="text-lg font-extrabold">Coupons & Promos</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs">Configure discount campaigns</Text>
          </View>
        </View>

        <Pressable
          onPress={() => handleOpenModal(null)}
          className="bg-orange-500 rounded-full px-4 py-2.5 flex-row items-center"
        >
          <Plus size={14} color="#FFFFFF" className="mr-1.5" />
          <Text className="text-white text-xs font-bold">New Code</Text>
        </Pressable>
      </View>

      {/* Coupons List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false} className="px-5 mt-5">
        {coupons.length === 0 ? (
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
            <Ticket size={48} color={theme.textSecondary} className="mb-3" />
            <Text style={{ color: theme.text }} className="font-extrabold text-base">No active campaigns</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs text-center mt-1.5 font-semibold leading-5">
              Add discount codes to attract home kitchen customers.
            </Text>
          </View>
        ) : (
          coupons.map(coupon => {
            const isExpired = new Date(coupon.endDate) < new Date();
            const opacityClass = !coupon.isActive || isExpired ? 'opacity-60' : '';

            return (
              <View 
                key={coupon.id}
                style={{ 
                  backgroundColor: theme.backgroundElement, 
                  borderColor: theme.backgroundSelected,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                  shadowRadius: 12,
                  elevation: 2
                }}
                className={`border rounded-3xl p-5 mb-4 flex-row justify-between items-center ${opacityClass}`}
              >
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center">
                    <View className="bg-orange-500/10 border border-orange-500/25 px-3 py-1 rounded-xl mr-2.5">
                      <Text className="text-orange-500 font-black text-xs">{coupon.code}</Text>
                    </View>
                    {!coupon.isActive ? (
                      <View className="bg-gray-500/10 px-2 py-0.5 rounded-full">
                        <Text className="text-gray-400 text-[8px] font-black">PAUSED</Text>
                      </View>
                    ) : isExpired ? (
                      <View className="bg-red-500/10 px-2 py-0.5 rounded-full">
                        <Text className="text-red-500 text-[8px] font-black">EXPIRED</Text>
                      </View>
                    ) : (
                      <View className="bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Text className="text-emerald-500 text-[8px] font-black">ACTIVE</Text>
                      </View>
                    )}
                  </View>

                  <Text style={{ color: theme.text }} className="text-base font-extrabold mt-3.5">
                    {coupon.discountType === 'Percentage' 
                      ? `${coupon.discountValue}% OFF` 
                      : `₹${coupon.discountValue} Flat OFF`}
                  </Text>
                  
                  <Text style={{ color: theme.textSecondary }} className="text-xs mt-1.5 font-semibold">
                    Min Order: ₹{coupon.minOrderAmount}
                  </Text>

                  <View className="flex-row items-center mt-2.5">
                    <Calendar size={11} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary }} className="text-[10px] ml-1.5 font-bold">
                      Ends: {new Date(coupon.endDate).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}
                    </Text>
                  </View>
                </View>

                <View className="items-end justify-between h-full py-1">
                  <Switch
                    value={coupon.isActive}
                    onValueChange={(val) => updateCoupon(coupon.id, { isActive: val })}
                    trackColor={{ false: '#767577', true: '#FF6B35' }}
                    thumbColor={coupon.isActive ? '#FFFFFF' : '#f4f3f4'}
                  />

                  <View className="flex-row gap-2 mt-4.5">
                    <Pressable
                      onPress={() => handleOpenModal(coupon)}
                      style={{ backgroundColor: theme.backgroundSelected }}
                      className="p-2 rounded-xl"
                    >
                      <Edit2 size={13} color="#FF6B35" />
                    </Pressable>
                    <Pressable
                      onPress={() => deleteCoupon(coupon.id)}
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
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/75 justify-end">
          <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="rounded-t-3xl border-t p-6 h-[75%]">
            <View style={{ borderColor: theme.backgroundSelected }} className="flex-row justify-between items-center border-b pb-4 mb-5">
              <Text style={{ color: theme.text }} className="text-xl font-bold">
                {editingCoupon ? 'Edit Promo Campaign' : 'Create Promo Code'}
              </Text>
              <Pressable onPress={() => setModalVisible(false)} style={{ backgroundColor: theme.backgroundSelected }} className="rounded-full p-1.5">
                <X size={18} color={theme.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {/* Promo Code */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Coupon Code (Uppercase)</Text>
                <TextInput
                  placeholder="e.g. PRIYA50, HOMECOOK30"
                  placeholderTextColor={theme.textSecondary}
                  value={code}
                  onChangeText={setCode}
                  autoCapitalize="characters"
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none"
                />
              </View>

              {/* Discount Type */}
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Discount Type</Text>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setDiscountType('Percentage')}
                    style={{ 
                      backgroundColor: discountType === 'Percentage' ? 'rgba(255, 126, 64, 0.1)' : theme.background,
                      borderColor: discountType === 'Percentage' ? '#FF7E40' : theme.backgroundSelected
                    }}
                    className="flex-1 py-3 rounded-xl border flex-row items-center justify-center"
                  >
                    <Percent size={14} color={discountType === 'Percentage' ? '#FF7E40' : '#9CA3AF'} className="mr-1.5" />
                    <Text className={`text-xs font-bold ${discountType === 'Percentage' ? 'text-orange-400' : 'text-gray-400'}`} style={{ color: discountType === 'Percentage' ? undefined : theme.textSecondary }}>
                      Percentage (%)
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDiscountType('Fixed')}
                    style={{ 
                      backgroundColor: discountType === 'Fixed' ? 'rgba(255, 126, 64, 0.1)' : theme.background,
                      borderColor: discountType === 'Fixed' ? '#FF7E40' : theme.backgroundSelected
                    }}
                    className="flex-1 py-3 rounded-xl border flex-row items-center justify-center"
                  >
                    <IndianRupee size={14} color={discountType === 'Fixed' ? '#FF7E40' : '#9CA3AF'} className="mr-1.5" />
                    <Text className={`text-xs font-bold ${discountType === 'Fixed' ? 'text-orange-400' : 'text-gray-400'}`} style={{ color: discountType === 'Fixed' ? undefined : theme.textSecondary }}>
                      Fixed (₹)
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Value and Min Order */}
              <View className="flex-row justify-between mb-4">
                <View className="w-[47%]">
                  <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">
                    {discountType === 'Percentage' ? 'Discount (%)' : 'Discount Value (₹)'}
                  </Text>
                  <TextInput
                    placeholder={discountType === 'Percentage' ? '15' : '50'}
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={discountValue}
                    onChangeText={setDiscountValue}
                    style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                    className="border rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </View>
                <View className="w-[47%]">
                  <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Min Order (₹)</Text>
                  <TextInput
                    placeholder="150"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={minOrderAmount}
                    onChangeText={setMinOrderAmount}
                    style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                    className="border rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </View>
              </View>

              {/* End Date */}
              <View className="mb-6">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">End Validity Date (YYYY-MM-DD)</Text>
                <TextInput
                  placeholder="2026-12-31"
                  placeholderTextColor={theme.textSecondary}
                  value={endDate}
                  onChangeText={setEndDate}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none"
                />
              </View>

              {/* Save */}
              <Pressable
                onPress={handleSaveCoupon}
                disabled={!code || !discountValue || !minOrderAmount}
                className={`py-3.5 rounded-xl flex-row justify-center items-center ${
                  (!code || !discountValue || !minOrderAmount) ? 'bg-gray-400' : 'bg-orange-500'
                }`}
              >
                <Text className="text-white text-sm font-bold">
                  {editingCoupon ? 'Update Code' : 'Launch Code'}
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
