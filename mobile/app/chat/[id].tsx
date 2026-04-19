import React, { useState, useRef } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../src/theme/colors';
import {
  mockConversations, mockMessages, mockUsers,
  currentUser, Message, Conversation,
} from '../../src/data/mockData';
import MessageBubble from '../../src/components/Chat/MessageBubble';
import ChatInput from '../../src/components/Chat/ChatInput';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conv: Conversation | undefined = mockConversations.find((c) => c.id === id);
  const [messages, setMessages] = useState<Message[]>(mockMessages[id] ?? []);
  const flatListRef = useRef<FlatList>(null);

  if (!conv) return null;

  const other = conv.isGroup
    ? null
    : conv.participants.find((u) => u.id !== 'me');

  const name = conv.isGroup ? conv.groupName : other?.displayName;
  const avatar = conv.isGroup ? conv.groupAvatar : other?.avatar;

  const sendMessage = (content: string, type: Message['type'] = 'text', extra?: Partial<Message>) => {
    const msg: Message = {
      id: `new_${Date.now()}`,
      conversationId: id,
      senderId: 'me',
      content,
      type,
      timestamp: 'Maintenant',
      read: false,
      ...extra,
    };
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleAttachImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      sendMessage('', 'image', { imageUrl: result.assets[0].uri });
    }
  };

  const handleCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      sendMessage('', 'image', { imageUrl: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCenter}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{name}</Text>
            {!conv.isGroup && other?.isOnline ? (
              <Text style={styles.online}>En ligne</Text>
            ) : (
              <Text style={styles.offline}>Hors ligne</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="call-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="videocam-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} isOwn={item.senderId === 'me'} />
          )}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.encryptedNote}>
              <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
              <Text style={styles.encryptedText}>Messages chiffrés de bout en bout</Text>
            </View>
          }
        />
        <ChatInput
          onSend={(text) => sendMessage(text)}
          onAttachImage={handleAttachImage}
          onAttachCamera={handleCamera}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  headerCenter: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 4,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  name: { color: colors.text, fontWeight: '700', fontSize: 15 },
  online: { color: colors.online, fontSize: 12, marginTop: 1 },
  offline: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { padding: 8 },
  messageList: { paddingTop: 8, paddingBottom: 12 },
  encryptedNote: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, padding: 16,
  },
  encryptedText: { color: colors.textMuted, fontSize: 11 },
});
