import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { searchTMDB } from '../api/tmdb';
import { useJournalStore, WatchStage } from '../store/useJournalStore';

export const JournalComposer = () => {
  const insets = useSafeAreaInsets();
  
  const { isComposing, composerContext, closeComposer, addEntry } = useJournalStore();
  
  // States
  const [text, setText] = useState('');
  const [stage, setStage] = useState<WatchStage>(null); // Default to null (optional)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContext, setSelectedContext] = useState<{ id: number; type: 'movie' | 'cast'; name: string } | null>(null);

  const { data: searchResults } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchTMDB(searchQuery),
    enabled: searchQuery.length > 2,
  });

  useEffect(() => {
    if (isComposing) {
      setText('');
      setStage(null);
      setSearchQuery('');
      setSelectedContext(null);
    }
  }, [isComposing]);

  const activeContext = composerContext || selectedContext;

  const handlePost = () => {
    if (text.trim().length === 0) return;
    
    addEntry({
      topicId: activeContext?.id, // Optional now
      topicType: activeContext ? activeContext.type : 'general',
      topicName: activeContext ? activeContext.name : 'General Note',
      stage,
      text: text.trim()
    });
    
    closeComposer();
  };

  return (
    <Modal visible={isComposing} animationType={Platform.OS === 'web' ? 'fade' : 'slide'} transparent={true} onRequestClose={closeComposer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end md:justify-center bg-black/60 md:p-6"
      >
        <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}>
          
          <View 
            style={{ paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 20 }}
            className="w-full md:max-w-2xl md:mx-auto bg-art-sand md:rounded-2xl rounded-t-[32px] min-h-[60vh] md:min-h-[400px] shadow-2xl flex-col"
          >
            {/* Header */}
            <View className="flex-row justify-between items-center p-5 md:p-6 border-b border-dark-charcoal/10">
              <TouchableOpacity onPress={closeComposer} className="w-16">
                <Text className="font-sans text-dark-charcoal/60 font-bold uppercase tracking-widest text-[10px] md:text-xs">Cancel</Text>
              </TouchableOpacity>
              <Text className="font-serifItalic text-xl text-dark-charcoal lowercase">new entry</Text>
              <View className="w-16 items-end" />
            </View>

            <View className="flex-row p-5 md:p-6 flex-1">
              <View className="items-center mr-4">
                <View className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark-charcoal flex items-center justify-center">
                  <Text className="text-soft-cream font-serifItalic text-lg">You</Text>
                </View>
                <View className="w-[2px] flex-1 bg-dark-charcoal/10 my-2 rounded-full" />
              </View>

              <View className="flex-1">
                
                
                <View className="mb-3 relative z-50">
                  {activeContext ? (
                    <View className="flex-row items-center flex-wrap">
                      <Text className="font-sans font-bold text-dark-charcoal md:text-base mr-2">My Journal</Text>
                      <View className="bg-dark-charcoal/5 px-2 py-1 rounded-md flex-row items-center">
                        <Text className="font-sans font-bold text-dark-charcoal/60 uppercase tracking-widest text-[9px] md:text-[10px] mr-2">
                          {activeContext.type === 'cast' ? '👤 ' : '🎬 '}{activeContext.name}
                        </Text>
                        {!composerContext && (
                          <TouchableOpacity onPress={() => setSelectedContext(null)}>
                            <Text className="text-dark-charcoal/40 font-bold text-xs">✕</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ) : (
                    <TextInput
                      className="font-sans text-dark-charcoal font-bold text-sm bg-dark-charcoal/5 px-3 py-2 rounded-lg outline-none"
                      placeholder="Tag a movie or actor (optional)..."
                      placeholderTextColor="#1E232660"
                      selectionColor="#1E2326"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : undefined}
                    />
                  )}

                  {!activeContext && searchResults && searchResults.length > 0 && searchQuery.length > 2 && (
                    <View 
                      className="absolute top-[44px] left-0 right-0 z-50 bg-white border border-dark-charcoal/10 rounded-xl max-h-[140px] overflow-hidden shadow-xl"
                      style={Platform.OS === 'android' ? { elevation: 10 } : {}}
                    >
                      <ScrollView keyboardShouldPersistTaps="handled">
                        {searchResults.map((result: any) => (
                          <TouchableOpacity
                            key={result.id}
                            className="py-2.5 px-3 border-b border-dark-charcoal/5 flex-row items-center bg-white"
                            onPress={() => {
                              setSelectedContext({
                                id: result.id,
                                type: result.media_type === 'person' ? 'cast' : 'movie',
                                name: result.title || result.name
                              });
                              setSearchQuery('');
                            }}
                          >
                            <Text className="font-sans text-dark-charcoal font-medium text-sm">
                              {result.media_type === 'person' ? '👤 ' : '🎬 '}
                              {result.title || result.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                
                <TextInput
                  className="font-sans text-dark-charcoal text-base md:text-lg min-h-[80px] pt-0 outline-none"
                  placeholder="What's on your mind?"
                  placeholderTextColor="#1E232660"
                  selectionColor="#1E2326"
                  multiline
                  autoFocus
                  value={text}
                  onChangeText={setText}
                  textAlignVertical="top"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : undefined}
                />

                
                <View className="flex-row items-center mt-4 gap-2">
                  {(['before', 'during', 'after'] as WatchStage[]).map((s) => (
                    <TouchableOpacity
                      key={s!}
                      
                      onPress={() => setStage(stage === s ? null : s)}
                      className={`px-3 py-1.5 rounded-full border ${
                        stage === s ? 'border-dark-charcoal bg-dark-charcoal' : 'border-dark-charcoal/20 bg-transparent'
                      }`}
                    >
                      <Text className={`font-sans text-[10px] uppercase tracking-widest font-bold ${
                        stage === s ? 'text-soft-cream' : 'text-dark-charcoal/60'
                      }`}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

              </View>
            </View>

            <View className="flex-row justify-end p-5 border-t border-dark-charcoal/5">
              <TouchableOpacity 
                disabled={text.trim().length === 0}
                onPress={handlePost}
                className={`px-8 py-3 rounded-full ${text.trim().length > 0 ? 'bg-dark-charcoal' : 'bg-dark-charcoal/20'}`}
              >
                <Text className={`font-sans text-xs uppercase tracking-widest font-bold ${text.trim().length > 0 ? 'text-soft-cream' : 'text-dark-charcoal/40'}`}>
                  Post
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
