import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Outlet, 
  MenuItem, 
  Order, 
  OrderStatus, 
  AnalyticsSummary, 
  OrderItem,
  User,
  DeliveryPartner,
  Payment,
  InventoryItem,
  Coupon
} from '../types';

import { 
  initialOutlets, 
  initialMenuItems, 
  initialOrders, 
  initialPartners, 
  initialPayments, 
  initialInventory, 
  initialCoupons, 
  defaultDemoUser 
} from '../data/mockData';

interface StoreContextType {
  outlets: Outlet[];
  menuItems: MenuItem[];
  orders: Order[];
  activeOutletId: string | null;
  setActiveOutletId: (id: string | null) => void;
  toggleOutletStatus: (id: string) => void;
  updateOutletTiming: (id: string, timing: string) => void;
  addOutlet: (outlet: Omit<Outlet, 'id' | 'rating'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addMenuItem: (menuItem: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, menuItem: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  getAnalytics: () => AnalyticsSummary;

  // Auth & Profile
  user: User | null;
  isGuest: boolean;
  login: (email: string, password: string) => boolean;
  signup: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
  skipAuth: () => void;
  updateProfile: (userData: Partial<User>) => void;

  // Inventory CRUD
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  // Coupon CRUD
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Delivery Partner CRUD
  deliveryPartners: DeliveryPartner[];
  addDeliveryPartner: (partner: Omit<DeliveryPartner, 'id'>) => void;
  updateDeliveryPartner: (id: string, partner: Partial<DeliveryPartner>) => void;
  deleteDeliveryPartner: (id: string) => void;

  // Payments List
  payments: Payment[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;


export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [outlets, setOutlets] = useState<Outlet[]>(initialOutlets);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeOutletId, setActiveOutletId] = useState<string | null>(null);

  // Auth — default to demo user so app boots directly into dashboard (testing phase)
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>(initialPartners);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const toggleOutletStatus = (id: string) => {
    setOutlets(prev =>
      prev.map(outlet =>
        outlet.id === id
          ? { ...outlet, status: outlet.status === 'Open' ? 'Closed' : 'Open' }
          : outlet
      )
    );
  };

  const updateOutletTiming = (id: string, timing: string) => {
    setOutlets(prev =>
      prev.map(outlet =>
        outlet.id === id
          ? { ...outlet, timing }
          : outlet
      )
    );
  };

  const addOutlet = (outlet: Omit<Outlet, 'id' | 'rating'>) => {
    const newOutlet: Outlet = {
      ...outlet,
      id: createId('out'),
      rating: 4.0 + Math.random() * 1.0,
    };
    setOutlets(prev => [...prev, newOutlet]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === status) return;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    if (status === 'Delivered' && order.status !== 'Delivered') {
      setPayments(prev => {
        if (prev.some(p => p.orderId === orderId)) return prev;
        const newTx: Payment = {
          id: createId('tx'),
          orderId: order.id,
          amount: order.totalAmount,
          method: Math.random() > 0.5 ? 'UPI' : 'Cash',
          status: 'Completed',
          timestamp: new Date().toISOString(),
        };
        return [newTx, ...prev];
      });
    }
  };

  const addMenuItem = (menuItem: Omit<MenuItem, 'id'>) => {
    setMenuItems(prev => [...prev, { ...menuItem, id: createId('item') }]);
  };

  const updateMenuItem = (id: string, updatedFields: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const login = (email: string, password: string): boolean => {
    if (email && password.length >= 6) {
      setUser({
        id: 'usr-001',
        name: 'Priya Sharma',
        mobile: '+91 98765 11001',
        email,
        restaurantName: "Priya's Home Kitchen",
        outletType: 'Restaurant',
        identityType: 'Aadhaar',
        identityNo: 'XXXX XXXX 4321',
      });
      setIsGuest(false);
      return true;
    }
    return false;
  };

  const signup = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Math.floor(100 + Math.random() * 900)}`,
    };
    setUser(newUser);
    setIsGuest(false);
    addOutlet({
      name: userData.restaurantName,
      address: 'Home Kitchen — Address to be updated',
      phone: userData.mobile,
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop&q=60',
      type: userData.outletType,
      status: 'Open',
    });
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
  };

  const skipAuth = () => {
    setIsGuest(true);
    setUser(defaultDemoUser);
  };

  const updateProfile = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    setInventory(prev => [...prev, { ...item, id: createId('inv') }]);
  };
  const updateInventoryItem = (id: string, updatedFields: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updatedFields } : i));
  };
  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const addCoupon = (coupon: Omit<Coupon, 'id'>) => {
    setCoupons(prev => [...prev, { ...coupon, id: createId('cp') }]);
  };
  const updateCoupon = (id: string, updatedFields: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };
  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const addDeliveryPartner = (partner: Omit<DeliveryPartner, 'id'>) => {
    setDeliveryPartners(prev => [...prev, { ...partner, id: createId('dp') }]);
  };
  const updateDeliveryPartner = (id: string, updatedFields: Partial<DeliveryPartner>) => {
    setDeliveryPartners(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };
  const deleteDeliveryPartner = (id: string) => {
    setDeliveryPartners(prev => prev.filter(p => p.id !== id));
  };

  const getAnalytics = (): AnalyticsSummary => {
    const filteredOrders = activeOutletId
      ? orders.filter(o => o.outletId === activeOutletId)
      : orders;
    const filteredOutlets = activeOutletId
      ? outlets.filter(o => o.id === activeOutletId)
      : outlets;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaySales = filteredOrders
      .filter(o => o.status === 'Delivered' && new Date(o.createdAt) >= startOfToday)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const activeOrdersCount = filteredOrders.filter(
      o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready'
    ).length;

    const activeKitchensCount = filteredOutlets.filter(o => o.status === 'Open').length;
    const relevantMenuItems = activeOutletId
      ? menuItems.filter(item => item.outletId === activeOutletId)
      : menuItems;
    const averagePrepTime = relevantMenuItems.length
      ? Math.round(relevantMenuItems.reduce((total, item) => total + item.prepTime, 0) / relevantMenuItems.length)
      : 0;

    return { todaySales, activeOrdersCount, averagePrepTime, activeKitchensCount };
  };

  // Live order simulation (every 30s)
  useEffect(() => {
    const interval = setInterval(() => {
      const openOutlets = outlets.filter(o => o.status === 'Open');
      if (openOutlets.length === 0) return;
      if (Math.random() > 0.4) return;

      const randomOutlet = openOutlets[Math.floor(Math.random() * openOutlets.length)];
      const outletItems = menuItems.filter(item => item.outletId === randomOutlet.id && item.isAvailable);
      if (outletItems.length === 0) return;

      const numItems = Math.floor(Math.random() * 2) + 1;
      const orderItems: OrderItem[] = [];
      let totalAmount = 0;

      for (let i = 0; i < numItems; i++) {
        const item = outletItems[Math.floor(Math.random() * outletItems.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        const existing = orderItems.find(oi => oi.menuItemId === item.id);
        if (existing) {
          existing.quantity += qty;
          totalAmount += item.price * qty;
        } else {
          orderItems.push({ menuItemId: item.id, name: item.name, quantity: qty, price: item.price });
          totalAmount += item.price * qty;
        }
      }

      const customers = [
        { name: 'Anjali Singh', phone: '+91 91234 56789', address: 'C-45 Rajouri Garden, Delhi' },
        { name: 'Rohit Verma', phone: '+91 92345 67890', address: '12 MG Road, Gurugram' },
        { name: 'Meera Nair', phone: '+91 93456 78901', address: '88 Indiranagar, Bengaluru' },
        { name: 'Sanjay Rao', phone: '+91 94567 89012', address: '33 Salt Lake, Kolkata' },
      ];
      const customer = customers[Math.floor(Math.random() * customers.length)];

      const newOrder: Order = {
        id: createId('ORD'),
        outletId: randomOutlet.id,
        outletName: randomOutlet.name,
        customerName: customer.name,
        customerPhone: customer.phone,
        items: orderItems,
        status: 'Pending',
        totalAmount: Math.round(totalAmount * 100) / 100,
        createdAt: new Date().toISOString(),
        deliveryAddress: customer.address,
        notes: Math.random() > 0.6 ? 'Please pack properly.' : undefined,
      };

      setOrders(prev => [newOrder, ...prev]);
    }, 30000);

    return () => clearInterval(interval);
  }, [outlets, menuItems]);

  return (
    <StoreContext.Provider
      value={{
        outlets,
        menuItems,
        orders,
        activeOutletId,
        setActiveOutletId,
        toggleOutletStatus,
        updateOutletTiming,
        addOutlet,
        updateOrderStatus,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getAnalytics,
        user,
        isGuest,
        login,
        signup,
        logout,
        skipAuth,
        updateProfile,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        deliveryPartners,
        addDeliveryPartner,
        updateDeliveryPartner,
        deleteDeliveryPartner,
        payments,
      }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
