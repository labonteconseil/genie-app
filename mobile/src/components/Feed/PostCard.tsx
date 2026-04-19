import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Post } from '../../data/mockData';

const { width } = Dimensions.get('window');

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const [liked, setLiked] = useState(post.isLiked);
  const [saved, setSaved] = useState(post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user.username}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <TouchableOpacity activeOpacity={0.95} onPress={handleLike}>
        <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={26}
              color={liked ? colors.primary : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="paper-plane-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setSaved(!saved)} style={styles.actionBtn}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={saved ? colors.yellow : colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <View style={styles.footer}>
        <Text style={styles.likes}>{likesCount.toLocaleString('fr-FR')} j'aime</Text>
        <Text style={styles.caption}>
          <Text style={styles.username}>{post.user.username} </Text>
          {post.caption}
        </Text>
        <TouchableOpacity>
          <Text style={styles.comments}>Voir les {post.comments} commentaires</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 4 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  userInfo: { flex: 1 },
  username: { color: colors.text, fontWeight: '600', fontSize: 13.5 },
  timestamp: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  moreBtn: { padding: 4 },
  image: { width, height: width, backgroundColor: colors.surface },
  actions: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6,
  },
  leftActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { padding: 4 },
  footer: { paddingHorizontal: 14, paddingBottom: 14 },
  likes: { color: colors.text, fontWeight: '600', fontSize: 13.5, marginBottom: 4 },
  caption: { color: colors.text, fontSize: 13.5, lineHeight: 19, marginBottom: 4 },
  comments: { color: colors.textSecondary, fontSize: 13 },
});
