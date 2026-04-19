import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, SafeAreaView, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { mockConversations, mockUsers, Conversation } from '../../src/data/mockData';

const getOtherParticipant = (conv: Conversation) =>
  conv.participants.find((u) => u.id !== 'me') ?? conv.participants[0];

const formatLastMessage = (conv: Conversation): string => {
  const { lastMessage } = conv;
  const isOwn = lastMessage.senderId === 'me';
  const prefix = isOwn ? 'Vous : ' : '';
  switch (lastMessage.type) {
    case 'text': return prefix + lastMessage.content;
    case 'image': return prefix + '📷 Photo';
    case 'voice': return prefix + `🎤 Message vocal · ${lastMessage.duration}s`;
    case 'video': return prefix + '🎥 Vidéo';
    default: return '';
  }
};

export default function MessagesScreen() {
  const [search, setSearch] = useState('');

  const filtered = mockConversations.filter((c) => {
    const name = c.isGroup
      ? c.groupName ?? ''
      : getOtherParticipant(c).displayName;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="create-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher..."
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const other = getOtherParticipant(item);
          const name = item.isGroup ? item.groupName : other.displayName;
          const avatar = item.isGroup ? item.groupAvatar : other.avatar;

          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push(`/chat/${item.id}`)}
            >
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                {!item.isGroup && other.isOnline && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.info}>
                <View style={styles.topRow}>
                  <Text style={[styles.name, item.unreadCount > 0 && styles.nameBold]}>
                    {name}
                  </Text>
                  <Text style={[styles.time, item.unreadCount > 0 && styles.timeUnread]}>
                    {item.lastMessage.timestamp}
                  </Text>
                </View>
                <View style={styles.bottomRow}>
                  <Text
                    style={[styles.preview, item.unreadCount > 0 && styles.previewUnread]}
                    numberOfLines={1}
                  >
                    {formatLastMessage(item)}
                  </Text>
                  {item.unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 12,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  headerBtn: { padding: 4 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: colors.surfaceLight, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 14,
  },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 54, height: 54, borderRadius: 27 },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 13, height: 13, borderRadius: 6.5,
    backgroundColor: colors.online, borderWidth: 2, borderColor: colors.background,
  },
  info: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  name: { color: colors.text, fontSize: 15, fontWeight: '500' },
  nameBold: { fontWeight: '700' },
  time: { color: colors.textMuted, fontSize: 12 },
  timeUnread: { color: colors.primary, fontWeight: '600' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  preview: { color: colors.textSecondary, fontSize: 13.5, flex: 1 },
  previewUnread: { color: colors.text, fontWeight: '500' },
  badge: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5, marginLeft: 8,
  },
  badgeText: { color: 'white', fontSize: 11, fontWeight: '700' },
  divider: { height: 0.5, backgroundColor: colors.border, marginLeft: 84 },
});
