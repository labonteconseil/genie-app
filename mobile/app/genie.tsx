import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  Animated, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { API } from '../src/config/api';

const { width } = Dimensions.get('window');

const G = {
  bg:           '#09071C',
  surface:      '#130F3A',
  surfaceLight: '#1D1852',
  border:       '#2D2870',
  gold:         '#FFD700',
  goldDim:      'rgba(255,215,0,0.15)',
  purple:       '#7C3AED',
  purpleLight:  '#A78BFA',
  text:         '#FFFFFF',
  textMuted:    'rgba(255,255,255,0.55)',
};

interface GenieMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const CATEGORIES = [
  { id: 'devoirs', emoji: '📚', label: 'Devoirs', desc: 'Cours & révisions' },
  { id: 'look',    emoji: '✨', label: 'Look',    desc: 'Style & beauté' },
  { id: 'social',  emoji: '👥', label: 'Social',  desc: 'Amis & relations' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

const WELCOME: Record<CategoryId, string> = {
  devoirs: "Par ma lampe magique ! 📚 Je suis là pour t'aider. Sur quoi tu bosses ?",
  look:    "Ooh j'adore les défis de style ! ✨ Qu'est-ce que tu cherches à améliorer ?",
  social:  "Les relations c'est tout un art ! 👥 Qu'est-ce qui te préoccupe en ce moment ?",
};

export default function GenieScreen() {
  const [messages, setMessages] = useState<GenieMessage[]>([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Floating orb animation
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,  duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const selectCategory = (cat: CategoryId) => {
    setCategory(cat);
    const welcome: GenieMessage = {
      id: `welcome_${cat}`,
      role: 'assistant',
      content: WELCOME[cat],
    };
    setMessages([welcome]);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: GenieMessage = { id: `u_${Date.now()}`, role: 'user', content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);

    try {
      const res = await fetch(API.genie, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map(({ role, content }) => ({ role, content })),
          category,
        }),
      });
      const data = await res.json();
      const content = res.ok ? data.content : (data.error ?? 'Erreur inconnue.');
      setMessages((prev) => [...prev, { id: `a_${Date.now()}`, role: 'assistant', content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err_${Date.now()}`, role: 'assistant', content: "Je suis temporairement indisponible ✨ Réessaie dans un instant !" },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="chevron-down" size={28} color={G.gold} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>🧞 Génie</Text>
            {category && (
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>
                  {CATEGORIES.find((c) => c.id === category)?.emoji}{' '}
                  {CATEGORIES.find((c) => c.id === category)?.label}
                </Text>
              </View>
            )}
          </View>
          {category && (
            <TouchableOpacity onPress={() => { setCategory(null); setMessages([]); }} style={styles.resetBtn}>
              <Ionicons name="refresh-outline" size={22} color={G.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* Welcome screen — no messages yet */}
      {messages.length === 0 && (
        <View style={styles.welcome}>
          <Animated.View style={[styles.orb, { transform: [{ translateY: floatAnim }] }]}>
            <Text style={styles.orbEmoji}>🧞</Text>
          </Animated.View>
          <Text style={styles.welcomeTitle}>Bonjour ! Je suis ton Génie ✨</Text>
          <Text style={styles.welcomeSubtitle}>
            Choisis un domaine et je t'accorde tes souhaits
          </Text>
          <View style={styles.categoryCards}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.card}
                onPress={() => selectCategory(cat.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.cardEmoji}>{cat.emoji}</Text>
                <Text style={styles.cardLabel}>{cat.label}</Text>
                <Text style={styles.cardDesc}>{cat.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Chat messages */}
      {messages.length > 0 && (
        <KeyboardAvoidingView
          style={styles.chatArea}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={[styles.msgRow, item.role === 'user' ? styles.msgRowUser : styles.msgRowGenie]}>
                {item.role === 'assistant' && (
                  <Text style={styles.genieAvatar}>🧞</Text>
                )}
                <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleGenie]}>
                  <Text style={[styles.bubbleText, item.role === 'user' && styles.bubbleTextUser]}>
                    {item.content}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={
              isLoading ? (
                <View style={styles.loadingRow}>
                  <Text style={styles.genieAvatar}>🧞</Text>
                  <View style={styles.bubbleGenie}>
                    <View style={styles.typingDots}>
                      {[0, 1, 2].map((i) => (
                        <TypingDot key={i} delay={i * 200} />
                      ))}
                    </View>
                  </View>
                </View>
              ) : null
            }
          />

          {/* Input */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Dis ton souhait…"
              placeholderTextColor={G.textMuted}
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage(input)}
            />
            <TouchableOpacity
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              style={[styles.sendBtn, (!input.trim() || isLoading) && styles.sendBtnDisabled]}
            >
              <Ionicons name="send" size={18} color={G.bg} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Category quick access when chatting */}
      {messages.length > 0 && !category && (
        <View style={styles.quickCats}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.quickCatBtn}
              onPress={() => selectCategory(cat.id)}
            >
              <Text style={styles.quickCatText}>{cat.emoji} {cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function TypingDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 400, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return <Animated.View style={[styles.dot, { opacity: anim }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.bg },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: G.border,
  },
  closeBtn: { padding: 4 },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 8 },
  headerTitle: { color: G.gold, fontSize: 18, fontWeight: '800' },
  categoryPill: {
    backgroundColor: G.goldDim, borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)', paddingHorizontal: 10, paddingVertical: 3,
  },
  categoryPillText: { color: G.gold, fontSize: 12, fontWeight: '600' },
  resetBtn: { padding: 8 },

  // Welcome
  welcome: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
  },
  orb: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: G.goldDim,
    borderWidth: 2, borderColor: 'rgba(255,215,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
    shadowColor: G.gold, shadowOpacity: 0.4, shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  orbEmoji: { fontSize: 52 },
  welcomeTitle: {
    color: G.text, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 8,
  },
  welcomeSubtitle: {
    color: G.textMuted, fontSize: 14, textAlign: 'center', marginBottom: 36, lineHeight: 20,
  },
  categoryCards: { flexDirection: 'row', gap: 12, width: '100%' },
  card: {
    flex: 1, backgroundColor: G.surface, borderRadius: 16,
    borderWidth: 1, borderColor: G.border,
    padding: 14, alignItems: 'center', gap: 6,
  },
  cardEmoji: { fontSize: 28 },
  cardLabel: { color: G.text, fontWeight: '700', fontSize: 13 },
  cardDesc: { color: G.textMuted, fontSize: 11, textAlign: 'center' },

  // Chat
  chatArea: { flex: 1 },
  messageList: { padding: 14, paddingBottom: 8 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 6, gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowGenie: { justifyContent: 'flex-start' },
  genieAvatar: { fontSize: 22, marginBottom: 2 },
  bubble: { maxWidth: width * 0.72, borderRadius: 18, padding: 12, paddingHorizontal: 14 },
  bubbleUser: { backgroundColor: G.purple, borderBottomRightRadius: 4 },
  bubbleGenie: {
    backgroundColor: G.surface, borderBottomLeftRadius: 4,
    borderLeftWidth: 2, borderLeftColor: G.gold,
  },
  bubbleText: { color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: '#FFFFFF' },
  loadingRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 6, marginLeft: 14 },
  typingDots: { flexDirection: 'row', gap: 5, padding: 12, paddingHorizontal: 16 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: G.gold },

  // Input
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: G.surface,
    borderTopWidth: 0.5, borderTopColor: G.border,
  },
  input: {
    flex: 1, backgroundColor: G.surfaceLight, borderRadius: 22,
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 16, paddingVertical: 10,
    color: G.text, fontSize: 15, maxHeight: 120,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: G.gold, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },

  quickCats: { flexDirection: 'row', justifyContent: 'center', gap: 10, paddingVertical: 10 },
  quickCatBtn: {
    backgroundColor: G.goldDim, borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)', paddingHorizontal: 14, paddingVertical: 7,
  },
  quickCatText: { color: G.gold, fontSize: 13, fontWeight: '600' },
});
