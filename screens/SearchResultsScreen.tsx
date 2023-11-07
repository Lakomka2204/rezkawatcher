import {useNavigation, useRoute} from '@react-navigation/native';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import {useEffect, useState} from 'react';
import {PreviewMovie, search} from '../logic/movie';
import Movie from '../components/Movie';
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
  const nav = useNavigation();
  const route = useRoute();
  // @ts-ignore
  if (!route.params['query']) nav.goBack();
  // @ts-ignore
  const query = route.params['query'];
  // @ts-ignore
  const page = route.params['page'] ?? 1;

  const [fetchedMovies, setMovies] = useState<PreviewMovie[]>([]);

  useEffect(() => {
    async function fetchSearchResults() {
      if (query) {
        const movies = await search(query, page);
        setMovies(movies);
      }
    }
    fetchSearchResults();
    nav.setOptions({title: `Showing results for ${query}`});
  }, []);
  return (
    <View>
      {fetchedMovies.length > 0 ? (
        <FlatList
          data={formatData(fetchedMovies)}
          contentContainerStyle={styles.container}
          columnWrapperStyle={styles.wrapper}
          renderItem={({item}) => <Movie movie={item} />}
          initialNumToRender={8}
          numColumns={numColumns}
          keyExtractor={it => it.id.toString()}
        />
      ) : (
        <ActivityIndicator size={'large'} className={'m-3'} />
      )}
    </View>
  );
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
export default SearchResultsScreen;
