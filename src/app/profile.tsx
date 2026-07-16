import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../hooks/use-theme';
import { Link, router } from 'expo-router';
import {
  ArrowLeft,
  User as UserIcon,
  ShieldCheck,
  Save,
  Edit2,
  Phone,
  Mail,
  Store,
  Star,
  Info,
  ChefHat,
  ChevronRight,
  Package,
  Ticket,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, updateProfile, orders, outlets, logout } = useStore();
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [email, setEmail] = useState(user?.email || '');
  const [restaurantName, setRestaurantName] = useState(user?.restaurantName || '');

  const handleSave = () => {
    updateProfile({ name, mobile, email, restaurantName });
    setIsEditing(false);
  };

  const totalDelivered = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOutlets = outlets.filter(o => o.status === 'Open').length;

  const formatCurrency = (val: number) =>
    `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const getInitials = (n: string) =>
    n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      {/* Header */}
      <View style={{ borderColor: theme.backgroundSelected }} className="flex-row items-center px-5 py-3.5 border-b mb-5">
        <Pressable 
          onPress={() => router.back()}
          style={{ backgroundColor: theme.backgroundSelected }}
          className="rounded-full p-2.5 mr-3.5"
        >
          <ArrowLeft size={16} color={theme.text} />
        </Pressable>
        <View>
          <Text style={{ color: theme.text }} className="text-lg font-extrabold">My Profile</Text>
          <Text style={{ color: theme.textSecondary }} className="text-xs">Manage your seller account details</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
        {/* ── Profile Card ── */}
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
          className="border rounded-3xl p-5 mb-5 items-center"
        >
          {/* Avatar */}
          <View className="w-20 h-20 rounded-full bg-orange-500/10 border-2 border-orange-500/20 items-center justify-center mb-3">
            <Text className="text-orange-500 font-extrabold text-2xl">{getInitials(user?.name || 'FK')}</Text>
          </View>

          <Text style={{ color: theme.text }} className="text-xl font-extrabold">{user?.name}</Text>
          <View className="flex-row items-center mt-1.5">
            <ShieldCheck size={14} color="#10B981" />
            <Text className="text-emerald-500 text-xs font-semibold ml-1">
              Verified Seller · {user?.identityType}
            </Text>
          </View>
          <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-1 font-bold uppercase tracking-wider">
            ID: {user?.identityNo}
          </Text>
        </Animated.View>

        {/* ── Stats Row ── */}
        <Animated.View entering={FadeInDown.delay(100).duration(450).springify()} className="flex-row justify-between mb-5 gap-3">
          <View 
            style={{ 
              backgroundColor: theme.backgroundElement, 
              borderColor: theme.backgroundSelected,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.background === '#F8FAFC' ? 0.02 : 0.1,
              shadowRadius: 8,
              elevation: 1
            }} 
            className="flex-1 border rounded-3xl p-4 items-center"
          >
            <Text className="text-orange-500 text-xl font-extrabold">{totalDelivered}</Text>
            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold mt-1 uppercase tracking-wider">Orders Done</Text>
          </View>
          <View 
            style={{ 
              backgroundColor: theme.backgroundElement, 
              borderColor: theme.backgroundSelected,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.background === '#F8FAFC' ? 0.02 : 0.1,
              shadowRadius: 8,
              elevation: 1
            }} 
            className="flex-1 border rounded-3xl p-4 items-center"
          >
            <Text className="text-emerald-500 text-xl font-extrabold">{activeOutlets}</Text>
            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold mt-1 uppercase tracking-wider">Live Kitchens</Text>
          </View>
          <View 
            style={{ 
              backgroundColor: theme.backgroundElement, 
              borderColor: theme.backgroundSelected,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.background === '#F8FAFC' ? 0.02 : 0.1,
              shadowRadius: 8,
              elevation: 1
            }} 
            className="flex-1 border rounded-3xl p-4 items-center"
          >
            <Text className="text-blue-500 text-base font-extrabold" numberOfLines={1}>{formatCurrency(totalRevenue)}</Text>
            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold mt-1.5 uppercase tracking-wider">Total Revenue</Text>
          </View>
        </Animated.View>

        {/* ── App Navigation Links ── */}
        <Animated.View 
          entering={FadeInDown.delay(150).duration(450).springify()}
          style={{ 
            backgroundColor: theme.backgroundElement, 
            borderColor: theme.backgroundSelected,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
            shadowRadius: 12,
            elevation: 2
          }} 
          className="border rounded-3xl p-2.5 mb-5"
        >
          <Link href="/inventory" asChild>
            <Pressable className="flex-row items-center justify-between p-3.5 rounded-2xl">
              <View className="flex-row items-center">
                <View className="bg-yellow-500/10 p-2 rounded-xl mr-3">
                  <Package size={16} color="#EAB308" />
                </View>
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">Inventory Manager</Text>
              </View>
              <ChevronRight size={16} color={theme.textSecondary} />
            </Pressable>
          </Link>

          <Link href="/coupons" asChild>
            <Pressable className="flex-row items-center justify-between p-3.5 rounded-2xl border-t" style={{ borderColor: theme.backgroundSelected }}>
              <View className="flex-row items-center">
                <View className="bg-purple-500/10 p-2 rounded-xl mr-3">
                  <Ticket size={16} color="#A855F7" />
                </View>
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">Coupons & Promos</Text>
              </View>
              <ChevronRight size={16} color={theme.textSecondary} />
            </Pressable>
          </Link>

          <Link href="/payments" asChild>
            <Pressable className="flex-row items-center justify-between p-3.5 rounded-2xl border-t" style={{ borderColor: theme.backgroundSelected }}>
              <View className="flex-row items-center">
                <View className="bg-blue-500/10 p-2 rounded-xl mr-3">
                  <CreditCard size={16} color="#3B82F6" />
                </View>
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">Payments & Earnings</Text>
              </View>
              <ChevronRight size={16} color={theme.textSecondary} />
            </Pressable>
          </Link>

          <Link href="/settings" asChild>
            <Pressable className="flex-row items-center justify-between p-3.5 rounded-2xl border-t" style={{ borderColor: theme.backgroundSelected }}>
              <View className="flex-row items-center">
                <View className="bg-gray-500/10 p-2 rounded-xl mr-3">
                  <Settings size={16} color={theme.textSecondary} />
                </View>
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">App Settings</Text>
              </View>
              <ChevronRight size={16} color={theme.textSecondary} />
            </Pressable>
          </Link>
        </Animated.View>

        {/* ── Foodies App Link Card ── */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(450).springify()}
          style={{ 
            backgroundColor: theme.backgroundElement, 
            borderColor: 'rgba(255, 126, 64, 0.2)',
            shadowColor: '#FF7E40',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 2
          }} 
          className="border rounded-3xl p-5 mb-5"
        >
          <View className="flex-row items-center mb-3">
            <View className="bg-orange-500 w-9 h-9 rounded-xl items-center justify-center mr-3">
              <ChefHat size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ color: theme.text }} className="font-extrabold text-sm">Linked to Foodies App</Text>
              <Text className="text-orange-500 text-[10px] font-bold uppercase tracking-wide">foodies.app · Partner Account</Text>
            </View>
          </View>
          <Text style={{ color: theme.textSecondary }} className="text-xs leading-5">
            Your menu and orders are synced with the Foodies customer app. Customers discover your kitchen through the Foodies marketplace.
          </Text>
          <View className="flex-row items-center mt-4 gap-3">
            <View className="flex-row items-center">
              <Star size={12} color="#EAB308" fill="#EAB308" />
              <Text style={{ color: theme.textSecondary }} className="text-xs font-bold ml-1">4.8 Rating</Text>
            </View>
            <View className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <Text className="text-emerald-500 text-[9px] font-bold">● LIVE</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Editable Details ── */}
        <Animated.View 
          entering={FadeInDown.delay(250).duration(450).springify()}
          style={{ 
            backgroundColor: theme.backgroundElement, 
            borderColor: theme.backgroundSelected,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
            shadowRadius: 12,
            elevation: 2
          }} 
          className="border rounded-3xl p-5 mb-5"
        >
          <View style={{ borderColor: theme.backgroundSelected }} className="flex-row justify-between items-center mb-4 pb-3 border-b">
            <Text style={{ color: theme.text }} className="font-extrabold text-sm">Account Details</Text>
            {!isEditing ? (
              <Pressable onPress={() => setIsEditing(true)} className="flex-row items-center bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl">
                <Edit2 size={12} color="#FF7E40" />
                <Text className="text-orange-500 text-xs font-bold ml-1.5">Edit</Text>
              </Pressable>
            ) : (
              <Pressable onPress={handleSave} className="flex-row items-center bg-orange-500 px-3 py-1.5 rounded-xl">
                <Save size={12} color="#FFFFFF" />
                <Text className="text-white text-xs font-bold ml-1.5">Save</Text>
              </Pressable>
            )}
          </View>

          <View className="gap-4">
            {/* Name */}
            <View>
              <View className="flex-row items-center mb-1.5">
                <UserIcon size={13} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold ml-1.5">Full Name</Text>
              </View>
              {isEditing ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  placeholderTextColor={theme.textSecondary}
                  className="border rounded-xl px-3 py-2.5 text-sm outline-none font-semibold w-full"
                />
              ) : (
                <Text style={{ color: theme.text }} className="text-sm font-bold pl-1">{user?.name}</Text>
              )}
            </View>

            {/* Phone */}
            <View>
              <View className="flex-row items-center mb-1.5">
                <Phone size={13} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold ml-1.5">Mobile</Text>
              </View>
              {isEditing ? (
                <TextInput
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  placeholderTextColor={theme.textSecondary}
                  className="border rounded-xl px-3 py-2.5 text-sm outline-none font-semibold w-full"
                />
              ) : (
                <Text style={{ color: theme.text }} className="text-sm font-bold pl-1">{user?.mobile}</Text>
              )}
            </View>

            {/* Email */}
            <View>
              <View className="flex-row items-center mb-1.5">
                <Mail size={13} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold ml-1.5">Email</Text>
              </View>
              {isEditing ? (
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  placeholderTextColor={theme.textSecondary}
                  className="border rounded-xl px-3 py-2.5 text-sm outline-none font-semibold w-full"
                />
              ) : (
                <Text style={{ color: theme.text }} className="text-sm font-bold pl-1">{user?.email}</Text>
              )}
            </View>

            {/* Kitchen Name */}
            <View>
              <View className="flex-row items-center mb-1.5">
                <Store size={13} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold ml-1.5">Kitchen Name</Text>
              </View>
              {isEditing ? (
                <TextInput
                  value={restaurantName}
                  onChangeText={setRestaurantName}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  placeholderTextColor={theme.textSecondary}
                  className="border rounded-xl px-3 py-2.5 text-sm outline-none font-semibold w-full"
                />
              ) : (
                <Text style={{ color: theme.text }} className="text-sm font-bold pl-1">{user?.restaurantName}</Text>
              )}
            </View>
          </View>
        </Animated.View>

        {/* ── App Info ── */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(450).springify()}
          style={{ 
            backgroundColor: theme.backgroundElement, 
            borderColor: theme.backgroundSelected,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
            shadowRadius: 12,
            elevation: 2
          }} 
          className="border rounded-3xl p-4.5 mb-5 flex-row items-center"
        >
          <Info size={16} color={theme.textSecondary} />
          <View className="ml-3 flex-1">
            <Text style={{ color: theme.text }} className="text-sm font-extrabold">Foodies Partner Manager</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs mt-0.5">Version 1.0.0 · Stable Stack Screen</Text>
          </View>
          <View className="bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg">
            <Text className="text-orange-500 text-[10px] font-bold">STABLE</Text>
          </View>
        </Animated.View>

        {/* ── Logout Button ── */}
        <Animated.View entering={FadeInDown.delay(350).duration(450).springify()}>
          <Pressable
            onPress={() => { logout(); router.replace('/'); }}
            className="bg-red-500/10 border border-red-500/20 py-4 rounded-3xl flex-row items-center justify-center mb-10"
          >
            <LogOut size={16} color="#EF4444" className="mr-2" />
            <Text className="text-red-500 font-extrabold text-sm">Disconnect / Log Out</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
