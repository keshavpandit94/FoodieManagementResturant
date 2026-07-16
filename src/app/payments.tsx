import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../hooks/use-theme';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { 
  ArrowLeft, 
  CreditCard, 
  TrendingUp, 
  CheckCircle, 
  ChevronRight, 
  X, 
  Send,
  ArrowRight,
  Briefcase
} from 'lucide-react-native';

export default function PaymentsScreen() {
  const router = useRouter();
  const { payments } = useStore();
  const theme = useTheme();

  const [settleModalVisible, setSettleModalVisible] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(false);

  // Bank Info States
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('•••• •••• 9876');
  const [ifscCode, setIfscCode] = useState('HDFC0000123');

  // Calculate totals
  const totalVolume = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingSettlement = 850; // mock static pending (₹)
  const settledBalance = totalVolume;

  const handleRequestSettlement = () => {
    setSettleModalVisible(true);
  };

  const getMethodBadgeStyle = (method: string) => {
    switch (method) {
      case 'UPI': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Card': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Cash': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-gray-300 bg-gray-700/10 border-gray-700/20';
    }
  };

  const formatCurrency = (val: number) =>
    `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      {/* Header */}
      <View style={{ borderColor: theme.backgroundSelected }} className="flex-row items-center justify-between px-5 py-3.5 border-b">
        <View className="flex-row items-center">
          <Pressable 
            onPress={() => router.back()}
            style={{ backgroundColor: theme.backgroundSelected }}
            className="rounded-full p-2.5 mr-3.5"
          >
            <ArrowLeft size={16} color={theme.text} />
          </Pressable>
          <View>
            <Text style={{ color: theme.text }} className="text-lg font-extrabold">Payments & Earnings</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs">Settlements and payouts log</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false} className="px-5 mt-5">
        
        {/* Earnings Card Widget */}
        <Animated.View entering={FadeInDown.delay(50).duration(450).springify()}>
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
            className="border rounded-3xl p-5 mb-5 flex-row justify-between items-center"
          >
            <View className="flex-1 mr-4">
              <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider">Unsettled Payouts</Text>
              <Text style={{ color: theme.text }} className="text-2xl font-black mt-1.5">{formatCurrency(pendingSettlement)}</Text>
              
              <View className="flex-row items-center mt-2.5">
                <TrendingUp size={11} color="#10B981" />
                <Text className="text-emerald-500 text-[10px] ml-1 font-bold">Auto-transfers daily at midnight</Text>
              </View>
            </View>

            <Pressable
              onPress={handleRequestSettlement}
              className="bg-orange-500 py-3.5 px-4.5 rounded-2xl flex-row items-center gap-1.5 shadow-md shadow-orange-500/10"
            >
              <Text className="text-white text-xs font-black">Settle Now</Text>
              <ArrowRight size={13} color="#FFFFFF" />
            </Pressable>
          </View>
        </Animated.View>

        {/* Bank details preview */}
        <Animated.View entering={FadeInDown.delay(100).duration(450).springify()}>
          <Pressable 
            onPress={() => setBankModalVisible(true)}
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
            className="border rounded-3xl p-4.5 mb-6 flex-row justify-between items-center"
          >
            <View className="flex-row items-center flex-1 mr-3">
              <View className="bg-blue-500/10 p-2.5 rounded-xl mr-3.5">
                <Briefcase size={18} color="#3B82F6" />
              </View>
              <View>
                <Text style={{ color: theme.text }} className="text-sm font-bold">Settlement Bank Account</Text>
                <Text style={{ color: theme.textSecondary }} className="text-xs mt-1 font-semibold">{bankName} · {accountNumber}</Text>
              </View>
            </View>
            <ChevronRight size={16} color={theme.textSecondary} />
          </Pressable>
        </Animated.View>

        {/* Transaction History title */}
        <Text style={{ color: theme.text }} className="text-base font-extrabold mb-3.5 ml-1">Transaction History</Text>

        {payments.length === 0 ? (
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
            className="border rounded-3xl p-12 items-center justify-center"
          >
            <Briefcase size={44} color={theme.textSecondary} className="mb-3" />
            <Text style={{ color: theme.text }} className="font-extrabold text-base">No payouts logged</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs text-center mt-1.5 font-semibold leading-5">
              Transactions for your cloud kitchen will display here.
            </Text>
          </Animated.View>
        ) : (
          payments.map((tx, idx) => (
            <Animated.View
              entering={FadeInDown.delay(150 + idx * 60).duration(400).springify()}
              layout={Layout.springify()}
              key={tx.id}
              style={{ 
                backgroundColor: theme.backgroundElement, 
                borderColor: theme.backgroundSelected,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: theme.background === '#F8FAFC' ? 0.03 : 0.15,
                shadowRadius: 12,
                elevation: 2
              }}
              className="border rounded-3xl p-5 mb-4 flex-row justify-between items-center"
            >
              <View className="flex-1 mr-3">
                <View className="flex-row items-center">
                  <Text style={{ color: theme.text }} className="font-extrabold text-sm">{tx.id}</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-xs mx-1.5">•</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold">Order: {tx.orderId}</Text>
                </View>
                <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-1.5 font-semibold">
                  {new Date(tx.timestamp).toLocaleString('en-IN', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}
                </Text>
              </View>

              <View className="items-end">
                <Text style={{ color: theme.text }} className="font-black text-base">{formatCurrency(tx.amount)}</Text>
                <View className="flex-row gap-2 mt-1.5 items-center">
                  <View className={`px-2 py-0.5 rounded-full border ${getMethodBadgeStyle(tx.method)}`}>
                    <Text className="text-[8px] font-black">{tx.method}</Text>
                  </View>
                  <View className={`px-2 py-0.5 rounded-full ${
                    tx.status === 'Completed' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                  }`}>
                    <Text className={`text-[8px] font-black ${
                      tx.status === 'Completed' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>{tx.status.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* Settle Modal */}
      <Modal animationType="slide" transparent visible={settleModalVisible} onRequestClose={() => setSettleModalVisible(false)}>
        <View className="flex-1 bg-black/75 justify-end">
          <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="rounded-t-3xl border-t p-6 h-[40%] items-center justify-center">
            <CheckCircle size={48} color="#10B981" />
            <Text style={{ color: theme.text }} className="text-xl font-bold mt-4">Settlement Requested</Text>
            <Text style={{ color: theme.textSecondary }} className="text-xs text-center mt-2 px-6">
              Your pending earnings of {formatCurrency(pendingSettlement)} will be disbursed to your registered bank account within 24 working hours.
            </Text>
            <Pressable
              onPress={() => setSettleModalVisible(false)}
              className="bg-orange-500 py-3 rounded-xl w-full items-center mt-6"
            >
              <Text className="text-white text-sm font-bold">Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Bank Account Modal */}
      <Modal animationType="slide" transparent visible={bankModalVisible} onRequestClose={() => setBankModalVisible(false)}>
        <View className="flex-1 bg-black/75 justify-end">
          <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="rounded-t-3xl border-t p-6 h-[50%]">
            <View style={{ borderColor: theme.backgroundSelected }} className="flex-row justify-between items-center border-b pb-4 mb-5">
              <Text style={{ color: theme.text }} className="text-xl font-bold">Bank Details</Text>
              <Pressable onPress={() => setBankModalVisible(false)} style={{ backgroundColor: theme.backgroundSelected }} className="rounded-full p-1.5">
                <X size={18} color={theme.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Bank Name</Text>
                <TextInput
                  value={bankName}
                  onChangeText={setBankName}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none font-semibold"
                />
              </View>
              <View className="mb-4">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">Account Number</Text>
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none font-semibold"
                />
              </View>
              <View className="mb-6">
                <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold mb-2">IFSC Code</Text>
                <TextInput
                  value={ifscCode}
                  onChangeText={setIfscCode}
                  autoCapitalize="characters"
                  style={{ backgroundColor: theme.background, borderColor: theme.backgroundSelected, color: theme.text }}
                  className="border rounded-xl px-4 py-3 text-sm outline-none font-semibold"
                />
              </View>

              <Pressable
                onPress={() => {
                  Alert.alert('Success', 'Bank details updated successfully.');
                  setBankModalVisible(false);
                }}
                className="bg-orange-500 py-3.5 rounded-xl items-center"
              >
                <Text className="text-white text-sm font-bold">Save Details</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
