import { Pressable, Text } from "react-native";

const SIZE_STYLES = {
  small: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 14 },
  medium: { paddingVertical: 10, paddingHorizontal: 20, fontSize: 16 },
  large: { paddingVertical: 14, paddingHorizontal: 28, fontSize: 18 },
};

export default function CustomButton({
  text,
  onPress,
  color = "#FFA500",
  rippleColor = "rgba(255,255,255,0.5)",
  size = "medium",
  borderRadius = 25,
  style,
  textStyle,
}) {
  const { paddingVertical, paddingHorizontal, fontSize } =
    SIZE_STYLES[size] || SIZE_STYLES.medium;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: rippleColor }}
      style={({ pressed }) => [
        {
          backgroundColor: color,
          paddingVertical,
          paddingHorizontal,
          borderRadius,
          alignItems: "center",
          justifyContent: "center",
          // Android shadow
          elevation: pressed ? 2 : 4,
          // iOS shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: pressed ? 1 : 2 },
          shadowOpacity: 0.3,
          shadowRadius: pressed ? 1.5 : 3,
          // press opacity feedback
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Text style={[{ color: "#fff", fontSize, fontWeight: "700" }]}>
        {text}
      </Text>
    </Pressable>
  );
}
