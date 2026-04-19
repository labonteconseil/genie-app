import React, { useState, useEffect, useRef } from 'react';
import {
  View, Image, Text, TouchableOpacity,
  StyleSheet, Dimensions, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { mockStories } from '../../src/data/mockData';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000;

export default function StoryViewer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const startIndex = mockStories.findIndex((s) => s.id === id);
  const [index, setIndex] = useState(startIndex >= 0 ? startIndex : 0);
  const progress = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const story = mockStories[index];

  const startProgress = () => {
    progress.setValue(0);
    animRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });
    animRef.current.start(({ finished }) => {
      if (finished) goNext();
    });
  };

  const goNext = () => {
    if (index < mockStories.length - 1) {
      setIndex((i) => i + 1);
    } else {
      router.back();
    }
  };

  const goPrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  useEffect(() => {
    startProgress();
    return () => animRef.current?.stop();
  }, [index]);

  if (!story) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: story.imageUrl }} style={styles.image} resizeMode="cover" />

      {/* Gradient overlay */}
      <View style={styles.topOverlay} />

      {/* Progress bars */}
      <SafeAreaView style={styles.progressContainer}>
        <View style={styles.progressBars}>
          {mockStories.map((s, i) => (
            <View key={s.id} style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width:
                      i < index
                        ? '100%'
                        : i === index
                        ? progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                        : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* User info */}
        <View style={styles.userRow}>
          <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{story.user.username}</Text>
            <Text style={styles.time}>Il y a 2h</Text>
          </View>
          <TouchableOpacity style={styles.moreBtn}>
            <Ionicons name="ellipsis-horizontal" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={26} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Tap zones */}
      <View style={styles.tapZones}>
        <TouchableOpacity style={styles.tapLeft} onPress={goPrev} />
        <TouchableOpacity style={styles.tapRight} onPress={goNext} />
      </View>

      {/* Bottom reply */}
      <View style={styles.bottomBar}>
        <View style={styles.replyInput}>
          <Text style={styles.replyPlaceholder}>Répondre à {story.user.username}…</Text>
        </View>
        <TouchableOpacity style={styles.bottomAction}>
          <Ionicons name="heart-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomAction}>
          <Ionicons name="paper-plane-outline" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: { width, height },
  topOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 180,
    backgroundColor: 'rgba(0,0,0,0)', // handled by overlay below SafeAreaView
  },
  progressContainer: {
    position: 'absolute', top: 0, left: 0, right: 0,
  },
  progressBars: {
    flexDirection: 'row', gap: 3,
    paddingHorizontal: 10, paddingTop: 10, marginBottom: 10,
  },
  progressTrack: {
    flex: 1, height: 2.5, backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: 'white', borderRadius: 2 },
  userRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, gap: 10,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: 'white' },
  username: { color: 'white', fontWeight: '700', fontSize: 14 },
  time: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  moreBtn: { marginLeft: 'auto' },
  closeBtn: { padding: 4 },
  tapZones: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', top: 100 },
  tapLeft: { flex: 2 },
  tapRight: { flex: 3 },
  bottomBar: {
    position: 'absolute', bottom: 40, left: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  replyInput: {
    flex: 1, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 24, paddingHorizontal: 16, paddingVertical: 11,
  },
  replyPlaceholder: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  bottomAction: { padding: 4 },
});
