import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';
import { Reel } from '../../data/mockData';

const { width, height } = Dimensions.get('window');
const REEL_HEIGHT = height;

interface Props {
  reel: Reel;
}

export default function ReelItem({ reel }: Props) {
  const [liked, setLiked] = useState(reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likes);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <View style={styles.container}>
      <Image source={{ uri: reel.thumbnailUrl }} style={styles.background} resizeMode="cover" />

      {/* Gradient overlay */}
      <View style={styles.gradientOverlay} />

      {/* Right actions */}
      <View style={styles.rightActions}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: reel.user.avatar }} style={styles.avatar} />
          <View style={styles.followDot}>
            <Ionicons name="add" size={12} color="white" />
          </View>
        </View>

        <TouchableOpacity style={styles.action} onPress={handleLike}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={30}
            color={liked ? colors.primary : 'white'}
          />
          <Text style={styles.actionCount}>{formatCount(likesCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Ionicons name="chatbubble-outline" size={28} color="white" />
          <Text style={styles.actionCount}>{formatCount(reel.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Ionicons name="paper-plane-outline" size={28} color="white" />
          <Text style={styles.actionCount}>{formatCount(reel.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Ionicons name="bookmark-outline" size={26} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>

        {/* Sound */}
        <View style={styles.soundDisc}>
          <Image source={{ uri: reel.user.avatar }} style={styles.soundImg} />
        </View>
      </View>

      {/* Bottom info */}
      <View style={styles.bottomInfo}>
        <Text style={styles.username}>@{reel.user.username}</Text>
        <Text style={styles.caption} numberOfLines={2}>{reel.caption}</Text>
        <BlurView intensity={20} tint="dark" style={styles.soundRow}>
          <Ionicons name="musical-notes" size={14} color="white" />
          <Text style={styles.soundText} numberOfLines={1}>{reel.sound}</Text>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width, height: REEL_HEIGHT, backgroundColor: '#000' },
  background: { ...StyleSheet.absoluteFillObject },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  rightActions: {
    position: 'absolute', right: 12, bottom: 120,
    alignItems: 'center', gap: 18,
  },
  avatarWrapper: { position: 'relative', marginBottom: 4 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'white' },
  followDot: {
    position: 'absolute', bottom: -6, left: '50%',
    marginLeft: -10, width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'black',
  },
  action: { alignItems: 'center', gap: 4 },
  actionCount: { color: 'white', fontSize: 12, fontWeight: '600' },
  soundDisc: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 3, borderColor: colors.surfaceLight,
    overflow: 'hidden', marginTop: 4,
  },
  soundImg: { width: '100%', height: '100%' },
  bottomInfo: {
    position: 'absolute', bottom: 80, left: 14, right: 80,
  },
  username: { color: 'white', fontWeight: '700', fontSize: 15, marginBottom: 6 },
  caption: { color: 'white', fontSize: 14, lineHeight: 20, marginBottom: 10 },
  soundRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, overflow: 'hidden', alignSelf: 'flex-start',
  },
  soundText: { color: 'white', fontSize: 12, maxWidth: 200 },
});
