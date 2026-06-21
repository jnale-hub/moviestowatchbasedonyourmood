import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';

export const CastGallery = ({ 
  cast, 
  onActorSelect
}: { 
  cast: any[];
  onActorSelect: (id: number) => void;
}) => {
  if (!cast || cast.length === 0) return null;

  return (
    <View className="mb-20">
      <Text className="font-serifItalic text-xl md:text-2xl text-dark-charcoal/50 mb-6 lowercase">the cast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6 md:mx-0 md:px-0">
        {cast.slice(0, 10).map((actor) => (
          // <-- WRAP THIS IN A TOUCHABLE OPACITY
          <TouchableOpacity 
            key={actor.id} 
            className="mr-6 md:mr-8 items-center w-20 md:w-24"
            activeOpacity={0.7}
            onPress={() => onActorSelect(actor.id)} 
          >
            <View className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/5 overflow-hidden mb-3 border border-dark-charcoal/10 shadow-sm">
              {actor.profile_path ? (
                <Image source={{ uri: `https://image.tmdb.org/t/p/w185${actor.profile_path}` }} className="w-full h-full" />
              ) : (
                <View className="flex-1 justify-center items-center"><Text className="text-xl opacity-20">👤</Text></View>
              )}
            </View>
            <Text className="font-sans text-[10px] md:text-xs font-bold text-dark-charcoal text-center" numberOfLines={1}>{actor.name}</Text>
            <Text className="font-sans text-[9px] md:text-[10px] text-dark-charcoal/50 text-center" numberOfLines={1}>{actor.character}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
