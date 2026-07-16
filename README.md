# 🍽️ Foodies Manager — Companion Kitchen App

Foodies Manager is a premium, state-of-the-art mobile and web companion application built using React Native and Expo. It is designed specifically for home-based cooks, micro cloud kitchens, and tiffin centers to connect to the Foodies App delivery network and control their day-to-day culinary operations.

---

## 🚀 Key Features

*   **📊 Live Operations Dashboard:** A real-time dashboard featuring outlet selection, pending order checklists, low-stock inventory alerts, active delivery partner monitors, and daily statistics.
*   **🛒 Order Lifecycle Management:** Complete control over order status flows (`Pending` ➔ `Preparing` ➔ `Ready` ➔ `Delivered` ➔ `Cancelled`) with detail logs, customer contact integrations, and live updates.
*   **🍲 Menu & Culinary Control:** CRUD capabilities for menu items complete with preparation time, price, description, category filterings (`Tiffin`, `Lunch Box`, `Mains`, `Snacks`, `Sweets`, `Beverages`), and availability toggles.
*   **💳 Settlements & Payouts Dashboard:** Unsettled payouts logs, instant manual settlement triggers, and interactive bank account information managers (HDFC bank default demo setup).
*   **📦 Inventory & Stock Alerts:** Low-stock threshold trackers detailing current quantities, restocking alerts, and automated replenishment schedules.
*   **🏷️ Promo Coupon Engine:** Active coupon control panel supporting custom discount codes, percentage cutoffs, minimum order criteria, and expiration thresholds.
*   **🏢 Multi-Outlet kitchen management:** Toggles operational status (`Open` / `Closed`) and custom kitchen timings for different kitchen branches in real-time.

---

## 🛠️ Technology Stack

*   **Core Framework:** [Expo SDK 57](https://expo.dev) & [React Native 0.86](https://reactnative.dev) (supporting file-based Routing via `expo-router`)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for robust type safety
*   **Design & Styling:** [NativeWind v5](https://nativewind.dev) (utilizing Tailwind CSS v4 engines) for high-performance responsive utility layout styling
*   **Animations:** [React Native Reanimated v4](https://docs.swmansion.com/react-native-reanimated/) for ultra-smooth micro-animations, springs, and layouts
*   **Icons:** [Lucide React Native](https://lucide.dev)

---

## 📂 Project Structure

```text
src/
├── app/                  # File-based router screen layouts
│   ├── (tabs)/           # Main navigation tabs (Home, Orders, Menu, Delivery, More)
│   ├── order-detail/     # Live order monitoring detail page
│   ├── coupons.tsx       # Coupon code management system
│   ├── inventory.tsx     # Smart inventory item tracker
│   ├── outlets.tsx       # Multi-outlet details & switcher
│   ├── payments.tsx      # Bank details & transaction settlements log
│   ├── profile.tsx       # Seller personal identity documents & details
│   ├── settings.tsx      # Dark mode toggles & app configuration
│   └── _layout.tsx       # Root entry & auth guard routing index
├── components/           # Reusable UI controls (Welcome, Themed components, animated tabs)
├── constants/            # Theme designs & colors configurations
├── context/              # Global application React Store Context (StoreContext)
├── data/                 # Static mock data payloads for testing
├── hooks/                # Custom React hooks (useTheme, etc.)
└── types.ts              # Global typescript declarations and data structures
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org) installed on your development machine.

### Installation

1. Clone this repository to your local directory.
2. Install all dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the Expo bundler:
```bash
npm run start
```

For specific platform runtimes:

*   **Web Client (Vite / React Native Web):**
    ```bash
    npm run web
    ```
*   **Android Emulator:**
    ```bash
    npm run android
    ```
*   **iOS Simulator:**
    ```bash
    npm run ios
    ```

---

## 🧪 Quality and Standards

This codebase maintains absolute compliance with rigorous code styling rules:

*   **TypeScript Checks:** No compilation or type warnings. Run validation using:
    ```bash
    npx tsc --noEmit
    ```
*   **Linter Checks:** Zero warnings or errors. Validate matching style criteria using:
    ```bash
    npm run lint
    ```

---

## 📄 License & Copyright

Copyright © 2026 **Keshav Pandit**. All rights reserved.

Licensed under the [MIT License](LICENSE) (see the LICENSE file for details).
