import { RouteProp, useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from "react-native";
import { NavigationProps } from "../utils/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Episode, Movie, Season, Translation, getHtmlFromURL, getTime, getTranslationSeries } from "../logic/movie";
import Button from "../components/Button";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";
import { addToHistory } from "../storage/history";
import { WatchTime, getWatchTime } from "../storage/watchtime";

export default function MovieScreen2() {
    const { colors } = useTheme();
    const route = useRoute<RouteProp<NavigationProps, 'mov2'>>();
    const nav = useNavigation<NativeStackNavigationProp<NavigationProps, 'mov2'>>();
    if (!route.params?.link) {
        Alert.alert("Error", "No movie was provided!");
        nav.goBack();
        return;
    }

    // Movie url from route
    const movieLink = route.params.link;
    // Retrevied movie
    const [movie, setMovie] = useState<Movie>();
    // Selected translation
    const [translation, setTranslation] = useState<Translation | undefined>(route.params.translation);
    // Fetched seasons
    const [seasons, setSeasons] = useState<Season[]>([]);
    // Selected season
    const [season, setSeason] = useState<Season | undefined>(route.params.season);
    // Selected episode
    const [episode, setEpisode] = useState<Episode | undefined>(route.params.episode);
    // Last watch time
    const [watchTime, setWT] = useState<WatchTime>();
    // Initial movie fetch
    useEffect(() => {
        async function fetchMovie() {
            const html = await getHtmlFromURL(movieLink);
            const retrievedMovie = new Movie(html);
            setMovie(retrievedMovie);
            nav.setOptions({ title: retrievedMovie.name ?? "Loading" });
        }
        if (!movie) fetchMovie();
    }, []);
    // Check time when stopped last time playing when movie loads
    useEffect(() => {
        if (!movie) return;
        const wt = getWatchTime(movie?.id);
        console.log('got WT',wt);
        if (!wt) return;
        setWT(wt);
    }, [movie]);
    // Get seasons & episodes when changing translators
    useEffect(() => {
        async function getTranslation() {
            if (!movie || !translation) return;
            const seasons = await getTranslationSeries(
                movie.id,
                translation,
                movie?.favs
            );
            setSeasons(seasons);
            setSeason(route.params?.season);
        }
        getTranslation();
    }, [translation, movie]);
    function goWatchMovie(wt?:WatchTime) {
        if (!translation)
            return Alert.alert("No translation", "Please select translation");
        if (seasons.length > 0 && !season)
            return Alert.alert('No episode', 'Please select season & episode');

        if (movie) {
            addToHistory({
                enabled: true,
                id: movie.id,
                name: movie.name,
                thumbnail: movie.thumbnail,
                type: movie.type,
                url: movie.url,
                watchedTranslation: translation,
                whenWatched: Date.now(),
                watchedSeason: season,
                watchedEpisode: episode,
            });
            nav.push("watch", {
                movie,
                translation,
                season, episode,
                watchTime:wt
            });
        }
    }
    return (
        <View>
            {movie ? (
                <View className="flex flex-col w-full h-full">
                    <ScrollView className="flex flex-grow min-h-min"
                        contentContainerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text
                            style={{ color: colors.text }}
                            className="text-4xl font-semibold
                            m-2 mb-1 text-center">
                            {movie.name}
                        </Text>
                        <Text
                            className="text-2xl font-semibold
                        m-1 text-center text-gray-400">
                            {movie.originalName}
                        </Text>
                        <Image
                            source={{
                                cache: 'force-cache',
                                uri: movie.thumbnail
                            }}
                            className="h-96 w-60" />
                        <Text style={{
                            color: colors.text
                        }}
                            className="text-center m-1 text-lg">
                            {movie.description}
                        </Text>
                    </ScrollView>
                    <View className="flex-grow-0 border-x-2 border-t-2 rounded-t-md" style={{ borderColor: colors.text }}>
                        <View className="flex flex-col">
                            {
                                watchTime &&
                                <Button style={{backgroundColor:colors.primary}}
                                onClick={() => goWatchMovie(watchTime)}>
                                    <Text className="text-xl text-center" style={{color:colors.text}}>Continue watching from {getTime(watchTime?.secondsWatched)}</Text>
                                </Button>
                            }
                            {/* Dropdown for translations */}
                            {/* // todo make buttons instead of dropdowns and make dd's hidden, buttons text make current selection */}
                            <Dropdown

                                data={movie.translators}
                                style={{
                                    backgroundColor: colors.border,
                                    flexGrow: 1,
                                    margin: 1
                                }}
                                value={translation}
                                placeholder="Translation"
                                selectedTextStyle={{ color: colors.text }}
                                placeholderStyle={{ color: colors.text }}
                                containerStyle={{ backgroundColor: colors.background }}
                                backgroundColor="#0006"
                                activeColor={colors.border}
                                labelField="name"
                                mode="modal"
                                valueField="id"
                                onChange={(t) => setTranslation(t)}
                            />
                            {/* Dropdown for seasons */}
                            {
                                seasons.length > 0 &&
                                <Dropdown
                                    data={seasons}
                                    style={{
                                        backgroundColor: colors.border,
                                        flexGrow: 1,
                                        margin: 1
                                    }}
                                    containerStyle={{ backgroundColor: colors.background }}
                                    selectedTextStyle={{ color: colors.text }}
                                    placeholderStyle={{ color: colors.text }}
                                    activeColor={colors.border}
                                    backgroundColor="#0006"
                                    value={season}
                                    placeholder="Season"
                                    labelField="name"
                                    valueField="id"
                                    mode="modal"
                                    onChange={(s) => setSeason(s)}
                                />
                            }
                            {/* Dropdown for episodes */}
                            {
                                season?.episodes && season.episodes.length > 0 &&
                                <Dropdown
                                    data={season.episodes}
                                    style={{
                                        backgroundColor: colors.border,
                                        flexGrow: 1,
                                        margin: 1
                                    }}
                                    containerStyle={{ backgroundColor: colors.background }}
                                    activeColor={colors.border}
                                    selectedTextStyle={{ color: colors.text }}
                                    placeholderStyle={{ color: colors.text }}
                                    backgroundColor="#0006"
                                    value={episode}
                                    placeholder="Episode"
                                    labelField="name"
                                    valueField="id"
                                    mode="modal"
                                    onChange={(e) => setEpisode(e)}
                                />
                            }
                        </View>
                        <Button onClick={goWatchMovie}
                            style={{
                                backgroundColor: colors.border
                            }}>
                            <Text className="text-center text-4xl font-bold"
                                style={{ color: colors.text }}>WATCH</Text>
                        </Button>
                    </View>
                </View>
            )
                : <ActivityIndicator className="m-2" color={colors.text} size={'large'} />
            }
        </View>
    );
}