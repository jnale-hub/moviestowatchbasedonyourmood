import { EBGaramond_400Regular, EBGaramond_400Regular_Italic, useFonts as useSerifFonts } from '@expo-google-fonts/eb-garamond';
import { Inter_400Regular, useFonts as useInterFonts } from '@expo-google-fonts/inter';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilmGrain } from '../components/FilmGrain';
import { Vibe } from '../types/movie.types';
import { useJournalStore } from '@/store/useJournalStore';

const VIBES_DATA = [
  { vibeKey: 'laugh' as Vibe, emoji: '😂', color: 'bg-soft-cream', text: 'need a good laugh', textColor: 'text-dark-charcoal', delay: 100 },
  { vibeKey: 'adrenaline' as Vibe, emoji: '🍿', color: 'bg-vibe-green', text: 'pure adrenaline', delay: 200 },
  { vibeKey: 'think' as Vibe, emoji: '🤯', color: 'bg-dark-charcoal', text: 'make me think', delay: 300 },
  { vibeKey: 'cry' as Vibe, emoji: '😭', color: 'bg-twilight-maroon', text: 'i want to cry', delay: 400 },
  { vibeKey: 'scare' as Vibe, emoji: '👻', color: 'bg-[#2A2A2A]', text: 'scare me', delay: 500 },
  { vibeKey: 'chill' as Vibe, emoji: '☕', color: 'bg-[#A49A87]', text: 'cozy and chill', textColor: 'text-dark-charcoal', delay: 600 },
];

const MoodTile = ({ 
  emoji, 
  text, 
  color, 
  textColor = "text-soft-cream",
  delay = 0,
  vibeKey,
  onPress
}: { 
  emoji: string, 
  text: string, 
  color: string, 
  textColor?: string,
  delay: number,
  vibeKey: Vibe,
  onPress: (vibe: Vibe) => void
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      })
    ]).start();
  });

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.95, 
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, 
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="w-[48%] md:w-[31%] aspect-square mb-4 md:mb-6">
      <Animated.View style={{ flex: 1, opacity: opacityAnim, transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] }}>
        <Pressable 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => onPress(vibeKey)} 
          className={`flex-1 p-4 rounded-3xl shadow-sm ${color} justify-center items-center border border-black/5`}
        >
          <Text className="text-4xl md:text-5xl mb-3">{emoji}</Text>
          <Text className={`font-sans text-center text-lg md:text-xl leading-tight tracking-tight lowercase ${textColor}`}>
            {text}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

interface VibeCheckProps {
  onSelectVibe: (vibe: Vibe) => void;
  onOpenLibrary: () => void;
}

export const VibeCheck = ({ onSelectVibe, onOpenLibrary }: VibeCheckProps) => {
  let [interLoaded] = useInterFonts({ Inter_400Regular });
  let [serifLoaded] = useSerifFonts({ EBGaramond_400Regular, EBGaramond_400Regular_Italic });

  const insets = useSafeAreaInsets(); 
  const { openComposer } = useJournalStore();

  const titleOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (interLoaded && serifLoaded) {
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  });
  if (!interLoaded || !serifLoaded) return null;

  return (
    <View className="flex-1 bg-art-sand overflow-hidden">
      <FilmGrain />
      
      <View 
        className="px-6 flex-row justify-between items-center z-10 absolute top-0 left-0 right-0"
        style={{ paddingTop: Math.max(insets.top, 20) + 8 }}
      >
        <Text className="font-serifItalic text-2xl text-dark-charcoal lowercase">vibe check</Text>
        <TouchableOpacity 
          onPress={onOpenLibrary}
          activeOpacity={0.8}
          className="w-10 h-10 rounded-full bg-dark-charcoal flex items-center justify-center border border-white/10"
        >
          <Text className="font-serifItalic text-lg text-soft-cream mt-1">Y</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingTop: insets.top + 80, paddingBottom: insets.bottom + 100 }} 
        showsVerticalScrollIndicator={false} 
        bounces={false} 
        overScrollMode="never"
      >
        <View className="w-full max-w-3xl mx-auto px-6 relative">
          <Animated.View style={{ opacity: titleOpacity }}>
            <Text className="font-serifItalic text-dark-charcoal text-4xl md:text-5xl text-center lowercase tracking-tighter mb-10 md:mb-16">
              what&apos;s the vibe today?
            </Text>
          </Animated.View>

          <View className="flex-row flex-wrap justify-between w-full">
            {VIBES_DATA.map((vibe) => (
              <MoodTile 
                key={vibe.vibeKey}
                emoji={vibe.emoji} 
                color={vibe.color} 
                text={vibe.text} 
                textColor={vibe.textColor} 
                delay={vibe.delay} 
                vibeKey={vibe.vibeKey} 
                onPress={onSelectVibe} 
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => openComposer()} 
        style={{ bottom: Math.max(insets.bottom + 20, 32), right: 24 }}
        className="absolute bg-dark-charcoal px-5 py-4 rounded-full shadow-2xl flex-row items-center border border-white/10 z-50"
      >
        <Text className="text-soft-cream text-lg leading-none">✍🏽</Text>
      </TouchableOpacity>
    </View>
  );
};
