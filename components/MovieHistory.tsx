import React from "react";
import { HistoryMovie } from "../logic/movie";
import { Image, Text, View } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationProps } from "../utils/types";
import Button from "./Button";

const MovieHistory: React.FC<{ movie: HistoryMovie }> = ({ movie }) => {
    const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
    const { colors } = useTheme();
    function goWatchMovie() {
        nav.push('mov2',{
            link:movie.url,
            translation: movie.watchedTranslation,
            season: movie.watchedSeason,
            episode: movie.watchedEpisode
        })
    }
    return (
        <Button className="flex flex-row w-full p-1
        rounded-lg m-1"
        onClick={goWatchMovie}
            style={{ backgroundColor: colors.border }}>
            <Image
                className="h-32 w-20 rounded-lg"
                source={{ uri: movie.thumbnail }} />
            <View className="flex flex-col m-1 ml-3">
                <Text
                    style={{ color: colors.text }}
                    className="text-2xl w-auto">{movie.name}</Text>
                <Text>{movie.watchedTranslation.name}</Text>
                {
                    movie.watchedSeason && movie.watchedEpisode &&
                    <Text>{movie.watchedSeason.name} {movie.watchedEpisode.name}</Text>
                }
            </View>
        </Button>
    )
}
export default MovieHistory;