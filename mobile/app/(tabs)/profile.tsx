import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { currentUser, mockPosts } from '../../src/data/mockData';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 3) / 3;

const myPosts = mockPosts.slice(0, 6);

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={activeTab === 'posts' ? myPosts : []}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.username}>{currentUser.username}</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerBtn}>
                  <Ionicons name="add-circle-outline" size={26} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerBtn}>
                  <Ionicons name="menu-outline" size={28} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile info */}
            <View style={styles.profileInfo}>
              <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
              <View style={styles.stats}>
                {[
                  { label: 'Posts', value: currentUser.posts },
                  { label: 'Abonnés', value: currentUser.followers },
                  { label: 'Abonnements', value: currentUser.following },
                ].map((s) => (
                  <View key={s.label} style={styles.statItem}>
                    <Text style={styles.statValue}>{formatCount(s.value)}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Bio */}
            <View style={styles.bio}>
              <Text style={styles.displayName}>{currentUser.displayName}</Text>
              <Text style={styles.bioText}>{currentUser.bio}</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editBtnText}>Modifier le profil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareBtn}>
                <Text style={styles.editBtnText}>Partager le profil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="person-add-outline" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Highlights */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={['Voyages', 'Créa', 'Code', 'Food', '+']}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.highlights}
              renderItem={({ item }) => (
                <View style={styles.highlight}>
                  <View style={styles.highlightCircle}>
                    <Ionicons name="add" size={22} color={colors.textMuted} />
                  </View>
                  <Text style={styles.highlightLabel}>{item}</Text>
                </View>
              )}
            />

            {/* Tabs */}
            <View style={styles.tabs}>
              {[
                { key: 'posts', icon: 'grid-outline' },
                { key: 'reels', icon: 'play-circle-outline' },
                { key: 'saved', icon: 'bookmark-outline' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                  onPress={() => setActiveTab(tab.key as typeof activeTab)}
                >
                  <Ionicons
                    name={tab.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={activeTab === tab.key ? colors.text : colors.textMuted}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.gridItem, index % 3 !== 2 && { marginRight: 1.5 }]}>
            <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
          </TouchableOpacity>
        )}
        columnWrapperStyle={{ marginBottom: 1.5 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  username: { fontSize: 20, fontWeight: '800', color: colors.text },
  headerActions: { flexDirection: 'row', gap: 4 },
  headerBtn: { padding: 6 },
  profileInfo: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 14,
  },
  avatar: { width: 86, height: 86, borderRadius: 43, marginRight: 20 },
  stats: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { color: colors.text, fontSize: 18, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  bio: { paddingHorizontal: 16, marginBottom: 14 },
  displayName: { color: colors.text, fontWeight: '600', fontSize: 14, marginBottom: 4 },
  bioText: { color: colors.text, fontSize: 13.5, lineHeight: 19 },
  buttonRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 16 },
  editBtn: {
    flex: 1, backgroundColor: colors.surfaceLight,
    borderRadius: 10, paddingVertical: 8, alignItems: 'center',
  },
  shareBtn: {
    flex: 1, backgroundColor: colors.surfaceLight,
    borderRadius: 10, paddingVertical: 8, alignItems: 'center',
  },
  editBtnText: { color: colors.text, fontWeight: '600', fontSize: 13.5 },
  iconBtn: {
    width: 40, backgroundColor: colors.surfaceLight,
    borderRadius: 10, paddingVertical: 8, alignItems: 'center', justifyContent: 'center',
  },
  highlights: { paddingHorizontal: 16, gap: 14, marginBottom: 16 },
  highlight: { alignItems: 'center', gap: 6 },
  highlightCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  highlightLabel: { color: colors.textSecondary, fontSize: 11 },
  tabs: {
    flexDirection: 'row', borderTopWidth: 0.5,
    borderTopColor: colors.border, marginBottom: 1.5,
  },
  tab: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderBottomWidth: 1.5, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.text },
  gridItem: { width: GRID_SIZE, height: GRID_SIZE },
  gridImage: { width: '100%', height: '100%' },
});
