import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { mockStories, currentUser } from '../../data/mockData';

export default function StoriesBar() {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[{ isOwn: true }, ...mockStories]}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          if ('isOwn' in item) {
            return (
              <TouchableOpacity style={styles.storyItem}>
                <View style={styles.ownAvatarWrapper}>
                  <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
                  <View style={styles.addBadge}>
                    <Ionicons name="add" size={12} color="white" />
                  </View>
                </View>
                <Text style={styles.label}>Votre story</Text>
              </TouchableOpacity>
            );
          }
          const story = item as (typeof mockStories)[0];
          return (
            <TouchableOpacity
              style={styles.storyItem}
              onPress={() => router.push(`/story/${story.id}`)}
            >
              <View style={[styles.ring, story.seen && styles.ringsSeen]}>
                <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {story.user.username}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, paddingVertical: 8 },
  list: { paddingHorizontal: 12, gap: 12 },
  storyItem: { alignItems: 'center', width: 68 },
  ring: {
    width: 68, height: 68, borderRadius: 34,
    padding: 2,
    borderWidth: 2.5,
    borderColor: colors.primary,
  },
  ringsSeen: { borderColor: colors.border },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: colors.background },
  ownAvatarWrapper: { width: 68, height: 68, borderRadius: 34, position: 'relative' },
  addBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.background,
  },
  label: { color: colors.textSecondary, fontSize: 11, marginTop: 4, width: 68, textAlign: 'center' },
});
