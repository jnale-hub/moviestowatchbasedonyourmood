import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TrailerModal = ({ 
  visible, 
  onClose, 
  trailerKey, 
  videoWidth, 
  videoHeight 
}: { 
  visible: boolean; 
  onClose: () => void; 
  trailerKey: string;
  videoWidth: number;
  videoHeight: number;
}) => {
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/95 justify-center items-center">
        <TouchableOpacity 
          style={{ top: Math.max(insets.top + 10, 40), right: 24 }}
          className="absolute p-3 z-10 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          onPress={onClose}
        >
          <Text className="font-sans text-white text-xs md:text-sm tracking-widest uppercase opacity-80">close ✕</Text>
        </TouchableOpacity>
        
        <View className="w-full max-w-[1000px] shadow-2xl rounded-lg overflow-hidden bg-black">
          <YoutubePlayer
            height={videoHeight}
            width={videoWidth}
            play={visible && isReady}
            videoId={trailerKey}
            onReady={() => setIsReady(true)}
          />
        </View>
      </View>
    </Modal>
  );
};
