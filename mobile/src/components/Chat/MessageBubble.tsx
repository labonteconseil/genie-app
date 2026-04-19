import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Message } from '../../data/mockData';

interface Props {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: Props) {
  const bubbleStyle = [styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble];

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text style={[styles.text, isOwn && styles.ownText]}>{message.content}</Text>
        );
      case 'image':
        return (
          <Image
            source={{ uri: message.imageUrl }}
            style={styles.imageMsg}
            resizeMode="cover"
          />
        );
      case 'voice':
        return (
          <View style={styles.voiceRow}>
            <TouchableOpacity>
              <Ionicons name="play-circle" size={32} color={isOwn ? 'white' : colors.primary} />
            </TouchableOpacity>
            <View style={styles.waveform}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    { height: 4 + Math.random() * 16 },
                    isOwn && styles.waveBarOwn,
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.duration, isOwn && styles.ownText]}>
              {message.duration ?? 0}s
            </Text>
          </View>
        );
      case 'video':
        return (
          <View style={styles.videoWrapper}>
            <Image
              source={{ uri: message.imageUrl ?? 'https://picsum.photos/seed/vid/300/200' }}
              style={styles.videoThumb}
            />
            <View style={styles.playOverlay}>
              <Ionicons name="play-circle" size={44} color="white" />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.row, isOwn ? styles.ownRow : styles.otherRow]}>
      <View style={bubbleStyle}>
        {renderContent()}
        <Text style={[styles.time, isOwn && styles.timeOwn]}>{message.timestamp}</Text>
      </View>
      {isOwn && (
        <Ionicons
          name={message.read ? 'checkmark-done' : 'checkmark'}
          size={14}
          color={message.read ? colors.blue : colors.textMuted}
          style={{ alignSelf: 'flex-end', marginLeft: 4, marginBottom: 4 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 3, paddingHorizontal: 12 },
  ownRow: { justifyContent: 'flex-end' },
  otherRow: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '75%', borderRadius: 18, padding: 10,
    paddingHorizontal: 13,
  },
  ownBubble: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: colors.surfaceLight, borderBottomLeftRadius: 4 },
  text: { color: colors.textSecondary, fontSize: 15, lineHeight: 21 },
  ownText: { color: 'white' },
  time: { color: colors.textMuted, fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  timeOwn: { color: 'rgba(255,255,255,0.6)' },
  imageMsg: { width: 200, height: 200, borderRadius: 12 },
  voiceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 2, width: 100 },
  waveBar: { width: 3, borderRadius: 2, backgroundColor: colors.textSecondary },
  waveBarOwn: { backgroundColor: 'rgba(255,255,255,0.7)' },
  duration: { color: colors.textSecondary, fontSize: 12 },
  videoWrapper: { width: 200, height: 140, borderRadius: 12, overflow: 'hidden' },
  videoThumb: { width: '100%', height: '100%' },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
