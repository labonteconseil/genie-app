import React, { useState, useRef } from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface Props {
  onSend: (text: string) => void;
  onAttachImage: () => void;
  onAttachCamera: () => void;
}

export default function ChatInput({ onSend, onAttachImage, onAttachCamera }: Props) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startRecording = () => {
    setIsRecording(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  if (isRecording) {
    return (
      <View style={[styles.container, styles.recordingContainer]}>
        <Animated.View style={[styles.recordDot, { transform: [{ scale: pulseAnim }] }]} />
        <TouchableOpacity
          onPress={stopRecording}
          style={styles.stopBtn}
        >
          <Ionicons name="stop-circle" size={38} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopRecording} style={styles.sendRecordBtn}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onAttachCamera} style={styles.iconBtn}>
        <Ionicons name="camera-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onAttachImage} style={styles.iconBtn}>
        <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Message..."
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={1000}
      />
      {text.trim() ? (
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPressIn={startRecording}
          onPressOut={stopRecording}
          style={styles.iconBtn}
        >
          <Ionicons name="mic-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 10, paddingVertical: 8,
    backgroundColor: colors.surface,
    borderTopColor: colors.border, borderTopWidth: 0.5,
    gap: 6,
  },
  recordingContainer: {
    justifyContent: 'center', paddingVertical: 14,
    backgroundColor: colors.surfaceLight,
  },
  iconBtn: { padding: 6, justifyContent: 'center' },
  input: {
    flex: 1, backgroundColor: colors.surfaceLight,
    borderRadius: 22, paddingHorizontal: 16,
    paddingVertical: 10, color: colors.text,
    fontSize: 15, maxHeight: 120,
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  recordDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.primary, marginRight: 8,
  },
  stopBtn: { padding: 4 },
  sendRecordBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 8,
  },
});
