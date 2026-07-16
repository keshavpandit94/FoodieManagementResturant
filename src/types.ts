export type OutletType = 'Restaurant' | 'CloudKitchen';

export interface Outlet {
  id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  rating: number;
  type: OutletType;
  status: 'Open' | 'Closed';
  timing?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  outletId: string;
  prepTime: number; // in minutes
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  outletId: string;
  outletName: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string; // ISO string
  notes?: string;
  deliveryAddress?: string;
}

export interface AnalyticsSummary {
  todaySales: number;
  activeOrdersCount: number;
  averagePrepTime: number; // in minutes
  activeKitchensCount: number;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  restaurantName: string;
  outletType: OutletType;
  identityType: 'Aadhaar' | 'PAN';
  identityNo: string;
  identityFile?: string;
  timing?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  mobile: string;
  vehicleNumber: string;
  status: 'Active' | 'Idle' | 'Offline';
  rating?: number;
  totalDeliveries?: number;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'Card' | 'UPI' | 'Cash' | 'Wallet';
  status: 'Completed' | 'Pending' | 'Failed';
  timestamp: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g. kg, liters, pcs, pack
  minStock: number; // Reorder alert level
  outletId: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}
