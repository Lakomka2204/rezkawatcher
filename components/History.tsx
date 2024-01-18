import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PreviewMovie, Translation, getHtmlFromURL, getTranslationSeries, Movie as mv } from '../logic/movie';
import Movie from './Movie';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationProps } from '../App';
import Button from './Button';

function History() {
  const colors = useTheme().colors;
  const storage = useAsyncStorage("@history");
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const [history, setHistory] = useState<PreviewMovie[]>([]);
  useEffect(() => {
    async function init() {
      try {
        const historyEntry = await storage.getItem()
        if (historyEntry)
          setHistory(JSON.parse(historyEntry));
      } catch (e) { console.error(e) }
    }
    init();
  }, []);

  async function a() {
    const html = await getHtmlFromURL("https://rezka.ag/animation/fantasy/62550-hroniki-imperii-tirmun-2023.html")
    const movie = new mv(html);
    const seasons = await getTranslationSeries(movie.id, movie.translators[0], movie.favs);
    nav.navigate("watch2", {
      movie,
      translation: movie.translators[0],
      episode: seasons[0].episodes[0],
      season: seasons[0]
    });
  }
  return (
    <View>
      <Text
        style={{ color: colors.text }}
        className={'text-4xl font-semibold self-start mt-2 mb-2'}>
        History
      </Text>
      <Button onClick={a}><Text>Go to test</Text></Button>
      <View>
        {history.length > 0 ?
          <View>
            <FlatList
              data={history}
              contentContainerStyle={styles.container}
              columnWrapperStyle={styles.wrapper}
              initialNumToRender={8}
              numColumns={2}
              renderItem={({ item }) => <Movie movie={item} />} />
          </View>
          :
          <Text style={{ color: colors.text }}>
            There's no movies yet, so start watching!
          </Text>
        }
      </View>
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
export default History;
