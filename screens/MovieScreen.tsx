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
import { Movie, getHtmlFromURL } from "../logic/movie";
import cn from "classnames";
import MovieProperty from "../components/MovieProperty";
import { FlatList } from "react-native";
import Rating from "../components/RatingBubble";
import Button from "../components/Button";
function MovieScreen(/* {MovieObject as param}*/) {
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
  const [movie, setMovie] = useState<Movie>();
  async function set() {
    const html = await getHtmlFromURL(movieLink);
    setMovie(new Movie(html));
  }
  useEffect(() => {
    if (!movie) set();
  }, []);
  nav.setOptions({ title: movie?.name ?? "Loading" });
  function goWatchMovie() {
    // @ts-ignore
    nav.navigate('watch',{movie: movie});
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
          <View className={'bg-yellow-200 border-gray-500 border-2 rounded-lg m-4 w-10/12'}>
          <Button onClick={goWatchMovie}>
            <Text className={'text-3xl p-1 text-center font-bold text-black'}>WATCH</Text>
          </Button>
          </View>
          {/* <View className={"flex flex-row items-center"}>
            <FlatList
            contentContainerStyle={{flexDirection:'row', alignItems:'center', justifyContent:'center', gap:3}}
             data={movie.ratings}
             renderItem={(item) => (<Rating key={item.index} name={item.item.name} score={item.item.score}/>)}/>
            
          </View> */}
          <View className={'flex w-screen'}>
            <MovieProperty name={'Release date'} value={movie.releaseDate ?? ""}/>
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
