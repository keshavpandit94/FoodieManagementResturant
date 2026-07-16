import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../hooks/use-theme';
import { 
  IndianRupee,
  ShoppingBag, 
  Clock, 
  UtensilsCrossed,
  ChevronDown, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Package,
  Bike,
  CreditCard,
  Ticket,
  Bell,
  Flame,
} from 'lucide-react-native';
import { Link } from 'expo-router';

export default function DashboardScreen() {
  const { 
    outlets, 
    orders, 
    activeOutletId, 
    setActiveOutletId, 
    getAnalytics, 
    toggleOutletStatus,
    inventory,
    deliveryPartners,
    coupons,
    user,
  } = useStore();

  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const analytics = getAnalytics();
  const currentOutlet = outlets.find(o => o.id === activeOutletId);

  const activeOrders = orders
    .filter(o => !activeOutletId || o.outletId === activeOutletId)
    .filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled')
    .slice(0, 4);

  const lowStockCount = inventory.filter(
    i => (!activeOutletId || i.outletId === activeOutletId) && i.quantity <= i.minStock
  ).length;

  const activeRidersCount = deliveryPartners.filter(p => p.status === 'Active').length;
  const activeCouponsCount = coupons.filter(c => c.isActive).length;
  const pendingOrdersCount = orders.filter(o => 
    (!activeOutletId || o.outletId === activeOutletId) && o.status === 'Pending'
  ).length;

  const formatCurrency = (val: number) =>
    `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} className="px-5" edges={['top']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false} className="mt-2">
        
        {/* ── Header ── */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-1 mr-2">
            <Text style={{ color: theme.textSecondary }} className="text-xs font-bold uppercase tracking-wider">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Chef'} 👋
            </Text>
            <Text style={{ color: theme.text }} className="text-2xl font-black mt-0.5">Foodies Manager</Text>
          </View>

          <View className="flex-row items-center gap-2.5">
            {/* Outlet Selector */}
            <View className="relative">
              <Pressable
                onPress={() => setShowPicker(!showPicker)}
                style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }}
                className="flex-row items-center border rounded-full px-3.5 py-2.5"
              >
                <Flame size={13} color="#FF6B35" />
                <Text style={{ color: theme.text }} className="text-xs font-extrabold max-w-[80] mx-1.5" numberOfLines={1}>
                  {currentOutlet ? currentOutlet.name.split(' ')[0] : 'All'}
                </Text>
                <ChevronDown size={11} color={theme.textSecondary} />
              </Pressable>

              {showPicker && (
                <View 
                  style={{ 
                    backgroundColor: theme.backgroundElement, 
                    borderColor: theme.backgroundSelected,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.25,
                    shadowRadius: 20,
                    elevation: 10
                  }} 
                  className="absolute right-0 top-13 border rounded-2xl w-60 z-50 p-2"
                >
                  <Pressable
                    onPress={() => { setActiveOutletId(null); setShowPicker(false); }}
                    className={`flex-row items-center p-3 rounded-xl mb-1 ${!activeOutletId ? 'bg-orange-500/10' : ''}`}
                  >
                    <UtensilsCrossed size={15} color={!activeOutletId ? '#FF6B35' : theme.textSecondary} />
                    <Text className={`ml-2.5 font-bold text-sm ${!activeOutletId ? 'text-orange-500' : 'text-gray-300'}`} style={{ color: !activeOutletId ? undefined : theme.text }}>
                      All Kitchens
                    </Text>
                  </Pressable>
                  {outlets.map(outlet => (
                    <Pressable
                      key={outlet.id}
                      onPress={() => { setActiveOutletId(outlet.id); setShowPicker(false); }}
                      className={`flex-row items-center p-3 rounded-xl mb-1 ${activeOutletId === outlet.id ? 'bg-orange-500/10' : ''}`}
                    >
                      <Image source={{ uri: outlet.image }} className="w-7 h-7 rounded-lg mr-2.5" />
                      <View className="flex-1">
                        <Text className={`font-bold text-sm ${activeOutletId === outlet.id ? 'text-orange-500' : ''}`} style={{ color: activeOutletId === outlet.id ? undefined : theme.text }} numberOfLines={1}>
                          {outlet.name}
                        </Text>
                      </View>
                      <View className={`w-2 h-2 rounded-full ${outlet.status === 'Open' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Notifications */}
            <View className="relative">
              <Pressable style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="border rounded-full p-2.5">
                <Bell size={16} color={theme.textSecondary} />
              </Pressable>
              {pendingOrdersCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-orange-500 w-4.5 h-4.5 rounded-full items-center justify-center border-2 border-white" style={{ borderColor: theme.background }}>
                  <Text className="text-white text-[8px] font-black">{pendingOrdersCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ── Active Kitchen Banner ── */}
        {currentOutlet && (
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
            className="flex-row items-center justify-between border rounded-3xl p-5 mb-6"
          >
            <View className="flex-row items-center flex-1 mr-3">
              <Image source={{ uri: currentOutlet.image }} className="w-12 h-12 rounded-xl mr-3.5" />
              <View className="flex-1">
                <Text style={{ color: theme.text }} className="text-base font-extrabold" numberOfLines={1}>{currentOutlet.name}</Text>
                <View className="flex-row items-center mt-1">
                  <MapPin size={11} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary }} className="text-xs ml-1 flex-1" numberOfLines={1}>{currentOutlet.address}</Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className={`text-[10px] font-black mb-2 ${currentOutlet.status === 'Open' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {currentOutlet.status === 'Open' ? '🟢 ONLINE' : '🔴 OFFLINE'}
              </Text>
              <Pressable
                onPress={() => toggleOutletStatus(currentOutlet.id)}
                className={`w-11 h-6 rounded-full p-0.5 justify-center ${currentOutlet.status === 'Open' ? 'bg-emerald-500 items-end' : 'bg-gray-400 items-start'}`}
              >
                <View className="w-5 h-5 rounded-full bg-white shadow-sm" />
              </Pressable>
            </View>
          </View>
        )}

        {/* ── Analytics Grid ── */}
        <View className="flex-row flex-wrap justify-between mb-6 gap-y-4">
          {/* Today's Revenue */}
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
            className="w-[48%] border rounded-3xl p-5"
          >
            <View className="bg-orange-500/10 w-10 h-10 rounded-2xl justify-center items-center mb-4 border border-orange-500/10">
              <IndianRupee size={18} color={theme.primary} />
            </View>
            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider">{"Today's Sales"}</Text>
            <Text style={{ color: theme.text }} className="text-xl font-extrabold mt-1" numberOfLines={1}>
              {formatCurrency(analytics.todaySales)}
            </Text>
            <View className="flex-row items-center mt-2.5">
              <TrendingUp size={11} color="#10B981" />
              <Text className="text-emerald-500 text-[10px] ml-1 font-bold">+8.4% today</Text>
            </View>
          </Animated.View>

          {/* Active Orders */}
          <Animated.View 
            entering={FadeInDown.delay(100).duration(450).springify()}
            style={{ 
              backgroundColor: theme.backgroundElement, 
              borderColor: theme.backgroundSelected,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
              shadowRadius: 12,
              elevation: 2
            }} 
            className="w-[48%] border rounded-3xl p-5"
          >
            <View className="bg-blue-500/10 w-10 h-10 rounded-2xl justify-center items-center mb-4 border border-blue-500/10">
              <ShoppingBag size={18} color="#3B82F6" />
            </View>
            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider">Active Orders</Text>
            <Text style={{ color: theme.text }} className="text-xl font-extrabold mt-1">{analytics.activeOrdersCount}</Text>
            <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-2.5 font-semibold">In kitchen / rider</Text>
          </Animated.View>

          {/* Avg Prep Time */}
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
            className="w-[48%] border rounded-3xl p-5"
          >
            <View className="bg-purple-500/10 w-10 h-10 rounded-2xl justify-center items-center mb-4 border border-purple-500/10">
              <Clock size={18} color="#A855F7" />
            </View>
            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider">Avg Prep Time</Text>
            <Text style={{ color: theme.text }} className="text-xl font-extrabold mt-1">{analytics.averagePrepTime} min</Text>
            <Text className="text-emerald-500 text-[10px] mt-2.5 font-bold">Optimal speed</Text>
          </Animated.View>

          {/* Open Kitchens */}
          <Animated.View 
            entering={FadeInDown.delay(200).duration(450).springify()}
            style={{ 
              backgroundColor: theme.backgroundElement, 
              borderColor: theme.backgroundSelected,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
              shadowRadius: 12,
              elevation: 2
            }} 
            className="w-[48%] border rounded-3xl p-5"
          >
            <View className="bg-emerald-500/10 w-10 h-10 rounded-2xl justify-center items-center mb-4 border border-emerald-500/10">
              <Flame size={18} color="#10B981" />
            </View>
            <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider">Open Kitchens</Text>
            <Text style={{ color: theme.text }} className="text-xl font-extrabold mt-1">
              {analytics.activeKitchensCount}{' '}
              <Text style={{ color: theme.textSecondary }} className="text-sm font-semibold">/ {outlets.length}</Text>
            </Text>
            <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-2.5 font-semibold">Active kitchens</Text>
          </Animated.View>
        </View>

        {/* ── Quick Actions Grid ── */}
        <Text style={{ color: theme.text }} className="text-base font-extrabold mb-3.5 ml-1">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between mb-6 gap-y-4">
          <Animated.View entering={FadeInDown.delay(250).duration(450).springify()} className="w-[48%]">
            <Link href="/inventory" asChild>
              <Pressable 
                style={{ 
                  backgroundColor: theme.backgroundElement, 
                  borderColor: theme.backgroundSelected,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                  shadowRadius: 12,
                  elevation: 2
                }} 
                className="w-full border rounded-3xl p-4.5 flex-row items-center"
              >
                <View className="bg-yellow-500/10 w-10 h-10 rounded-2xl justify-center items-center mr-3 border border-yellow-500/10">
                  <Package size={17} color="#EAB308" />
                </View>
                <View className="flex-1">
                  <Text style={{ color: theme.text }} className="font-extrabold text-sm">Inventory</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-0.5 font-bold" numberOfLines={1}>
                    {lowStockCount > 0 ? `⚠️ ${lowStockCount} low` : '✅ Stable'}
                  </Text>
                </View>
              </Pressable>
            </Link>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(450).springify()} className="w-[48%]">
            <Link href="/delivery" asChild>
              <Pressable 
                style={{ 
                  backgroundColor: theme.backgroundElement, 
                  borderColor: theme.backgroundSelected,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                  shadowRadius: 12,
                  elevation: 2
                }} 
                className="w-full border rounded-3xl p-4.5 flex-row items-center"
              >
                <View className="bg-emerald-500/10 w-10 h-10 rounded-2xl justify-center items-center mr-3 border border-emerald-500/10">
                  <Bike size={17} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text style={{ color: theme.text }} className="font-extrabold text-sm">Riders</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-0.5 font-bold" numberOfLines={1}>
                    {activeRidersCount} Active
                  </Text>
                </View>
              </Pressable>
            </Link>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(350).duration(450).springify()} className="w-[48%]">
            <Link href="/payments" asChild>
              <Pressable 
                style={{ 
                  backgroundColor: theme.backgroundElement, 
                  borderColor: theme.backgroundSelected,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                  shadowRadius: 12,
                  elevation: 2
                }} 
                className="w-full border rounded-3xl p-4.5 flex-row items-center"
              >
                <View className="bg-blue-500/10 w-10 h-10 rounded-2xl justify-center items-center mr-3 border border-blue-500/10">
                  <CreditCard size={17} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text style={{ color: theme.text }} className="font-extrabold text-sm">Payments</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-0.5 font-bold" numberOfLines={1}>Ledger Logs</Text>
                </View>
              </Pressable>
            </Link>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(450).springify()} className="w-[48%]">
            <Link href="/coupons" asChild>
              <Pressable 
                style={{ 
                  backgroundColor: theme.backgroundElement, 
                  borderColor: theme.backgroundSelected,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                  shadowRadius: 12,
                  elevation: 2
                }} 
                className="w-full border rounded-3xl p-4.5 flex-row items-center"
              >
                <View className="bg-purple-500/10 w-10 h-10 rounded-2xl justify-center items-center mr-3 border border-purple-500/10">
                  <Ticket size={17} color="#A855F7" />
                </View>
                <View className="flex-1">
                  <Text style={{ color: theme.text }} className="font-extrabold text-sm">Coupons</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-0.5 font-bold" numberOfLines={1}>
                    {activeCouponsCount} Active
                  </Text>
                </View>
              </Pressable>
            </Link>
          </Animated.View>
        </View>

        {/* ── Live Orders ── */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3.5 ml-1">
            <Text style={{ color: theme.text }} className="text-base font-extrabold">Live Orders</Text>
            <Link href="/orders" asChild>
              <Pressable className="flex-row items-center">
                <Text className="text-orange-500 text-xs font-bold mr-1">View All</Text>
                <ArrowRight size={12} color="#FF6B35" />
              </Pressable>
            </Link>
          </View>

          {activeOrders.length === 0 ? (
            <Animated.View 
              entering={FadeInDown.delay(450).duration(450).springify()}
              style={{ 
                backgroundColor: theme.backgroundElement, 
                borderColor: theme.backgroundSelected,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                shadowRadius: 12,
                elevation: 2
              }} 
              className="border rounded-3xl p-8 items-center justify-center"
            >
              <CheckCircle2 size={36} color="#10B981" />
              <Text style={{ color: theme.text }} className="font-extrabold text-base mt-3">All caught up!</Text>
              <Text style={{ color: theme.textSecondary }} className="text-xs text-center mt-1 font-semibold">
                No active orders at the moment.
              </Text>
            </Animated.View>
          ) : (
            activeOrders.map((order, idx) => (
              <Animated.View 
                entering={FadeInDown.delay(450 + idx * 80).duration(450).springify()} 
                key={order.id}
              >
                <Link href={`/order-detail/${order.id}`} asChild>
                  <Pressable 
                    style={({ pressed }) => [
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.backgroundSelected,
                        opacity: pressed ? 0.95 : 1,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                        shadowRadius: 12,
                        elevation: 2
                      }
                    ]} 
                    className="border rounded-3xl p-5 mb-4"
                  >
                    <View style={{ borderColor: theme.backgroundSelected }} className="flex-row justify-between items-center border-b pb-3 mb-3">
                      <View>
                        <Text style={{ color: theme.text }} className="font-extrabold text-sm">{order.id}</Text>
                        <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mt-0.5">{order.outletName}</Text>
                      </View>
                      <View className={`px-2.5 py-1 rounded-full ${
                        order.status === 'Pending' ? 'bg-orange-500/10' :
                        order.status === 'Preparing' ? 'bg-blue-500/10' : 'bg-emerald-500/10'
                      }`}>
                        <Text className={`text-[10px] font-extrabold ${
                          order.status === 'Pending' ? 'text-orange-500' :
                          order.status === 'Preparing' ? 'text-blue-500' : 'text-emerald-500'
                        }`}>
                          {order.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View className="mb-3">
                      {order.items.map((item, idx) => (
                        <Text key={idx} style={{ color: theme.text }} className="text-sm font-semibold mb-0.5">
                          <Text className="font-extrabold text-orange-500">{item.quantity}×</Text> {item.name}
                        </Text>
                      ))}
                    </View>

                    <View className="flex-row justify-between items-center pt-1.5">
                      <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <Text style={{ color: theme.text }} className="font-black text-base">{formatCurrency(order.totalAmount)}</Text>
                    </View>
                  </Pressable>
                </Link>
              </Animated.View>
            ))
          )}
        </View>

        {/* ── Outlet Operations ── */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-3.5 ml-1">
            <Text style={{ color: theme.text }} className="text-base font-extrabold">My Kitchens</Text>
            <Link href="/outlets" asChild>
              <Pressable className="flex-row items-center">
                <Text className="text-orange-500 text-xs font-bold mr-1">Manage</Text>
                <ArrowRight size={12} color="#FF6B35" />
              </Pressable>
            </Link>
          </View>
          {outlets.map((outlet, idx) => (
            <Animated.View 
              entering={FadeInDown.delay(550 + idx * 80).duration(450).springify()}
              key={outlet.id} 
              style={{ 
                backgroundColor: theme.backgroundElement, 
                borderColor: theme.backgroundSelected,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                shadowRadius: 12,
                elevation: 2
              }} 
              className="border rounded-3xl p-4.5 mb-4 flex-row justify-between items-center"
            >
              <View className="flex-row items-center flex-1 mr-3">
                <Image source={{ uri: outlet.image }} className="w-12 h-12 rounded-xl mr-3.5" />
                <View className="flex-1">
                  <Text style={{ color: theme.text }} className="font-extrabold text-sm" numberOfLines={1}>{outlet.name}</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-xs mt-1 font-semibold">
                    {outlet.type === 'CloudKitchen' ? '☁️ Cloud Kitchen' : '🏠 Home Kitchen'}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => toggleOutletStatus(outlet.id)}
                className={`px-3 py-2 rounded-xl border ${
                  outlet.status === 'Open'
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-rose-500/10 border-rose-500/20'
                }`}
              >
                <Text className={`text-xs font-black ${outlet.status === 'Open' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {outlet.status === 'Open' ? 'OPEN' : 'CLOSED'}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
