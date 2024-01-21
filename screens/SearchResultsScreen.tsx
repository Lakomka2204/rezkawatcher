import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {useEffect, useState} from 'react';
import {PreviewMovie, search} from '../logic/movie';
import Movie from '../components/Movie';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AsyncState, NavigationProps} from '../utils/types';
import cn from 'classnames';
const numColumns = 2;
function formatData(data: PreviewMovie[]) {
  const numFullRows = Math.floor(data.length / numColumns);
  let lastRowsCount = data.length - numFullRows * numColumns;
  while (lastRowsCount !== numColumns && lastRowsCount !== 0) {
    data.push({
      enabled: false,
      id: 'NOID',
      name: 'NONAME',
      thumbnail: '',
      type: 'none',
      url: '',
    });
    lastRowsCount += 1;
  }
  return data;
}

function SearchResultsScreen() {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const route = useRoute();
  // @ts-ignore
  if (!route.params['query']) nav.goBack();
  // @ts-ignore
  const [query, setQuery] = useState(route.params['query']);
  // @ts-ignore
  const page = route.params['page'] ?? 1;
  const [state, setState] = useState<AsyncState>('idle');
  const [error, setError] = useState('');
  const [fetchedMovies, setMovies] = useState<PreviewMovie[]>([]);
  const {colors, dark} = useTheme();
  useEffect(() => {
    async function fetchSearchResults() {
      if (query) {
        try {
          setState('loading');
          const movies = await search(query, page);
          setMovies(movies);

          setState(movies.length > 0 ? 'success' : 'notfound');
        } catch (err: any) {
          setError(err.message);
          setState('fail');
        }
      }
    }
    fetchSearchResults();
    nav.setOptions({
      title: query,
      headerRight() {
        if (!route || !route.params) return <></>;
        // @ts-ignore
        const {page} = route.params;
        const hideNext = !(page && page < 5);
        const hidePrev = !(page && page > 1);
        return (
          <View className="flex flex-row items-center">
            <TouchableOpacity
              touchSoundDisabled
              disabled={hidePrev}
              className="px-3"
              onPress={() => nav.setParams({page: page - 1})}>
              <Icon
                name="caretleft"
                size={24}
                color={hidePrev ? 'gray' : dark ? 'white' : 'black'}
              />
            </TouchableOpacity>
            <Text className="text-lg" style={{color: colors.text}}>
              {page ?? 1}
            </Text>
            <TouchableOpacity
              touchSoundDisabled
              disabled={hideNext}
              className="px-3"
              onPress={() => nav.setParams({page: page + 1})}>
              <Icon
                name="caretright"
                size={24}
                color={hideNext ? 'gray' : dark ? 'white' : 'black'}
              />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [query, route]);
  const renderResults = () => {
    switch (state) {
      case 'idle':
        return <Text className={textStyle}>Please use search bar</Text>;
      case 'loading':
        return <ActivityIndicator size={'large'} className={'m-3'} />;
      case 'success':
        return (
          <FlatList
            data={formatData(fetchedMovies)}
            contentContainerStyle={styles.container}
            columnWrapperStyle={styles.wrapper}
            renderItem={({item}) => <Movie movie={item} />}
            initialNumToRender={8}
            numColumns={numColumns}
            keyExtractor={it => it.id.toString()}
          />
        );
      case 'fail':
        return (
          <View className="flex flex-col items-center">
            <Icon name="close" color={'red'} size={64} />
            <Text className={cn(textStyle, 'text-red-500')}>{error}</Text>
          </View>
        );
      case 'notfound':
        return (
          <Text className={textStyle} style={{color: colors.text}}>
            Nothing found
          </Text>
        );
    }
  };
  return <View>{renderResults()}</View>;
}
const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'baseline',
    marginTop: 12,
    marginBottom: 12,
    justifyContent: 'space-evenly',
  },
  container: {
    alignItems: 'stretch',
  },
});
const textStyle = cn('text-2xl m-1 text-center');
export default SearchResultsScreen;
