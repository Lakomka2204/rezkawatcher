import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Alert
} from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { Movie, getHtmlFromURL, getTranslationSeries, Season, Episode, Translation } from "../logic/movie";
import cn from "classnames";
import MovieProperty from "../components/MovieProperty";
import { FlatList } from "react-native";
import Rating from "../components/RatingBubble";
import Button from "../components/Button";
import { Dropdown } from "react-native-element-dropdown";
function MovieScreen() {
  const nav = useNavigation();
  const route = useRoute();
  // @ts-ignore
  if (!route.params['link']) {
    Alert.alert("no movie");
    nav.goBack();
    return;
  }
  // @ts-ignore
  const movieLink = route.params["link"] as string;
  const [seasonLoading,setSeasonLoading] = useState(false);
  const [translation,setTranslation] = useState<Translation>();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [movie, setMovie] = useState<Movie>();
  const [seasons,setSeasons] = useState<Season[]>([]);
  const [season,setSeason] = useState<Season>();
  const [episode,setEpisode] = useState<Episode>();
  useEffect(() => {
    async function set() {
      const html = await getHtmlFromURL(movieLink);
      const retrievedMovie = new Movie(html);
      setMovie(retrievedMovie);
      setTranslations(retrievedMovie.translators);
    }
    if (!movie) set();
  }, []);
  useEffect(() => {
    async function get() {
      try{
        setSeasonLoading(true);
        const tr = translation ?? translations[0];
        if (tr) {
          const seasons = await getTranslationSeries(movie?.id!,movie?.favs!,translation ?? translations[0]);
          setSeasons(seasons);
        }
      }
      finally {
        setSeasonLoading(false);
      }
    }
    get();
  }, [translation]);
  nav.setOptions({ title: movie?.name ?? "Loading" });
  function goWatchMovie() {
    if (!translation) {
      return Alert.alert("No translation","Please select translation");
    }
    // @ts-ignore
    nav.navigate('watch',{movie,translation, episode, season});
  }
  return (
    <View>
      {movie ? (
        <ScrollView className={"flex"} 
        contentContainerStyle={{justifyContent:'center', alignItems:'center'}}

        >

          <Text className={"text-4xl font-semibold m-2 mb-1 text-center text-black"}>
            {movie.name}
          </Text>
          <Text
            className={"text-2xl font-semibold m-1 text-center text-gray-400"}
            >
            {movie.originalName}
          </Text>
          <Image source={{uri: movie.thumbnail}} className={"h-96 w-60"} />
          <View
          className=" border-gray-500 border-2 rounded-lg m-4 p-1 w-10/12 z-10"
          >
            <Dropdown
            data={translations}
            labelField={"name"}
            onChange={(s) => setTranslation(s)}
            valueField={'id'}
            placeholder="Select translation"
            />
          </View>
          {seasonLoading ? <ActivityIndicator/> :
          seasons.length > 0 &&
          <View
          className="flex flex-row w-10/12 items-center justify-center"
          >
            <View className="flex-grow border-gray-500 border-2 rounded-lg m-2 p-1 z-10">
            <Dropdown data={seasons}
            labelField={'name'}
            valueField={'id'}
            onChange={(s) => setSeason(s)}
            placeholder="Season"
            />
            </View>
            <View className="flex-grow border-gray-500 border-2 rounded-lg m-2 p-1 z-10">
            <Dropdown
            data={season?.episodes ?? []}
            labelField={'name'}
            valueField={'id'}
            onChange={(e) => setEpisode(e)}
            placeholder="Episode"
            />
            </View>
          </View>
          }
          <View className={'bg-yellow-200 border-gray-500 border-2 rounded-lg m-4 w-10/12'}>
          <Button onClick={goWatchMovie}>
            <Text className={'text-3xl p-1 text-center font-bold text-black'}>WATCH</Text>
          </Button>
          </View>
          <View className={'flex w-screen'}>
            <MovieProperty name={'Type'} value={movie.type}/>
            <MovieProperty name={'Description'} value={movie.description}/>
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator size={"large"} />
      )}
    </View>
  );
}


export default MovieScreen;
