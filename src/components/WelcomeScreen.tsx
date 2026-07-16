import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../hooks/use-theme';
import { OutletType } from '../types';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Store, 
  FileText, 
  ArrowRight, 
  Check, 
  UploadCloud,
  ChefHat
} from 'lucide-react-native';

export default function WelcomeScreen() {
  const { login, signup, skipAuth } = useStore();
  const theme = useTheme();
  
  // 'welcome' | 'login' | 'signup'
  const [viewState, setViewState] = useState<'welcome' | 'login' | 'signup'>('welcome');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup Form States
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [outletType, setOutletType] = useState<OutletType>('Restaurant');
  const [identityType, setIdentityType] = useState<'Aadhaar' | 'PAN'>('Aadhaar');
  const [identityNo, setIdentityNo] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleLoginSubmit = () => {
    const normalizedEmail = loginEmail.trim().toLowerCase();
    setLoginError('');

    if (!normalizedEmail || !loginPassword) {
      setLoginError('All fields are required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setLoginError('Enter a valid email address');
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError('Password must be at least 6 characters');
      return;
    }
    const success = login(normalizedEmail, loginPassword);
    if (!success) {
      setLoginError('Invalid credentials. Hint: Enter any valid email and 6+ char password.');
    }
  };

  const handleSignupSubmit = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMobile = mobile.replace(/\s+/g, '');
    const normalizedIdentityNo = identityType === 'Aadhaar'
      ? identityNo.replace(/\s+/g, '')
      : identityNo.trim().toUpperCase();

    setSignupError('');

    if (!name.trim() || !normalizedMobile || !normalizedEmail || !password || !restaurantName.trim() || !normalizedIdentityNo) {
      setSignupError('All fields are required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setSignupError('Enter a valid email address');
      return;
    }
    if (!/^\+?[0-9]{10,15}$/.test(normalizedMobile)) {
      setSignupError('Enter a valid mobile number');
      return;
    }
    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters');
      return;
    }
    if (identityType === 'Aadhaar' && !/^\d{12}$/.test(normalizedIdentityNo)) {
      setSignupError('Aadhaar number must be exactly 12 digits');
      return;
    }
    if (identityType === 'PAN' && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizedIdentityNo)) {
      setSignupError('Enter a valid PAN number (e.g. ABCDE1234F)');
      return;
    }
    if (!fileUploaded) {
      setSignupError('Attach an identity document to continue');
      return;
    }

    signup({
      name: name.trim(),
      mobile: normalizedMobile,
      email: normalizedEmail,
      restaurantName: restaurantName.trim(),
      outletType,
      identityType,
      identityNo: normalizedIdentityNo,
      identityFile: 'mock-document-attached',
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Welcome Mode */}
        {viewState === 'welcome' && (
          <Animated.View entering={FadeIn.duration(400)} className="flex-1 justify-between px-6 py-12">
            {/* Top Logo design */}
            <Animated.View entering={FadeInDown.delay(100).duration(500).springify()} className="items-center mt-12">
              <View style={{ backgroundColor: theme.backgroundSelected }} className="w-24 h-24 rounded-[30] items-center justify-center mb-6 shadow-2xl">
                <ChefHat size={48} color={theme.primary} />
              </View>
              <Text style={{ color: theme.text }} className="text-3xl font-black text-center tracking-tight">
                Foodies Manager
              </Text>
              <Text style={{ color: theme.textSecondary }} className="text-sm text-center mt-2 px-6 font-medium leading-5">
                Connect your home kitchen to the Foodies App network and sell food directly to customers.
              </Text>
            </Animated.View>

            {/* Illustration Card */}
            <Animated.View 
              entering={FadeInDown.delay(200).duration(500).springify()} 
              style={{ 
                backgroundColor: theme.backgroundElement, 
                borderColor: theme.backgroundSelected,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: theme.background === '#F8FAFC' ? 0.02 : 0.15,
                shadowRadius: 20,
                elevation: 2
              }} 
              className="border rounded-3xl p-6 my-4"
            >
              <Text style={{ color: theme.primary }} className="text-xs font-black uppercase tracking-wider mb-2">
                Home Cook Hub
              </Text>
              <Text style={{ color: theme.text }} className="text-lg font-extrabold leading-6">
                Run your tiffin center, customize dishes, check dynamic payouts, and track dispatches.
              </Text>
              <Text style={{ color: theme.textSecondary }} className="text-xs mt-2 leading-5 font-semibold">
                The companion control center built specifically for home-based cooks and micro cloud kitchens.
              </Text>
            </Animated.View>

            {/* CTAs */}
            <Animated.View entering={FadeInDown.delay(300).duration(500).springify()} className="gap-3 mt-4">
              <Pressable 
                onPress={() => setViewState('signup')}
                style={{ backgroundColor: theme.primary }}
                className="py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-orange-500/20"
              >
                <Text className="text-white text-base font-extrabold mr-2">Register Kitchen</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </Pressable>

              <Pressable 
                onPress={() => setViewState('login')}
                style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }}
                className="border py-4 rounded-2xl items-center"
              >
                <Text style={{ color: theme.text }} className="text-base font-bold">Kitchen Log In</Text>
              </Pressable>

              <Pressable 
                onPress={skipAuth}
                className="py-3 items-center mt-2"
              >
                <Text style={{ color: theme.primary }} className="text-sm font-extrabold">
                  Skip & Explore Demo
                </Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        )}

        {/* Login Form */}
        {viewState === 'login' && (
          <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-1 justify-between px-6 py-12">
            <View>
              {/* Back Button */}
              <Pressable onPress={() => setViewState('welcome')} className="py-2 mb-6">
                <Text style={{ color: theme.primary }} className="text-sm font-extrabold">← Back</Text>
              </Pressable>

              <Text style={{ color: theme.text }} className="text-2xl font-black">Kitchen Sign In</Text>
              <Text style={{ color: theme.textSecondary }} className="text-sm mt-1 font-medium">Access your chef headquarters</Text>

              {loginError ? (
                <Text className="text-rose-500 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3.5 mt-4">
                  {loginError}
                </Text>
              ) : null}

              {/* Form Input fields */}
              <View className="gap-4 mt-6">
                <View>
                  <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">Registered Email</Text>
                  <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row items-center border rounded-2xl px-4 py-3">
                    <Mail size={16} color={theme.textSecondary} />
                    <TextInput 
                      placeholder="e.g. chef@mykitchen.in"
                      placeholderTextColor={theme.textSecondary}
                      value={loginEmail}
                      onChangeText={setLoginEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={{ color: theme.text }}
                      className="flex-1 text-sm bg-transparent outline-none ml-3 font-semibold"
                    />
                  </View>
                </View>

                <View>
                  <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">Password</Text>
                  <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row items-center border rounded-2xl px-4 py-3">
                    <Lock size={16} color={theme.textSecondary} />
                    <TextInput 
                      placeholder="••••••••"
                      placeholderTextColor={theme.textSecondary}
                      value={loginPassword}
                      onChangeText={setLoginPassword}
                      secureTextEntry
                      style={{ color: theme.text }}
                      className="flex-1 text-sm bg-transparent outline-none ml-3 font-semibold"
                    />
                  </View>
                </View>
              </View>
            </View>

            <Pressable 
              onPress={handleLoginSubmit}
              style={{ backgroundColor: theme.primary }}
              className="py-4 rounded-2xl items-center mt-8 shadow-lg shadow-orange-500/20"
            >
              <Text className="text-white text-base font-extrabold">Sign In</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Signup Form */}
        {viewState === 'signup' && (
          <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-1 px-6 py-12">
            {/* Back Button */}
            <Pressable onPress={() => setViewState('welcome')} className="py-2 mb-6">
              <Text style={{ color: theme.primary }} className="text-sm font-extrabold">← Back</Text>
            </Pressable>

            <Text style={{ color: theme.text }} className="text-2xl font-black">Register Kitchen</Text>
            <Text style={{ color: theme.textSecondary }} className="text-sm mt-1 font-medium">Start selling your home-cooked meals</Text>

            {signupError ? (
              <Text className="text-rose-500 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3.5 mt-4">
                {signupError}
              </Text>
            ) : null}

            <View className="gap-4 mt-6 mb-8">
              {/* Full Name */}
              <View>
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">Chef Name</Text>
                <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row items-center border rounded-2xl px-4 py-3">
                  <UserIcon size={16} color={theme.textSecondary} />
                  <TextInput 
                    placeholder="e.g. Priya Sharma"
                    placeholderTextColor={theme.textSecondary}
                    value={name}
                    onChangeText={setName}
                    style={{ color: theme.text }}
                    className="flex-1 text-sm bg-transparent outline-none ml-3 font-semibold"
                  />
                </View>
              </View>

              {/* Kitchen Name */}
              <View>
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">Kitchen Name</Text>
                <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row items-center border rounded-2xl px-4 py-3">
                  <Store size={16} color={theme.textSecondary} />
                  <TextInput 
                    placeholder="e.g. Priya's Tiffin Point"
                    placeholderTextColor={theme.textSecondary}
                    value={restaurantName}
                    onChangeText={setRestaurantName}
                    style={{ color: theme.text }}
                    className="flex-1 text-sm bg-transparent outline-none ml-3 font-semibold"
                  />
                </View>
              </View>

              {/* Mobile Number */}
              <View>
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">Contact Number</Text>
                <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row items-center border rounded-2xl px-4 py-3">
                  <Phone size={16} color={theme.textSecondary} />
                  <TextInput 
                    placeholder="e.g. +91 98765 43210"
                    placeholderTextColor={theme.textSecondary}
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="phone-pad"
                    style={{ color: theme.text }}
                    className="flex-1 text-sm bg-transparent outline-none ml-3 font-semibold"
                  />
                </View>
              </View>

              {/* Email Address */}
              <View>
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">Business Email</Text>
                <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row items-center border rounded-2xl px-4 py-3">
                  <Mail size={16} color={theme.textSecondary} />
                  <TextInput 
                    placeholder="e.g. priya@mykitchen.in"
                    placeholderTextColor={theme.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ color: theme.text }}
                    className="flex-1 text-sm bg-transparent outline-none ml-3 font-semibold"
                  />
                </View>
              </View>

              {/* Password */}
              <View>
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">Password</Text>
                <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row items-center border rounded-2xl px-4 py-3">
                  <Lock size={16} color={theme.textSecondary} />
                  <TextInput 
                    placeholder="••••••••"
                    placeholderTextColor={theme.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{ color: theme.text }}
                    className="flex-1 text-sm bg-transparent outline-none ml-3 font-semibold"
                  />
                </View>
              </View>

              {/* Operation Model */}
              <View>
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">Kitchen Model</Text>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setOutletType('Restaurant')}
                    style={{ 
                      backgroundColor: outletType === 'Restaurant' ? 'rgba(59, 130, 246, 0.08)' : theme.backgroundElement,
                      borderColor: outletType === 'Restaurant' ? '#3B82F6' : theme.backgroundSelected
                    }}
                    className="flex-1 py-3.5 rounded-2xl border flex-row items-center justify-center"
                  >
                    <Text className={`text-xs font-extrabold ${outletType === 'Restaurant' ? 'text-blue-500' : 'text-gray-400'}`} style={{ color: outletType === 'Restaurant' ? undefined : theme.textSecondary }}>
                      Home Kitchen
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setOutletType('CloudKitchen')}
                    style={{ 
                      backgroundColor: outletType === 'CloudKitchen' ? 'rgba(255, 115, 68, 0.08)' : theme.backgroundElement,
                      borderColor: outletType === 'CloudKitchen' ? theme.primary : theme.backgroundSelected
                    }}
                    className="flex-1 py-3.5 rounded-2xl border flex-row items-center justify-center"
                  >
                    <Text className={`text-xs font-extrabold ${outletType === 'CloudKitchen' ? 'text-orange-500' : 'text-gray-400'}`} style={{ color: outletType === 'CloudKitchen' ? theme.primary : theme.textSecondary }}>
                      Cloud Kitchen
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* ID Type Selection */}
              <View>
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">Government ID Type</Text>
                <View className="flex-row gap-3">
                  {(['Aadhaar', 'PAN'] as const).map(type => (
                    <Pressable
                      key={type}
                      onPress={() => { setIdentityType(type); setIdentityNo(''); }}
                      style={{ 
                        backgroundColor: identityType === type ? 'rgba(255, 115, 68, 0.08)' : theme.backgroundElement,
                        borderColor: identityType === type ? theme.primary : theme.backgroundSelected
                      }}
                      className="flex-1 py-3.5 rounded-2xl border items-center justify-center"
                    >
                      <Text className={`text-xs font-extrabold ${identityType === type ? 'text-orange-500' : 'text-gray-400'}`} style={{ color: identityType === type ? theme.primary : theme.textSecondary }}>
                        {type}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Identity Number */}
              <View>
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">
                  {identityType} Number
                </Text>
                <View style={{ backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }} className="flex-row items-center border rounded-2xl px-4 py-3">
                  <FileText size={16} color={theme.textSecondary} />
                  <TextInput 
                    placeholder={identityType === 'Aadhaar' ? '12-digit Aadhaar' : 'ABCDE1234F'}
                    placeholderTextColor={theme.textSecondary}
                    value={identityNo}
                    onChangeText={setIdentityNo}
                    keyboardType={identityType === 'Aadhaar' ? 'numeric' : 'default'}
                    style={{ color: theme.text }}
                    className="flex-1 text-sm bg-transparent outline-none ml-3 font-semibold"
                  />
                </View>
              </View>

              {/* Document upload simulation */}
              <View>
                <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mb-2 ml-1">Upload ID Document</Text>
                <Pressable 
                  onPress={() => setFileUploaded(true)}
                  style={{ backgroundColor: theme.backgroundElement, borderColor: fileUploaded ? '#10B981' : theme.backgroundSelected }}
                  className="border border-dashed rounded-2xl p-4.5 items-center justify-center"
                >
                  {fileUploaded ? (
                    <View className="flex-row items-center">
                      <Check size={18} color="#10B981" />
                      <Text className="text-emerald-500 text-sm font-extrabold ml-2">Document Attached</Text>
                    </View>
                  ) : (
                    <View className="items-center">
                      <UploadCloud size={24} color={theme.textSecondary} />
                      <Text style={{ color: theme.textSecondary }} className="text-xs font-bold mt-1.5">Tap to browse files</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            <Pressable 
              onPress={handleSignupSubmit}
              style={{ backgroundColor: theme.primary }}
              className="py-4 rounded-2xl items-center mb-8 shadow-lg shadow-orange-500/20"
            >
              <Text className="text-white text-base font-extrabold">Register Business</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
