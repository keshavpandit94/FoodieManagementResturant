import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/use-theme';
import { Bike, Clock, Package, MapPin, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

export default function DeliveryScreen() {
  const theme = useTheme();

  // Create a tracking list by matching orders to delivery partners dynamically
  const getDispatches = () => {
    return [
      {
        id: 'disp-1',
        riderName: 'Rahul Kumar',
        vehicleNumber: 'DL 3C AB 1234',
        status: 'On the Way',
        orderId: 'ORD-1002',
        customerName: 'Neha Gupta',
        address: 'B-7, Sector 62, Noida',
        time: '12 mins away',
      },
      {
        id: 'disp-2',
        riderName: 'Suresh Yadav',
        vehicleNumber: 'TN 09 GH 3456',
        status: 'Arriving for Pickup',
        orderId: 'ORD-1001',
        customerName: 'Ravi Sharma',
        address: 'A-12 DDA Flats, Lajpat Nagar IV, New Delhi',
        time: '5 mins away',
      },
      {
        id: 'disp-3',
        riderName: 'Amit Sharma',
        vehicleNumber: 'MH 12 CD 5678',
        status: 'Already Delivered',
        orderId: 'ORD-1004',
        customerName: 'Sunita Patel',
        address: 'Priya\'s Home Kitchen Delivery Circle',
        time: 'Delivered at 10:45 AM',
      },
    ];
  };

  const dispatches = getDispatches();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'On the Way': 
        return { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', display: 'ON THE WAY' };
      case 'Arriving for Pickup': 
        return { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'PICKUP ARRIVAL' };
      case 'Already Delivered': 
        return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', display: 'DELIVERED' };
      default: 
        return { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', display: 'COMPLETED' };
    }
  };

  const getInitials = (n: string) =>
    n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} className="px-5" edges={['top']}>
      {/* Header */}
      <View className="pt-2 mb-6">
        <Text style={{ color: theme.text }} className="text-3xl font-extrabold tracking-tight">Rider Dispatches</Text>
        <Text style={{ color: theme.textSecondary }} className="text-sm mt-1">Live tracking feed for customer dispatches</Text>
      </View>

      {/* Dispatches List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {dispatches.map((disp, index) => {
          const statusStyle = getStatusStyle(disp.status);
          return (
            <Animated.View
              entering={FadeInDown.delay(index * 80).duration(450).springify()}
              layout={Layout.springify()}
              key={disp.id}
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
              {/* Header Info */}
              <View className="flex-row justify-between items-start border-b pb-4 mb-4" style={{ borderColor: theme.backgroundSelected }}>
                <View className="flex-row items-center flex-1 mr-2">
                  <View style={{ backgroundColor: theme.backgroundSelected }} className="w-12 h-12 rounded-2xl items-center justify-center mr-3.5 border border-orange-500/10">
                    <Text className="text-orange-500 font-extrabold text-sm">{getInitials(disp.riderName)}</Text>
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: theme.text }} className="font-extrabold text-base">{disp.riderName}</Text>
                    <View className="flex-row items-center mt-1">
                      <Bike size={12} color={theme.textSecondary} />
                      <Text style={{ color: theme.textSecondary }} className="text-xs ml-1.5 font-bold font-mono">{disp.vehicleNumber}</Text>
                    </View>
                  </View>
                </View>

                {/* Status Badge */}
                <View className={`px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}>
                  <Text className={`text-[9px] font-black tracking-wide ${statusStyle.text}`}>
                    {statusStyle.display}
                  </Text>
                </View>
              </View>

              {/* Order Info */}
              <View className="gap-3.5">
                <View className="flex-row items-center">
                  <Package size={14} color={theme.textSecondary} />
                  <Text style={{ color: theme.text }} className="text-xs font-semibold ml-2">
                    Order: <Text className="text-orange-500 font-extrabold">{disp.orderId}</Text> ({disp.customerName})
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <MapPin size={14} color={theme.textSecondary} className="mt-0.5" />
                  <Text style={{ color: theme.textSecondary }} className="text-xs ml-2 flex-1 font-semibold leading-5" numberOfLines={2}>
                    {disp.address}
                  </Text>
                </View>

                <View className="flex-row items-center mt-1 pb-2">
                  {disp.status === 'Already Delivered' ? (
                    <CheckCircle2 size={14} color="#10B981" />
                  ) : (
                    <Clock size={14} color="#FF6B35" />
                  )}
                  <Text className={`text-xs font-bold ml-2 ${disp.status === 'Already Delivered' ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {disp.time}
                  </Text>
                </View>

                {/* Timeline Progress Tracker */}
                <View style={{ borderColor: theme.backgroundSelected }} className="border-t pt-4 flex-row items-center justify-between px-1 pb-1">
                  <View className="items-center flex-1">
                    <View className="w-3.5 h-3.5 rounded-full items-center justify-center bg-orange-500">
                      <View className="w-1.5 h-1.5 rounded-full bg-white" />
                    </View>
                    <Text style={{ color: theme.textSecondary }} className="text-[8px] font-bold mt-1">PICKUP</Text>
                  </View>

                  <View className={`h-0.5 flex-1 -mt-3.5 ${
                    disp.status === 'On the Way' || disp.status === 'Already Delivered' ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />

                  <View className="items-center flex-1">
                    <View className={`w-3.5 h-3.5 rounded-full items-center justify-center ${
                      disp.status === 'On the Way' || disp.status === 'Already Delivered' ? 'bg-orange-500' : 'bg-gray-300'
                    }`}>
                      <View className="w-1.5 h-1.5 rounded-full bg-white" />
                    </View>
                    <Text style={{ color: theme.textSecondary }} className="text-[8px] font-bold mt-1">TRANSIT</Text>
                  </View>

                  <View className={`h-0.5 flex-1 -mt-3.5 ${
                    disp.status === 'Already Delivered' ? 'bg-emerald-500' : 'bg-gray-300'
                  }`} />

                  <View className="items-center flex-1">
                    <View className={`w-3.5 h-3.5 rounded-full items-center justify-center ${
                      disp.status === 'Already Delivered' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}>
                      <View className="w-1.5 h-1.5 rounded-full bg-white" />
                    </View>
                    <Text style={{ color: theme.textSecondary }} className="text-[8px] font-bold mt-1">DELIVERED</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
