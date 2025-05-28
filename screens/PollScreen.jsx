import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  ScrollView,
  Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundVideoBanner from "../components/BackgroundVideoBanner";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "./LoadingScreen";
import { useEffect, useState } from "react";

export default function PollScreen({ navigation }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Dummy poll data
  const [livePolls, setLivePolls] = useState([
    {
      id: 1,
      question: "What's your biggest challenge in industry/topic?",
      isActive: true,
      options: [
        { id: 'a', text: 'Lack of time', votes: 0, percentage: 0 },
        { id: 'b', text: 'Tools/tech', votes: 0, percentage: 0 },
        { id: 'c', text: 'Strategy/clarity', votes: 0, percentage: 0 },
        { id: 'd', text: 'Collaboration', votes: 0, percentage: 0 }
      ],
      totalVotes: 0
    },
    {
      id: 2,
      question: "Was this session valuable to you?",
      isActive: true,
      status: "ACTIVE",
      options: [
        { id: 'a', text: 'Yes', votes: 0, percentage: 0 },
        { id: 'b', text: 'Somewhat', votes: 0, percentage: 0 },
        { id: 'c', text: 'Not really', votes: 0, percentage: 0 }
      ],
      totalVotes: 0
    }
  ]);

  const [pastPolls, setPastPolls] = useState([
    {
      id: 3,
      question: "Would you attend this event again next year?",
      isActive: false,
      status: "CLOSED",
      options: [
        { id: 'a', text: 'Yes', votes: 45, percentage: 65 },
        { id: 'b', text: 'Somewhat', votes: 18, percentage: 26 },
        { id: 'c', text: 'Not really', votes: 6, percentage: 9 }
      ],
      totalVotes: 69
    }
  ]);

  const isLoading = !videoLoaded;

  // Callback function to handle when video is loaded
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  const handleVote = (pollId, optionId) => {
    // Check if user already voted for this poll
    if (selectedAnswers[pollId]) {
      Alert.alert("Already Voted", "You have already voted for this poll.");
      return;
    }

    // Update the selected answers
    setSelectedAnswers(prev => ({
      ...prev,
      [pollId]: optionId
    }));

    // Update the poll data with the vote
    setLivePolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map(option => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });

          const newTotalVotes = poll.totalVotes + 1;
          
          // Recalculate percentages
          const optionsWithPercentages = updatedOptions.map(option => ({
            ...option,
            percentage: newTotalVotes > 0 ? Math.round((option.votes / newTotalVotes) * 100) : 0
          }));

          return {
            ...poll,
            options: optionsWithPercentages,
            totalVotes: newTotalVotes
          };
        }
        return poll;
      })
    );

    Alert.alert("Vote Submitted", "Thank you for your vote!");
  };

  const renderPollOption = (option, pollId, isActive, hasVoted) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.pollOption,
        hasVoted && selectedAnswers[pollId] === option.id && styles.selectedOption,
        !isActive && styles.closedOption
      ]}
      onPress={() => isActive && handleVote(pollId, option.id)}
      disabled={!isActive || hasVoted}
    >
      <View style={styles.optionContent}>
        <Text style={[
          styles.optionText,
          hasVoted && selectedAnswers[pollId] === option.id && styles.selectedOptionText
        ]}>
          {option.text}
        </Text>
        <Text style={[
          styles.percentageText,
          hasVoted && selectedAnswers[pollId] === option.id && styles.selectedPercentageText
        ]}>
          {option.percentage}%
        </Text>
      </View>
      {(hasVoted || !isActive) && (
        <View 
          style={[
            styles.progressBar,
            { width: `${option.percentage}%` },
            hasVoted && selectedAnswers[pollId] === option.id && styles.selectedProgressBar
          ]} 
        />
      )}
    </TouchableOpacity>
  );

  const renderPoll = (poll, isLive = true) => {
    const hasVoted = selectedAnswers[poll.id] !== undefined;
    
    return (
      <View key={poll.id} style={styles.pollCard}>
        <View style={styles.pollHeader}>
          <Text style={styles.pollQuestion}>{poll.question}</Text>
          {poll.status && (
            <View style={[
              styles.statusBadge,
              poll.status === 'ACTIVE' ? styles.activeBadge : styles.closedBadge
            ]}>
              <Text style={styles.statusText}>{poll.status}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.optionsContainer}>
          {poll.options.map(option => 
            renderPollOption(option, poll.id, poll.isActive, hasVoted)
          )}
        </View>

        {poll.totalVotes > 0 && (
          <Text style={styles.totalVotes}>
            Total votes: {poll.totalVotes}
          </Text>
        )}
      </View>
    );
  };

  // Show loading screen until everything is ready
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <BackgroundVideoBanner onVideoLoaded={handleVideoLoaded} />
        <LoadingScreen />
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <BackgroundVideoBanner onVideoLoaded={handleVideoLoaded} />

      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Polls</Text>
          <View style={styles.placeholder} />
        </View>

        <BlurView intensity={30} tint="light" style={styles.container}>
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Live Polls Section */}
            {livePolls.length > 0 && (
              <View style={styles.section}>
                {livePolls.map(poll => renderPoll(poll, true))}
              </View>
            )}

            {/* Past Polls Section */}
            {pastPolls.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Past Polls</Text>
                {pastPolls.map(poll => renderPoll(poll, false))}
              </View>
            )}

            {/* Empty State */}
            {livePolls.length === 0 && pastPolls.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="bar-chart" size={64} color="rgba(255,255,255,0.6)" />
                <Text style={styles.emptyText}>No polls available</Text>
                <Text style={styles.emptySubtext}>Check back later for live polls and surveys</Text>
              </View>
            )}
          </ScrollView>
        </BlurView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  rootContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  pollCard: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  pollQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: '#10B981',
  },
  closedBadge: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionsContainer: {
    marginBottom: 12,
  },
  pollOption: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    position: 'relative',
    overflow: 'hidden',
  },
  selectedOption: {
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    borderColor: "#3B82F6",
  },
  closedOption: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  selectedPercentageText: {
    color: '#FFFFFF',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 1,
  },
  selectedProgressBar: {
    backgroundColor: 'rgba(59, 130, 246, 0.4)',
  },
  totalVotes: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
});