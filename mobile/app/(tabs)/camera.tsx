import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions,
} from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../../src/theme/colors';

const { width } = Dimensions.get('window');
type CaptureMode = 'photo' | 'video' | 'story';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [mode, setMode] = useState<CaptureMode>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <Ionicons name="camera-outline" size={64} color={colors.textSecondary} />
        <Text style={styles.permissionTitle}>Accès à la caméra</Text>
        <Text style={styles.permissionText}>
          Génie a besoin d'accéder à votre caméra pour prendre des photos et vidéos.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Autoriser l'accès</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const flashIcons: Record<FlashMode, keyof typeof Ionicons.glyphMap> = {
    off: 'flash-off-outline',
    on: 'flash-outline',
    auto: 'flash-outline',
  };

  const cycleFlash = () => {
    setFlash((f) => (f === 'off' ? 'on' : f === 'on' ? 'auto' : 'off'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      />

      {/* Top controls */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.topBtn}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={cycleFlash} style={styles.topBtn}>
          <Ionicons name={flashIcons[flash]} size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtn}>
          <Ionicons name="timer-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtn}>
          <Ionicons name="color-wand-outline" size={26} color="white" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Mode selector */}
      <View style={styles.modeSelector}>
        {(['story', 'photo', 'video'] as CaptureMode[]).map((m) => (
          <TouchableOpacity key={m} onPress={() => setMode(m)} style={styles.modeBtn}>
            <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>
              {m.toUpperCase()}
            </Text>
            {mode === m && <View style={styles.modeDot} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.galleryBtn}>
          <Ionicons name="images-outline" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shutterBtn, mode === 'video' && styles.shutterVideo]}
          onPress={() => {
            if (mode === 'video') {
              setIsRecording(!isRecording);
            }
          }}
        >
          {mode === 'video' ? (
            <View style={[styles.videoInner, isRecording && styles.videoRecording]} />
          ) : (
            <View style={styles.photoInner} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.flipBtn}
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
        >
          <Ionicons name="camera-reverse-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { ...StyleSheet.absoluteFillObject },
  permissionScreen: {
    flex: 1, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40,
  },
  permissionTitle: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 20, marginBottom: 12 },
  permissionText: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  permissionBtn: {
    backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 14,
    borderRadius: 14,
  },
  permissionBtnText: { color: 'white', fontWeight: '700', fontSize: 16 },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10,
  },
  topBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  modeSelector: {
    position: 'absolute', bottom: 140, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 28,
  },
  modeBtn: { alignItems: 'center', paddingVertical: 6 },
  modeText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  modeTextActive: { color: 'white' },
  modeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'white', marginTop: 4 },
  bottomBar: {
    position: 'absolute', bottom: 40, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  galleryBtn: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center',
  },
  shutterBtn: {
    width: 78, height: 78, borderRadius: 39,
    borderWidth: 4, borderColor: 'white',
    alignItems: 'center', justifyContent: 'center',
  },
  shutterVideo: { borderColor: colors.primary },
  photoInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: 'white' },
  videoInner: { width: 30, height: 30, borderRadius: 4, backgroundColor: colors.primary },
  videoRecording: { width: 20, height: 20, borderRadius: 3 },
  flipBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center',
  },
});
