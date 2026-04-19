import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="story/[id]" options={{ animation: 'fade', presentation: 'fullScreenModal' }} />
        <Stack.Screen name="genie" options={{ animation: 'slide_from_bottom', presentation: 'fullScreenModal' }} />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
