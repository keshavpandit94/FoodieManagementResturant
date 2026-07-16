import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Switch } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../hooks/use-theme';
import {
  ShieldCheck,
  Package,
  Ticket,
  CreditCard,
  Settings,
  Store,
  ChevronRight,
  Clock,
  LogOut,
  Info,
  Edit2,
  Save
} from 'lucide-react-native';

export default function MoreScreen() {
  const { user, outlets, toggleOutletStatus, updateOutletTiming, updateProfile, inventory, logout } = useStore();
  const theme = useTheme();
  const router = useRouter();

  // Find the primary outlet (matching user's restaurant)
  const primaryOutlet = outlets.find(o => o.name === user?.restaurantName) || outlets[0];
  const outletStatus = primaryOutlet ? primaryOutlet.status : 'Closed';
  const currentTiming = primaryOutlet?.timing || user?.timing || '09:00 AM - 10:00 PM';

  const [isEditingTiming, setIsEditingTiming] = useState(false);
  const [timingVal, setTimingVal] = useState(currentTiming);

  const handleSaveTiming = () => {
    if (primaryOutlet) {
      updateOutletTiming(primaryOutlet.id, timingVal);
    }
    updateProfile({ timing: timingVal });
    setIsEditingTiming(false);
  };

  const getInitials = (n: string) =>
    n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  // Count low stock items
  const lowStockCount = inventory.filter(i => i.quantity <= i.minStock).length;

  const handleToggleStatus = () => {
    if (primaryOutlet) {
      toggleOutletStatus(primaryOutlet.id);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} className="px-5" edges={['top']}>
      {/* Header */}
      <View className="pt-2 mb-6">
        <Text style={{ color: theme.text }} className="text-3xl font-extrabold tracking-tight">More Options</Text>
        <Text style={{ color: theme.textSecondary }} className="text-sm mt-1">Configure your seller account & operations</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card Widget */}
        <Animated.View entering={FadeInDown.delay(50).duration(450).springify()}>
          <Pressable 
            onPress={() => router.push('/profile')}
            style={({ pressed }) => [
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
                opacity: pressed ? 0.92 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: theme.background === '#F8FAFC' ? 0.04 : 0.2,
                shadowRadius: 16,
                elevation: 4
              }
            ]}
            className="border rounded-3xl p-5 mb-5 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 items-center justify-center mr-4">
                <Text className="text-orange-500 font-extrabold text-lg">{getInitials(user?.name || 'Chef')}</Text>
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.text }} className="text-base font-extrabold">{user?.name}</Text>
                <View className="flex-row items-center mt-1">
                  <ShieldCheck size={13} color="#10B981" />
                  <Text className="text-emerald-500 text-xs font-semibold ml-1">
                    Verified · {user?.outletType}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-xl">
              <Text className="text-orange-500 text-xs font-bold">Edit</Text>
              <ChevronRight size={14} color="#FF7E40" />
            </View>
          </Pressable>
        </Animated.View>

        {/* Operating status & Timing Controls Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(450).springify()}>
          <View 
            style={{ 
              backgroundColor: theme.backgroundElement, 
              borderColor: theme.backgroundSelected,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: theme.background === '#F8FAFC' ? 0.04 : 0.2,
              shadowRadius: 16,
              elevation: 4
            }} 
            className="border rounded-3xl p-5 mb-5"
          >
            <Text style={{ color: theme.textSecondary }} className="text-[11px] font-extrabold tracking-wider uppercase mb-3">Kitchen Operating Status</Text>
            
            {/* Open/Close Toggle */}
            <View className="flex-row items-center justify-between pb-4 border-b" style={{ borderColor: theme.backgroundSelected }}>
              <View className="flex-1 mr-3">
                <Text style={{ color: theme.text }} className="text-base font-extrabold">
                  {outletStatus === 'Open' ? 'Kitchen is Open' : 'Kitchen is Closed'}
                </Text>
                <Text style={{ color: theme.textSecondary }} className="text-xs mt-0.5">
                  {outletStatus === 'Open' ? 'Accepting customer orders online' : 'Offline. No incoming orders'}
                </Text>
              </View>
              <Switch
                value={outletStatus === 'Open'}
                onValueChange={handleToggleStatus}
                trackColor={{ false: '#94A3B8', true: '#FF7E40' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Operating Hours Editor */}
            <View className="flex-row items-center justify-between pt-4">
              <View className="flex-1 mr-3">
                <View className="flex-row items-center gap-1.5">
                  <Clock size={14} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary }} className="text-[11px] font-bold uppercase tracking-wider">Operating Hours</Text>
                </View>
                {isEditingTiming ? (
                  <TextInput
                    value={timingVal}
                    onChangeText={setTimingVal}
                    style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                    className="border rounded-xl px-3 py-1.5 text-xs font-semibold mt-2 outline-none w-full"
                    placeholder="e.g. 09:00 AM - 10:00 PM"
                    placeholderTextColor={theme.textSecondary}
                  />
                ) : (
                  <Text style={{ color: theme.text }} className="text-sm font-bold mt-1.5">{currentTiming}</Text>
                )}
              </View>
              {isEditingTiming ? (
                <Pressable onPress={handleSaveTiming} className="bg-orange-500 px-3.5 py-2 rounded-xl flex-row items-center gap-1">
                  <Save size={13} color="#FFFFFF" />
                  <Text className="text-white text-xs font-bold">Save</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => setIsEditingTiming(true)} className="bg-orange-500/10 px-3.5 py-2 rounded-xl flex-row items-center gap-1">
                  <Edit2 size={12} color="#FF7E40" />
                  <Text className="text-orange-500 text-xs font-bold">Edit</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Navigation Section */}
        <Text style={{ color: theme.textSecondary }} className="text-[11px] font-extrabold tracking-wider uppercase mb-3 ml-1">Tools & Settings</Text>
        
        <Animated.View entering={FadeInDown.delay(150).duration(450).springify()}>
          <View 
            style={{ 
              backgroundColor: theme.backgroundElement, 
              borderColor: theme.backgroundSelected,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: theme.background === '#F8FAFC' ? 0.04 : 0.2,
              shadowRadius: 16,
              elevation: 4
            }} 
            className="border rounded-3xl p-2 mb-5"
          >
            {/* Inventory Manager */}
            <Link href="/inventory" asChild>
              <Pressable className="flex-row items-center justify-between p-4 rounded-2xl">
                <View className="flex-row items-center">
                  <View className="bg-amber-500/10 p-2.5 rounded-xl mr-3.5">
                    <Package size={18} color="#D97706" />
                  </View>
                  <View>
                    <Text style={{ color: theme.text }} className="font-extrabold text-sm">Inventory Manager</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-[11px] mt-0.5">Track raw ingredients & stock</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-1.5">
                  {lowStockCount > 0 && (
                    <View className="bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Text className="text-amber-600 text-[10px] font-bold">{lowStockCount} Low</Text>
                    </View>
                  )}
                  <ChevronRight size={16} color={theme.textSecondary} />
                </View>
              </Pressable>
            </Link>

            {/* Coupons & Promos */}
            <Link href="/coupons" asChild>
              <Pressable className="flex-row items-center justify-between p-4 rounded-2xl border-t" style={{ borderColor: theme.backgroundSelected }}>
                <View className="flex-row items-center">
                  <View className="bg-purple-500/10 p-2.5 rounded-xl mr-3.5">
                    <Ticket size={18} color="#8B5CF6" />
                  </View>
                  <View>
                    <Text style={{ color: theme.text }} className="font-extrabold text-sm">Coupons & Promos</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-[11px] mt-0.5">Discounts & marketing offers</Text>
                  </View>
                </View>
                <ChevronRight size={16} color={theme.textSecondary} />
              </Pressable>
            </Link>

            {/* Payments & Earnings */}
            <Link href="/payments" asChild>
              <Pressable className="flex-row items-center justify-between p-4 rounded-2xl border-t" style={{ borderColor: theme.backgroundSelected }}>
                <View className="flex-row items-center">
                  <View className="bg-blue-500/10 p-2.5 rounded-xl mr-3.5">
                    <CreditCard size={18} color="#3B82F6" />
                  </View>
                  <View>
                    <Text style={{ color: theme.text }} className="font-extrabold text-sm">Payments & Earnings</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-[11px] mt-0.5">Payout history & ledger</Text>
                  </View>
                </View>
                <ChevronRight size={16} color={theme.textSecondary} />
              </Pressable>
            </Link>

            {/* My Kitchens / Outlets */}
            <Link href="/outlets" asChild>
              <Pressable className="flex-row items-center justify-between p-4 rounded-2xl border-t" style={{ borderColor: theme.backgroundSelected }}>
                <View className="flex-row items-center">
                  <View className="bg-emerald-500/10 p-2.5 rounded-xl mr-3.5">
                    <Store size={18} color="#10B981" />
                  </View>
                  <View>
                    <Text style={{ color: theme.text }} className="font-extrabold text-sm">My Kitchens</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-[11px] mt-0.5">Manage multiple branches & outlets</Text>
                  </View>
                </View>
                <ChevronRight size={16} color={theme.textSecondary} />
              </Pressable>
            </Link>

            {/* App Settings */}
            <Link href="/settings" asChild>
              <Pressable className="flex-row items-center justify-between p-4 rounded-2xl border-t" style={{ borderColor: theme.backgroundSelected }}>
                <View className="flex-row items-center">
                  <View className="bg-zinc-500/10 p-2.5 rounded-xl mr-3.5">
                    <Settings size={18} color={theme.textSecondary} />
                  </View>
                  <View>
                    <Text style={{ color: theme.text }} className="font-extrabold text-sm">App Settings</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-[11px] mt-0.5">Notifications, alert sounds, & security</Text>
                  </View>
                </View>
                <ChevronRight size={16} color={theme.textSecondary} />
              </Pressable>
            </Link>
          </View>
        </Animated.View>

        {/* Info Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(450).springify()}>
          <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="border rounded-3xl p-5 mb-5 flex-row items-center">
            <View className="bg-orange-500/10 p-2.5 rounded-xl mr-3.5">
              <Info size={16} color={theme.primary} />
            </View>
            <View className="flex-1">
              <Text style={{ color: theme.text }} className="text-sm font-extrabold">Foodies Partner Manager</Text>
              <Text style={{ color: theme.textSecondary }} className="text-xs mt-0.5">Version 1.0.0 · Premium Redesign Suite</Text>
            </View>
            <View className="bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              <Text className="text-emerald-500 text-[10px] font-bold">STABLE</Text>
            </View>
          </View>
        </Animated.View>

        {/* Disconnect Button */}
        <Animated.View entering={FadeInDown.delay(250).duration(450).springify()}>
          <Pressable
            onPress={() => { logout(); router.replace('/'); }}
            className="bg-red-500/10 border border-red-500/20 py-4.5 rounded-3xl flex-row items-center justify-center mb-10"
          >
            <LogOut size={16} color="#EF4444" className="mr-2" />
            <Text className="text-red-500 font-extrabold text-sm">Log Out / Disconnect</Text>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}
