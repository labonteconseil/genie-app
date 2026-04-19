import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';

export default function GenieFAB() {
  const glow = useRef(new Animated.Value(0.6)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glow,  { toValue: 1,   duration: 1200, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(glow,  { toValue: 0.6, duration: 1200, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1,   duration: 1200, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.glow,
        { opacity: glow, transform: [{ scale }] },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/genie')}
        activeOpacity={0.8}
      >
        <Animated.Text style={styles.lamp}>🪔</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    bottom: 88,
    right: 20,
    shadowColor: '#FFD700',
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
    zIndex: 999,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1D1852',
    borderWidth: 1.5,
    borderColor: 'rgba(255,215,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lamp: { fontSize: 26 },
});
