import { StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { memo, useEffect } from "react";

// Using memo to prevent unnecessary re-renders of the video component
const BackgroundVideoBanner = memo(({ onVideoLoaded }) => {
  const player = useVideoPlayer(
    require("../assets/vid/banner3.mp4"),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  );

  useEffect(() => {
    if (!player) return;

    // Listen for when the video is ready to play
    const handleStatusChange = (status) => {
      // When video is ready and can start playing
      if (status.isLoaded && onVideoLoaded) {
        onVideoLoaded();
      }
    };

    // Add event listeners
    player.addListener("statusChange", handleStatusChange);

    // Alternative approach - set a timeout as fallback
    // In case the event doesn't fire properly
    const timeoutId = setTimeout(() => {
      if (onVideoLoaded) {
        onVideoLoaded();
      }
    }, 2000); // 2 second fallback

    // Cleanup
    return () => {
      player.removeListener("statusChange", handleStatusChange);
      clearTimeout(timeoutId);
    };
  }, [player, onVideoLoaded]);

  return (
    <View style={styles.videoContainer}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        resizeMode="cover"
        onLoad={() => {
          // Additional callback when video loads
          if (onVideoLoaded) {
            onVideoLoaded();
          }
        }}
        onReadyForDisplay={() => {
          if (onVideoLoaded) onVideoLoaded();
          player?.play(); // Force play on web
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // Ensure it stays behind everything
    backgroundColor: "#0d2b6a", // Fallback background color
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default BackgroundVideoBanner;
