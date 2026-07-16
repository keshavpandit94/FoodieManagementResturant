import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { Home, ShoppingBag, UtensilsCrossed, Bike, Menu } from 'lucide-react-native';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon={Home}>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="orders" href="/orders" asChild>
            <TabButton icon={ShoppingBag}>Orders</TabButton>
          </TabTrigger>
          <TabTrigger name="menu" href="/menu" asChild>
            <TabButton icon={UtensilsCrossed}>Menu</TabButton>
          </TabTrigger>
          <TabTrigger name="delivery" href="/delivery" asChild>
            <TabButton icon={Bike}>Delivery</TabButton>
          </TabTrigger>
          <TabTrigger name="more" href="/more" asChild>
            <TabButton icon={Menu}>More</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, icon: IconComponent, ...props }: TabTriggerSlotProps & { icon?: any }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || scheme === null ? 'light' : scheme];

  return (
    <Pressable {...props}>
      {({ pressed, hovered }: any) => {
        let backgroundColor: string = 'transparent';
        let textColor: string = colors.textSecondary;
        let iconColor: string = colors.textSecondary;
        let transformScale = 1;

        if (isFocused) {
          backgroundColor = scheme === 'dark' ? 'rgba(255, 115, 68, 0.15)' : 'rgba(255, 94, 54, 0.08)';
          textColor = colors.primary;
          iconColor = colors.primary;
          transformScale = 1.05;
        } else if (hovered) {
          backgroundColor = colors.backgroundSelected;
          textColor = colors.text;
          iconColor = colors.text;
          transformScale = 1.03;
        } else if (pressed) {
          backgroundColor = colors.backgroundSelected;
          textColor = colors.textSecondary;
          iconColor = colors.textSecondary;
          transformScale = 0.98;
        }

        return (
          <View
            style={[
              styles.tabButtonView,
              { backgroundColor, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, transform: [{ scale: transformScale }] }
            ]}
          >
            {IconComponent && <IconComponent size={20} color={iconColor} />}
            <ThemedText 
              type={isFocused ? "smallBold" : "small"} 
              style={{ color: textColor }}
            >
              {children}
            </ThemedText>
          </View>
        );
      }}
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          🍽 Foodies Manager
        </ThemedText>

        {props.children}

        <ExternalLink href="https://foodies.app" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Foodies App</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  tabButtonView: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    transitionProperty: 'background-color, color, transform',
    transitionDuration: '200ms',
  } as any,
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});
