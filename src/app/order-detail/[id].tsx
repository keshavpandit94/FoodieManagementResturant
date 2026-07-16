import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../hooks/use-theme';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Check, 
  X, 
  ChevronRight,
  Calendar,
  Clock,
  IndianRupee,
  ShoppingBag,
  ChefHat
} from 'lucide-react-native';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { orders, updateOrderStatus, outlets } = useStore();
  const theme = useTheme();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} className="items-center justify-center p-6">
        <Text style={{ color: theme.text }} className="text-lg font-bold">Order Not Found</Text>
        <Text style={{ color: theme.textSecondary }} className="text-xs text-center mt-2 mb-6">
          The order ID you requested does not exist or has been removed.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-orange-500 rounded-full px-6 py-3"
        >
          <Text className="text-white font-bold text-sm">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const outlet = outlets.find(o => o.id === order.outletId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Preparing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Ready': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Delivered': return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
      case 'Cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-zinc-400 bg-zinc-700/10 border-zinc-700/20';
    }
  };

  const formatCurrency = (val: number) =>
    `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'bottom']}>
      {/* Header navbar */}
      <View style={{ borderColor: theme.backgroundSelected }} className="flex-row items-center justify-between px-5 py-3.5 border-b">
        <Pressable 
          onPress={() => router.back()}
          style={{ backgroundColor: theme.backgroundSelected }}
          className="rounded-full p-2.5"
        >
          <ArrowLeft size={16} color={theme.text} />
        </Pressable>
        <Text style={{ color: theme.text }} className="text-base font-extrabold">Order {order.id}</Text>
        <View className="w-10" /> {/* empty space for alignment */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 mt-4">
        {/* Status card banner */}
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
          className="border rounded-3xl p-5 mb-5 flex-row justify-between items-center"
        >
          <View>
            <Text style={{ color: theme.textSecondary }} className="text-xs font-bold uppercase tracking-wider">Live Order Status</Text>
            <Text style={{ color: theme.text }} className="font-extrabold text-xl mt-1">{order.status}</Text>
          </View>
          <View className={`px-3.5 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
            <Text className="text-xs font-bold uppercase tracking-wider">{order.status}</Text>
          </View>
        </Animated.View>

        {/* Horizontal Progress Timeline */}
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
          className="border rounded-3xl p-5 mb-5"
        >
          <Text style={{ color: theme.text }} className="font-extrabold text-xs uppercase tracking-wider mb-4 ml-1">Order Progress</Text>
          
          <View className="flex-row items-center justify-between px-1 pb-1">
            {/* Step 1: Received */}
            <View className="items-center flex-1">
              <View className={`w-4 h-4 rounded-full items-center justify-center ${
                order.status !== 'Cancelled' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}>
                <Check size={9} color="#FFFFFF" />
              </View>
              <Text style={{ color: theme.text }} className="text-[9px] font-extrabold mt-1.5">RECEIVED</Text>
            </View>

            <View className={`h-0.5 flex-1 -mt-4 ${
              order.status !== 'Pending' && order.status !== 'Cancelled' ? 'bg-orange-500' : 'bg-gray-300'
            }`} />

            {/* Step 2: Preparing */}
            <View className="items-center flex-1">
              <View className={`w-4 h-4 rounded-full items-center justify-center ${
                order.status === 'Preparing' || order.status === 'Ready' || order.status === 'Delivered'
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}>
                {(order.status === 'Preparing' || order.status === 'Ready' || order.status === 'Delivered') ? (
                  <Check size={9} color="#FFFFFF" />
                ) : (
                  <View className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </View>
              <Text style={{ color: theme.textSecondary }} className="text-[9px] font-bold mt-1.5">COOKING</Text>
            </View>

            <View className={`h-0.5 flex-1 -mt-4 ${
              order.status === 'Ready' || order.status === 'Delivered' ? 'bg-orange-500' : 'bg-gray-300'
            }`} />

            {/* Step 3: Dispatch */}
            <View className="items-center flex-1">
              <View className={`w-4 h-4 rounded-full items-center justify-center ${
                order.status === 'Ready' || order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-gray-300'
              }`}>
                {(order.status === 'Ready' || order.status === 'Delivered') ? (
                  <Check size={9} color="#FFFFFF" />
                ) : (
                  <View className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </View>
              <Text style={{ color: theme.textSecondary }} className="text-[9px] font-bold mt-1.5">DISPATCHED</Text>
            </View>
          </View>
        </Animated.View>

        {/* Outlet brand card */}
        {outlet && (
          <Animated.View 
            entering={FadeInDown.delay(120).duration(450).springify()}
            style={{ 
              backgroundColor: theme.backgroundElement, 
              borderColor: theme.backgroundSelected,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.background === '#F8FAFC' ? 0.02 : 0.1,
              shadowRadius: 8,
              elevation: 1
            }} 
            className="border rounded-3xl p-5 mb-5 flex-row items-center"
          >
            <Image source={{ uri: outlet.image }} className="w-12 h-12 rounded-xl mr-3.5" />
            <View className="flex-1">
              <Text style={{ color: theme.text }} className="font-extrabold text-sm">{outlet.name}</Text>
              <Text style={{ color: theme.textSecondary }} className="text-xs mt-0.5">{outlet.type === 'CloudKitchen' ? 'Cloud Kitchen' : 'Dine-in Branch'}</Text>
            </View>
            <ChevronRight size={16} color={theme.textSecondary} />
          </Animated.View>
        )}

        {/* Client details card */}
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
          className="border rounded-3xl p-5 mb-5"
        >
          <Text style={{ color: theme.text }} className="font-extrabold text-sm mb-4">Customer Details</Text>
          
          <View className="flex-row items-center mb-4">
            <View style={{ backgroundColor: theme.backgroundSelected }} className="w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Phone size={14} color={theme.primary} />
            </View>
            <View className="flex-1">
              <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider">Name & Contact</Text>
              <Text style={{ color: theme.text }} className="font-bold text-sm mt-0.5">
                {order.customerName} ({order.customerPhone})
              </Text>
            </View>
          </View>

          {order.deliveryAddress && (
            <View className="flex-row items-center">
              <View style={{ backgroundColor: theme.backgroundSelected }} className="w-8 h-8 rounded-lg items-center justify-center mr-3">
                <MapPin size={14} color={theme.primary} />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider">Delivery Address</Text>
                <Text style={{ color: theme.text }} className="text-xs mt-0.5 leading-5 font-semibold">
                  {order.deliveryAddress}
                </Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Receipt detailed card */}
        <Animated.View 
          entering={FadeInDown.delay(180).duration(450).springify()}
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
          <Text style={{ color: theme.text, borderColor: theme.backgroundSelected }} className="font-extrabold text-sm mb-4 border-b pb-2">
            Items Ordered
          </Text>
          
          {order.items.map((item, idx) => (
            <View key={idx} className="flex-row justify-between items-center mb-3.5">
              <View className="flex-1 pr-2">
                <Text style={{ color: theme.text }} className="font-bold text-sm">
                  <Text className="text-orange-500 font-extrabold">{item.quantity}x</Text>  {item.name}
                </Text>
                <Text style={{ color: theme.textSecondary }} className="text-xs mt-0.5">{formatCurrency(item.price)} each</Text>
              </View>
              <Text style={{ color: theme.text }} className="font-extrabold text-sm">
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          {/* Pricing detail breakdown */}
          <View style={{ borderColor: theme.backgroundSelected }} className="border-t pt-4 mt-2">
            <View className="flex-row justify-between mb-2">
              <Text style={{ color: theme.textSecondary }} className="text-xs">Subtotal</Text>
              <Text style={{ color: theme.text }} className="text-xs font-bold">{formatCurrency(order.totalAmount)}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text style={{ color: theme.textSecondary }} className="text-xs">Platform Fee</Text>
              <Text style={{ color: theme.text }} className="text-xs font-bold">₹0.00</Text>
            </View>
            <View style={{ borderColor: theme.backgroundSelected }} className="flex-row justify-between pt-3 border-t">
              <Text style={{ color: theme.text }} className="font-extrabold text-sm">Grand Total</Text>
              <Text className="text-orange-500 font-black text-lg">
                {formatCurrency(order.totalAmount)}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Chef notes */}
        {order.notes && (
          <Animated.View 
            entering={FadeInDown.delay(200).duration(450).springify()}
            style={{ borderColor: 'rgba(255, 94, 54, 0.2)' }} 
            className="bg-orange-500/5 border rounded-3xl p-5 mb-5 flex-row items-start"
          >
            <MessageSquare size={16} color={theme.primary} className="mt-0.5 mr-3" />
            <View className="flex-1">
              <Text className="text-orange-500 text-xs font-bold uppercase tracking-wider">Customer Delivery Note</Text>
              <Text style={{ color: theme.text }} className="text-sm font-semibold mt-1.5 leading-5">{order.notes}</Text>
            </View>
          </Animated.View>
        )}

        {/* Timeline kitchen log */}
        <Animated.View 
          entering={FadeInDown.delay(220).duration(450).springify()}
          style={{ 
            backgroundColor: theme.backgroundElement, 
            borderColor: theme.backgroundSelected,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
            shadowRadius: 12,
            elevation: 2
          }} 
          className="border rounded-3xl p-5 mb-10"
        >
          <Text style={{ color: theme.text }} className="font-extrabold text-sm mb-4">Kitchen Operations Log</Text>
          <View className="flex-row items-start mb-4">
            <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 mr-3" />
            <View>
              <Text style={{ color: theme.text }} className="text-xs font-bold">Order Received</Text>
              <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-0.5">
                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          </View>
          {order.status !== 'Pending' && (
            <View className="flex-row items-start mb-4">
              <View className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 mr-3" />
              <View>
                <Text style={{ color: theme.text }} className="text-xs font-bold">Kitchen Accepted & Preparing</Text>
                <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-0.5">Accepted within 1 min</Text>
              </View>
            </View>
          )}
          {(order.status === 'Ready' || order.status === 'Delivered') && (
            <View className="flex-row items-start">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 mr-3" />
              <View>
                <Text style={{ color: theme.text }} className="text-xs font-bold">Dispatched (Ready for Pickup)</Text>
                <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-0.5">Prepared in under average limit</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={{ backgroundColor: theme.backgroundElement, borderTopColor: theme.backgroundSelected }} className="border-t px-5 py-4.5 flex-row gap-3">
        {order.status === 'Pending' && (
          <>
            <Pressable
              onPress={() => {
                updateOrderStatus(order.id, 'Cancelled');
                router.back();
              }}
              style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
              className="flex-1 bg-red-500/10 border py-4 rounded-2xl flex-row justify-center items-center"
            >
              <X size={16} color="#EF4444" className="mr-1.5" />
              <Text className="text-red-500 font-extrabold text-sm">Cancel Order</Text>
            </Pressable>
            
            <Pressable
              onPress={() => {
                updateOrderStatus(order.id, 'Preparing');
              }}
              className="flex-1 bg-emerald-500 py-4 rounded-2xl flex-row justify-center items-center"
            >
              <Check size={16} color="#FFFFFF" className="mr-1.5" />
              <Text className="text-white font-extrabold text-sm">Accept & Cook</Text>
            </Pressable>
          </>
        )}

        {order.status === 'Preparing' && (
          <Pressable
            onPress={() => {
              updateOrderStatus(order.id, 'Ready');
            }}
            className="flex-1 bg-blue-500 py-4 rounded-2xl flex-row justify-center items-center"
          >
            <Check size={16} color="#FFFFFF" className="mr-1.5" />
            <Text className="text-white font-extrabold text-sm">Mark Ready</Text>
          </Pressable>
        )}

        {order.status === 'Ready' && (
          <Pressable
            onPress={() => {
              updateOrderStatus(order.id, 'Delivered');
              router.back();
            }}
            className="flex-1 bg-emerald-500 py-4 rounded-2xl flex-row justify-center items-center"
          >
            <Check size={16} color="#FFFFFF" className="mr-1.5" />
            <Text className="text-white font-extrabold text-sm">Deliver Order</Text>
          </Pressable>
        )}

        {(order.status === 'Delivered' || order.status === 'Cancelled') && (
          <View style={{ backgroundColor: theme.backgroundSelected, borderColor: theme.backgroundSelected }} className="flex-1 py-4 border rounded-2xl items-center justify-center flex-row">
            <Calendar size={14} color={theme.textSecondary} className="mr-1.5" />
            <Text style={{ color: theme.textSecondary }} className="text-xs font-bold">
              Archived Order
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
