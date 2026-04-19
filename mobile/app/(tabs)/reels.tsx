import React, { useRef } from 'react';
import { FlatList, Dimensions, ViewToken } from 'react-native';
import { mockReels } from '../../src/data/mockData';
import ReelItem from '../../src/components/Reels/ReelItem';

const { height } = Dimensions.get('window');

export default function ReelsScreen() {
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // Future: pause/play video based on visible item
    }
  );

  return (
    <FlatList
      data={mockReels}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReelItem reel={item} />}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      decelerationRate="fast"
      viewabilityConfig={viewabilityConfig.current}
      onViewableItemsChanged={onViewableItemsChanged.current}
      getItemLayout={(_, index) => ({
        length: height, offset: height * index, index,
      })}
    />
  );
}
