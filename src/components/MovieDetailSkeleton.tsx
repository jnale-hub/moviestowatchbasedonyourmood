import { View, ScrollView } from 'react-native';
import { FilmGrain } from './FilmGrain';

export const MovieDetailSkeleton = () => {
  return (
    <View className="flex-1 bg-art-sand overflow-hidden">
      <FilmGrain />
      
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} className="flex-1">
        <View className="w-full h-[45vh] md:h-[55vh] max-h-[600px] from-dark-charcoal/10 bg-gradient-to-b to-transparent" />

        <View className="w-full max-w-4xl mx-auto px-6 md:px-12 -mt-20 md:-mt-32">
          
          <View className="flex-row items-end md:items-stretch mb-10 md:mb-14">
            <View className="w-32 md:w-48 aspect-[2/3] rounded-2xl bg-dark-charcoal/20 shadow-sm border border-white/10 animate-pulse" />
            
            <View className="flex-1 pl-5 md:pl-8 pb-2 md:pb-4 justify-end">
              <View className="w-3/4 h-8 md:h-12 bg-dark-charcoal/10 rounded-lg mb-3 animate-pulse" />
              <View className="w-1/2 h-8 md:h-12 bg-dark-charcoal/10 rounded-lg mb-6 animate-pulse" />
              <View className="w-2/3 h-4 bg-dark-charcoal/10 rounded-md animate-pulse" />
            </View>
          </View>

          <View className="flex-col md:flex-row md:gap-12">
            <View className="flex-1">

              <View className="w-28 h-4 bg-dark-charcoal/10 rounded-md mb-8 animate-pulse" />

              {/* Story Heading Ghost */}
              <View className="w-24 h-6 md:h-8 bg-dark-charcoal/10 rounded-md mb-4 animate-pulse" />

              <View className="mb-12">
                <View className="w-full h-4 bg-dark-charcoal/10 rounded-md mb-3 animate-pulse" />
                <View className="w-full h-4 bg-dark-charcoal/10 rounded-md mb-3 animate-pulse" />
                <View className="w-5/6 h-4 bg-dark-charcoal/10 rounded-md mb-3 animate-pulse" />
                <View className="w-4/6 h-4 bg-dark-charcoal/10 rounded-md animate-pulse" />
              </View>

              <View className="w-24 h-6 md:h-8 bg-dark-charcoal/10 rounded-md mb-6 animate-pulse" />

              <View className="mb-20">
                <View className="flex-row overflow-hidden">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} className="mr-6 md:mr-8 items-center w-20 md:w-24">
                      <View className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-dark-charcoal/10 mb-4 animate-pulse" />
                      <View className="w-16 h-3 bg-dark-charcoal/10 rounded-md mb-2 animate-pulse" />
                      <View className="w-10 h-2 bg-dark-charcoal/10 rounded-md animate-pulse" />
                    </View>
                  ))}
                </View>
              </View>

            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
