import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../hooks/use-theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Volume2, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Smartphone, 
  Moon,
  Clock
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, isGuest, logout } = useStore();
  const theme = useTheme();

  const [pushNotif, setPushNotif] = useState(true);
  const [audioAlert, setAudioAlert] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

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
          <Text style={{ color: theme.text }} className="text-lg font-extrabold">App Settings</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false} className="px-5 mt-5">
        {/* Profile config section */}
        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">Account & Branch</Text>
        
        <Animated.View entering={FadeInDown.delay(50).duration(450).springify()}>
          <Pressable 
            onPress={() => router.push('/profile')}
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
            className="border rounded-3xl p-5 mb-5 flex-row justify-between items-center"
          >
            <View className="flex-row items-center flex-1 mr-4">
              <View className="bg-orange-500/10 w-10 h-10 rounded-2xl justify-center items-center mr-3.5 border border-orange-500/10">
                <User size={18} color={theme.primary} />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.text }} className="text-sm font-extrabold">{user?.name || 'Chef Account'}</Text>
                <Text style={{ color: theme.textSecondary }} className="text-xs mt-1.5 font-semibold" numberOfLines={1}>
                  {isGuest ? 'Guest Merchant Account' : user?.email}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={theme.textSecondary} />
          </Pressable>
        </Animated.View>

        {/* Notifications & Sound Section */}
        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">Kitchen Alerts</Text>
        
        <Animated.View entering={FadeInDown.delay(100).duration(450).springify()}>
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
            className="border rounded-3xl p-3 mb-5"
          >
            {/* Push Notifs */}
            <View className="flex-row items-center justify-between p-3.5">
              <View className="flex-row items-center">
                <View className="bg-blue-500/10 p-2.5 rounded-xl mr-3.5 border border-blue-500/10">
                  <Bell size={15} color="#3B82F6" />
                </View>
                <View>
                  <Text style={{ color: theme.text }} className="font-bold text-sm">New Order Alerts</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-1 font-semibold">Receive immediate notifications</Text>
                </View>
              </View>
              <Switch
                value={pushNotif}
                onValueChange={setPushNotif}
                trackColor={{ false: '#767577', true: '#FF6B35' }}
                thumbColor={pushNotif ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            {/* Sound Alert */}
            <View style={{ borderColor: theme.backgroundSelected }} className="flex-row items-center justify-between p-3.5 border-t">
              <View className="flex-row items-center">
                <View className="bg-purple-500/10 p-2.5 rounded-xl mr-3.5 border border-purple-500/10">
                  <Volume2 size={15} color="#A855F7" />
                </View>
                <View>
                  <Text style={{ color: theme.text }} className="font-bold text-sm">Ring for Incoming</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-1 font-semibold">Continuous ring until accepted</Text>
                </View>
              </View>
              <Switch
                value={audioAlert}
                onValueChange={setAudioAlert}
                trackColor={{ false: '#767577', true: '#FF6B35' }}
                thumbColor={audioAlert ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            {/* Auto Accept */}
            <View style={{ borderColor: theme.backgroundSelected }} className="flex-row items-center justify-between p-3.5 border-t">
              <View className="flex-row items-center">
                <View className="bg-emerald-500/10 p-2.5 rounded-xl mr-3.5 border border-emerald-500/10">
                  <Clock size={15} color="#10B981" />
                </View>
                <View>
                  <Text style={{ color: theme.text }} className="font-bold text-sm">Auto-Accept Orders</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-1 font-semibold">Automatically mark orders preparing</Text>
                </View>
              </View>
              <Switch
                value={autoAccept}
                onValueChange={setAutoAccept}
                trackColor={{ false: '#767577', true: '#FF6B35' }}
                thumbColor={autoAccept ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>
          </View>
        </Animated.View>

        {/* Display Config */}
        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">App Appearance</Text>
        
        <Animated.View entering={FadeInDown.delay(150).duration(450).springify()}>
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
            className="border rounded-3xl p-3 mb-5"
          >
            {/* Dark Mode Toggle */}
            <View className="flex-row items-center justify-between p-3.5">
              <View className="flex-row items-center">
                <View className="bg-orange-500/10 p-2.5 rounded-xl mr-3.5 border border-orange-500/10">
                  <Moon size={15} color={theme.primary} />
                </View>
                <View>
                  <Text style={{ color: theme.text }} className="font-bold text-sm">Dark Theme</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-1 font-semibold">Use high contrast color space</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#767577', true: '#FF6B35' }}
                thumbColor={darkMode ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>
          </View>
        </Animated.View>

        {/* Info & Support */}
        <Text style={{ color: theme.textSecondary }} className="text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">Help & Legals</Text>
        
        <Animated.View entering={FadeInDown.delay(200).duration(450).springify()}>
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
            className="border rounded-3xl p-3 mb-5"
          >
            {/* Version info */}
            <View className="flex-row items-center justify-between p-3.5">
              <View className="flex-row items-center">
                <View className="bg-gray-500/10 p-2.5 rounded-xl mr-3.5">
                  <Smartphone size={15} color={theme.textSecondary} />
                </View>
                <View>
                  <Text style={{ color: theme.text }} className="font-bold text-sm">Software version</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-1 font-semibold">Foodies Manager v1.0.0 (BETA)</Text>
                </View>
              </View>
            </View>

            {/* Help Center */}
            <Pressable style={{ borderColor: theme.backgroundSelected }} className="flex-row items-center justify-between p-3.5 border-t">
              <View className="flex-row items-center">
                <View className="bg-blue-500/10 p-2.5 rounded-xl mr-3.5 border border-blue-500/10">
                  <HelpCircle size={15} color="#3B82F6" />
                </View>
                <View>
                  <Text style={{ color: theme.text }} className="font-bold text-sm">Chef Help Center</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-[10px] mt-1 font-semibold">Partner guidelines & operations help</Text>
                </View>
              </View>
              <ChevronRight size={15} color={theme.textSecondary} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Logout Trigger */}
        <Animated.View entering={FadeInDown.delay(250).duration(450).springify()}>
          <Pressable
            onPress={handleLogout}
            className="bg-red-500/10 border border-red-500/20 py-4 rounded-2xl flex-row items-center justify-center mb-8"
          >
            <LogOut size={16} color="#EF4444" className="mr-2" />
            <Text className="text-red-500 font-extrabold text-sm">Sign Out Account</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
