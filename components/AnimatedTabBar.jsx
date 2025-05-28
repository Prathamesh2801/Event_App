"use client";

import { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Spring animation config
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 120,
  mass: 1,
  overshootClamping: false,
};

export default function AnimatedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const tabWidth = SCREEN_WIDTH / 3; // Always 3 tabs

  // Create shared values for each tab's position
  const tab0Position = useSharedValue(0);
  const tab1Position = useSharedValue(1);
  const tab2Position = useSharedValue(2);

  // Function to get position for a tab index
  const getTabPosition = (index) => {
    if (index === 0) return tab0Position.value;
    if (index === 1) return tab1Position.value;
    if (index === 2) return tab2Position.value;
    return 0;
  };

  // Function to set position for a tab index
  const setTabPosition = (index, position) => {
    if (index === 0) tab0Position.value = position;
    if (index === 1) tab1Position.value = position;
    if (index === 2) tab2Position.value = position;
  };

  // Function to handle tab position swapping
  const swapTabPositions = (newActiveIndex) => {
    // Find which tab is currently in the middle (position 1)
    let middleTabIndex = -1;
    if (tab0Position.value === 1) middleTabIndex = 0;
    if (tab1Position.value === 1) middleTabIndex = 1;
    if (tab2Position.value === 1) middleTabIndex = 2;

    // If the clicked tab is already in the middle, do nothing
    if (newActiveIndex === middleTabIndex) return;

    // Get the position of the newly clicked tab
    const clickedTabPosition = getTabPosition(newActiveIndex);

    // Swap positions
    setTabPosition(middleTabIndex, clickedTabPosition); // Move middle tab to clicked tab's position
    setTabPosition(newActiveIndex, 1); // Move clicked tab to middle
  };

  // Update positions when active tab changes
  useEffect(() => {
    swapTabPositions(state.index);
  }, [state.index]);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 },
        // Apply container shadow based on platform
        Platform.OS === "ios"
          ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
            }
          : { elevation: 8 },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          // Get the icon component from options
          const IconComponent = options.tabBarIcon
            ? options.tabBarIcon({
                color: isFocused ? "#673ab7" : "#222",
                size: isFocused ? 28 : 30,
              })
            : null;

          // Get the position shared value for this tab
          const positionValue =
            index === 0
              ? tab0Position
              : index === 1
              ? tab1Position
              : tab2Position;

          // Animated style for the tab
          const tabStyle = useAnimatedStyle(() => {
            const isMiddle = positionValue.value === 1;

            return {
              position: "absolute",
              width: tabWidth,
              left: withSpring(positionValue.value * tabWidth, SPRING_CONFIG),
              transform: [
                { translateY: withSpring(isMiddle ? -20 : 0, SPRING_CONFIG) },
                { scale: withSpring(isMiddle ? 1.15 : 0.9, SPRING_CONFIG) },
              ],
              zIndex: isMiddle ? 10 : 1,
            };
          }, [positionValue, tabWidth]);

          // Animated style for the tab background
          const tabBackgroundStyle = useAnimatedStyle(() => {
            const isMiddle = positionValue.value === 1;

            // Base style for all platforms
            const baseStyle = {
              // backgroundColor: withTiming(
              //   isMiddle ? "rgba(103, 58, 183, 0.15)" : "transparent",
              //   { duration: 300 }
              // ),
              backgroundColor: withTiming(
                isMiddle ? "white" : "transparent",
                { duration: 300 }
              ),
              borderRadius: 20,
              padding: isMiddle ? 10 : 6,
              borderWidth: isMiddle ? 5 : 0,
              borderColor: "rgba(103, 58, 183, 0.6)",
              borderRadius: "50%",
              bottom:isMiddle ? 15 : 0,
              opacity: withTiming(isMiddle ? 1 : 0.7, { duration: 300 }),
            };

            // Add platform-specific shadow styles
            if (Platform.OS === "ios") {
              return {
                ...baseStyle,
                shadowColor: isMiddle ? "#673ab7" : "transparent",
                shadowOffset: { width: 0, height: isMiddle ? 4 : 0 },
                shadowOpacity: isMiddle ? 0.3 : 0,
                shadowRadius: isMiddle ? 8 : 0,
              };
            } else {
              return {
                ...baseStyle,
                elevation: isMiddle ? 1 : 0,
              };
            }
          }, [positionValue]);

         

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Animated.View key={route.key} style={tabStyle}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabItem}
              >
                <Animated.View style={tabBackgroundStyle}>
                  <View style={styles.tabContent}>
                    {IconComponent}
                   
                  </View>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    overflow: "visible",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  tabBar: {
    flexDirection: "row",
    width: "100%",
    height: 40,
    position: "relative",
    
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    
  },
});
