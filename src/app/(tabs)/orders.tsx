import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../hooks/use-theme';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Check, 
  X, 
  MessageSquare,
  Package,
  Calendar
} from 'lucide-react-native';

type TabType = 'Pending' | 'Preparing' | 'Ready' | 'History';

export default function OrdersScreen() {
  const { orders, activeOutletId, updateOrderStatus } = useStore();
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState<TabType>('Pending');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeOutletId && order.outletId !== activeOutletId) return false;
    if (activeTab === 'History') return order.status === 'Delivered' || order.status === 'Cancelled';
    return order.status === activeTab;
  });

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  const getElapsedTime = (isoString: string) => {
    const elapsedMins = Math.floor((now - new Date(isoString).getTime()) / 60000);
    if (elapsedMins < 1) return 'Just now';
    if (elapsedMins < 60) return `${elapsedMins}m ago`;
    const hours = Math.floor(elapsedMins / 60);
    return `${hours}h ${elapsedMins % 60}m ago`;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
      case 'Preparing': return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      case 'Ready': return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'Delivered': return { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
      case 'Cancelled': return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
      default: return { text: 'text-gray-300', bg: 'bg-gray-700/10', border: 'border-gray-700/20' };
    }
  };

  const formatCurrency = (val: number) =>
    `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const tabs: TabType[] = ['Pending', 'Preparing', 'Ready', 'History'];

  const tabColors: Record<TabType, string> = {
    Pending: 'bg-orange-500',
    Preparing: 'bg-blue-500',
    Ready: 'bg-emerald-500',
    History: 'bg-gray-600',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} className="px-5" edges={['top']}>
      <View className="pt-2 mb-5">
        <Text style={{ color: theme.text }} className="text-3xl font-extrabold tracking-tight">Orders Feed</Text>
        <Text style={{ color: theme.textSecondary }} className="text-sm mt-1">Manage incoming orders in real-time</Text>
      </View>

      {/* Tabs */}
      <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row border rounded-2xl p-1 mb-5">
        {tabs.map(tab => {
          const count = orders.filter(o => {
            if (activeOutletId && o.outletId !== activeOutletId) return false;
            if (tab === 'History') return o.status === 'Delivered' || o.status === 'Cancelled';
            return o.status === tab;
          }).length;

          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => { setActiveTab(tab); setExpandedOrderId(null); }}
              className={`flex-1 py-3 rounded-xl justify-center items-center flex-row ${isActive ? tabColors[tab] : ''}`}
            >
              <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-400'}`} style={{ color: isActive ? '#FFFFFF' : theme.textSecondary }}>{tab}</Text>
              {count > 0 && (
                <View className={`ml-1.5 px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-500/20'}`}>
                  <Text className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-gray-400'}`} style={{ color: isActive ? '#FFFFFF' : theme.text }}>{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Orders List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
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
            <Package size={44} color={theme.textSecondary} />
            <Text style={{ color: theme.text }} className="font-extrabold text-base mt-4">No {activeTab} orders</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs text-center mt-1.5 font-medium leading-5">
              Orders assigned to your kitchens will appear here.
            </Text>
          </View>
        ) : (
          filteredOrders.map((order, idx) => {
            const isExpanded = expandedOrderId === order.id;
            const statusStyle = getStatusStyle(order.status);
            return (
              <Animated.View
                entering={FadeInDown.delay(idx * 50).duration(400).springify()}
                layout={Layout.springify().duration(350)}
                key={order.id}
                style={{ 
                  backgroundColor: theme.backgroundElement, 
                  borderColor: isExpanded ? 'rgba(255, 115, 68, 0.4)' : theme.backgroundSelected,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                  shadowRadius: 12,
                  elevation: 2
                }}
                className="border rounded-3xl mb-4 overflow-hidden"
              >
                {/* Card summary */}
                <Pressable
                  onPress={() => toggleExpand(order.id)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}
                  className="p-5 flex-row justify-between items-center"
                >
                  <View className="flex-1 mr-2">
                    <View className="flex-row items-center">
                      <Text style={{ color: theme.text }} className="font-extrabold text-sm">{order.id}</Text>
                      <Text style={{ color: theme.textSecondary }} className="text-xs mx-2">•</Text>
                      <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold flex-1" numberOfLines={1}>
                        {order.outletName}
                      </Text>
                    </View>
                    <Text style={{ color: theme.text }} className="text-sm mt-2 font-bold" numberOfLines={1}>
                      {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                    </Text>
                    <View className="flex-row items-center mt-2.5">
                      <Clock size={11} color={theme.textSecondary} />
                      <Text style={{ color: theme.textSecondary }} className="text-xs ml-1.5 font-semibold">{getElapsedTime(order.createdAt)}</Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text style={{ color: theme.text }} className="font-black text-base">{formatCurrency(order.totalAmount)}</Text>
                    <View className={`mt-2.5 px-2.5 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}>
                      <Text className={`text-[9px] font-extrabold ${statusStyle.text}`}>
                        {order.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </Pressable>

                {/* Expanded details */}
                {isExpanded && (
                  <Animated.View entering={FadeIn.duration(200)} style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected }} className="border-t p-5">
                    {/* Customer */}
                    <View className="mb-4">
                      <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider mb-2">
                        Customer & Delivery
                      </Text>
                      <Text style={{ color: theme.text }} className="font-extrabold text-sm">{order.customerName}</Text>
                      <View className="flex-row items-center mt-2">
                        <Phone size={12} color={theme.textSecondary} />
                        <Text style={{ color: theme.textSecondary }} className="text-xs ml-2 font-semibold">{order.customerPhone}</Text>
                      </View>
                      {order.deliveryAddress && (
                        <View className="flex-row items-center mt-1.5">
                          <MapPin size={12} color={theme.textSecondary} />
                          <Text style={{ color: theme.textSecondary }} className="text-xs ml-2 font-semibold flex-1" numberOfLines={2}>
                            {order.deliveryAddress}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Items */}
                    <View className="mb-4">
                      <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider mb-2.5">
                        Order Items
                      </Text>
                      {order.items.map((item, idx) => (
                        <View key={idx} className="flex-row justify-between items-center mb-2">
                          <Text style={{ color: theme.text }} className="text-sm flex-1 font-semibold">
                            <Text className="text-orange-500 font-extrabold">{item.quantity}×</Text>  {item.name}
                          </Text>
                          <Text style={{ color: theme.text }} className="text-sm font-bold">
                            {formatCurrency(item.price * item.quantity)}
                          </Text>
                        </View>
                      ))}
                      <View style={{ borderColor: theme.backgroundSelected }} className="flex-row justify-between items-center border-t pt-2.5 mt-1.5">
                        <Text style={{ color: theme.textSecondary }} className="text-xs font-bold">Total</Text>
                        <Text className="text-orange-500 font-black text-base">
                          {formatCurrency(order.totalAmount)}
                        </Text>
                      </View>
                    </View>

                    {/* Notes */}
                    {order.notes && (
                      <View className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 mb-4 flex-row items-start">
                        <MessageSquare size={13} color="#FF6B35" className="mt-0.5" />
                        <View className="flex-1 ml-2.5">
                          <Text className="text-orange-500 text-[9px] font-bold uppercase tracking-wider">Customer Note</Text>
                          <Text style={{ color: theme.text }} className="text-xs font-semibold mt-1">{order.notes}</Text>
                        </View>
                      </View>
                    )}

                    {/* Action Buttons */}
                    <View className="flex-row gap-2.5">
                      {order.status === 'Pending' && (
                        <>
                          <Pressable
                            onPress={() => updateOrderStatus(order.id, 'Cancelled')}
                            className="flex-1 bg-red-500/10 border border-red-500/20 py-3.5 rounded-2xl flex-row justify-center items-center"
                          >
                            <X size={15} color="#EF4444" />
                            <Text className="text-red-500 font-extrabold text-sm ml-1.5">Decline</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => updateOrderStatus(order.id, 'Preparing')}
                            className="flex-[2] bg-emerald-500 py-3.5 rounded-2xl flex-row justify-center items-center"
                          >
                            <Check size={15} color="#FFFFFF" />
                            <Text className="text-white font-extrabold text-sm ml-1.5">Accept & Cook</Text>
                          </Pressable>
                        </>
                      )}

                      {order.status === 'Preparing' && (
                        <Pressable
                           onPress={() => updateOrderStatus(order.id, 'Ready')}
                           className="flex-1 bg-blue-500 py-3.5 rounded-2xl flex-row justify-center items-center"
                        >
                          <Check size={15} color="#FFFFFF" />
                          <Text className="text-white font-extrabold text-sm ml-1.5">Mark Ready</Text>
                        </Pressable>
                      )}

                      {order.status === 'Ready' && (
                        <Pressable
                          onPress={() => updateOrderStatus(order.id, 'Delivered')}
                          className="flex-1 bg-emerald-500 py-3.5 rounded-2xl flex-row justify-center items-center"
                        >
                          <Check size={15} color="#FFFFFF" />
                          <Text className="text-white font-extrabold text-sm ml-1.5">Mark Delivered</Text>
                        </Pressable>
                      )}

                      {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                        <View style={{ backgroundColor: theme.backgroundSelected, borderColor: theme.backgroundSelected }} className="flex-1 flex-row items-center justify-center py-3.5 border rounded-2xl">
                          <Calendar size={13} color={theme.textSecondary} />
                          <Text style={{ color: theme.textSecondary }} className="text-xs font-bold ml-1.5">
                            Archived · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Animated.View>
                )}
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
