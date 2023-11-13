import {
  RouteProp,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import {
  Movie,
  getHtmlFromURL,
  getTranslationSeries,
  Season,
  Episode,
  Translation,
} from '../logic/movie';
import cn from 'classnames';
import MovieProperty from '../components/MovieProperty';
import Button from '../components/Button';
import {Dropdown} from 'react-native-element-dropdown';
import {NavigationProps} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

function MovieScreen() {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const route = useRoute();
  // @ts-ignore
  if (!route.params['link']) {
    Alert.alert('no movie');
    nav.goBack();
    return;
  }
  // @ts-ignore
  const movieLink = route.params['link'] as string;
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [translation, setTranslation] = useState<Translation>();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [movie, setMovie] = useState<Movie>();
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [season, setSeason] = useState<Season>();
  const [episode, setEpisode] = useState<Episode>();
  const {colors, dark} = useTheme();
  useEffect(() => {
    async function set() {
      const html = await getHtmlFromURL(movieLink);
      const retrievedMovie = new Movie(html);
      setMovie(retrievedMovie);
      setTranslations(retrievedMovie.translators);
      nav.setOptions({title: retrievedMovie?.name ?? 'Loading'});
    }
    if (!movie) set();
  }, []);
  useEffect(() => {
    async function get() {
      try {
        setSeasonLoading(true);
        const tr = translation ?? translations[0];
        if (tr) {
          const seasons = await getTranslationSeries(
            movie?.id!,
            movie?.favs!,
            translation ?? translations[0],
          );
          setSeasons(seasons);
        }
      } finally {
        setSeasonLoading(false);
      }
    }
    get();
  }, [translation]);

  function goWatchMovie() {
    if (!translation) {
      return Alert.alert('No translation', 'Please select translation');
    }
    if (seasons.length > 0 && !season) {
      return Alert.alert('No translation', 'Please select season & episode');
    }
    if (movie)
      nav.push('watch', {
        movie: movie,
        translation,
        season,
        episode,
      });
  }
  return (
    <View>
      {movie ? (
        <ScrollView
          className={'flex'}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            className={'text-4xl font-semibold m-2 mb-1 text-center'}
            style={{color: colors.text}}>
            {movie.name}
          </Text>
          <Text
            className={'text-2xl font-semibold m-1 text-center text-gray-400'}>
            {movie.originalName}
          </Text>
          <Image source={{uri: movie.thumbnail}} className={'h-96 w-60'} />
          <View
            className="border-2 border-zinc-600 rounded-lg m-4 p-1 w-10/12 z-10"
            style={{backgroundColor: dark ? colors.border : colors.background}}>
            <Dropdown
              containerStyle={{
                backgroundColor: colors.background,
                borderRadius: 8,
              }}
              itemContainerStyle={{
                borderRadius: 8,
              }}
              selectedTextStyle={{
                color: colors.text,
              }}
              itemTextStyle={{
                color: colors.text,
              }}
              data={translations}
              labelField={'name'}
              onChange={s => setTranslation(s)}
              valueField={'id'}
              placeholder="Select translation"
              activeColor={colors.border}
            />
          </View>
          {seasonLoading ? (
            <ActivityIndicator />
          ) : (
            seasons.length > 0 && (
              <View className="flex flex-row w-10/12 items-center justify-center">
                <View
                  className="flex-grow border-zinc-600 border-2 rounded-lg m-2 p-1 z-10"
                  style={{
                    backgroundColor: dark ? colors.border : colors.background,
                  }}>
                  <Dropdown
                    containerStyle={{
                      backgroundColor: colors.background,
                      borderRadius: 8,
                    }}
                    itemContainerStyle={{
                      borderRadius: 8,
                    }}
                    selectedTextStyle={{
                      color: colors.text,
                    }}
                    itemTextStyle={{
                      color: colors.text,
                    }}
                    data={seasons}
                    labelField={'name'}
                    valueField={'id'}
                    onChange={s => setSeason(s)}
                    activeColor={colors.border}
                    placeholder="Season"
                  />
                </View>
                <View
                  className="flex-grow border-zinc-600 border-2 rounded-lg m-2 p-1 z-10"
                  style={{
                    backgroundColor: dark ? colors.border : colors.background,
                  }}>
                  <Dropdown
                    containerStyle={{
                      backgroundColor: colors.background,
                      borderRadius: 8,
                    }}
                    itemContainerStyle={{
                      borderRadius: 8,
                    }}
                    selectedTextStyle={{
                      color: colors.text,
                    }}
                    itemTextStyle={{
                      color: colors.text,
                    }}
                    data={season?.episodes ?? []}
                    labelField={'name'}
                    valueField={'id'}
                    onChange={e => setEpisode(e)}
                    placeholder="Episode"
                    activeColor={colors.border}
                  />
                </View>
              </View>
            )
          )}
          <View className={' m-4 w-10/12'}>
            <Button onClick={goWatchMovie} disabled={seasonLoading}>
              <View
                className="border-2 rounded-lg border-gray-500"
                style={{
                  backgroundColor: colors.background,
                }}>
                <Text
                  className={'text-3xl p-1 text-center font-bold'}
                  style={{color: colors.text}}>
                  WATCH
                </Text>
              </View>
            </Button>
          </View>
          <View className={'flex w-screen'}>
            <MovieProperty name={'Type'} value={movie.type} />
            <MovieProperty name={'Description'} value={movie.description} />
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator size={'large'} />
      )}
    </View>
  );
}

export default MovieScreen;
