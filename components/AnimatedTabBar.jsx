import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AnimatedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const tabWidth = SCREEN_WIDTH / state.routes.length;
  
  // Use a shared value for the active tab index
  const activeIndex = useSharedValue(state.index);
  
  // Update the active index when the state changes
  useEffect(() => {
    activeIndex.value = state.index;
  }, [state.index]);
  
  // Animated style for the indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateX: withSpring(activeIndex.value * tabWidth + tabWidth / 2 - 20, {
            damping: 15,
            stiffness: 120,
          }) 
        }
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }
      ]}
    >
      {/* Animated indicator */}
      <Animated.View style={[styles.indicator, indicatorStyle]} />
      
      {/* Tab buttons */}
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          // Create derived value for interpolating colors
          const tabColor = useDerivedValue(() => {
            return interpolateColor(
              activeIndex.value,
              [index - 0.5, index, index + 0.5],
              ['#222', '#673ab7', '#222']
            );
          });

          // Animated style for the tab text and icon
          const tabTextStyle = useAnimatedStyle(() => {
            return {
              color: tabColor.value,
              fontSize: 12,
              fontWeight: "500",
              marginTop: 4,
            };
          });

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

          // Get the icon component from options
          const IconComponent = options.tabBarIcon
            ? options.tabBarIcon({
                color: isFocused ? "#673ab7" : "#222",
                size: 24,
              })
            : null;

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[styles.tabItem, { width: tabWidth }]}
            >
              <View style={styles.tabContent}>
                {IconComponent}
                <Animated.Text style={tabTextStyle}>
                  {label}
                </Animated.Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    width: "100%",
    position: "relative",
  },
  tabBar: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  indicator: {
    position: "absolute",
    top: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(103, 58, 183, 0.1)",
    zIndex: 0,
  }
});