import { RouteProp, useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from "react-native";
import { NavigationProps } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Episode, Movie, Season, Translation, getHtmlFromURL, getTranslationSeries } from "../logic/movie";
import Button from "../components/Button";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";

export default function MovieScreen2() {
    const { colors } = useTheme();
    const route = useRoute<RouteProp<NavigationProps, 'mov'>>();
    const nav = useNavigation<NativeStackNavigationProp<NavigationProps, 'mov'>>();
    if (!route.params?.link) {
        Alert.alert("Error", "No movie was provided!");
        nav.goBack();
        return;
    }
    // Translation dropdown ref
    const translationDropdown =  useRef<IDropdownRef>(null);
    const seasonDropdown =  useRef<IDropdownRef>(null);
    const episodeDropdown =  useRef<IDropdownRef>(null);
    // Movie url from route
    const movieLink = route.params.link;
    // Loading indicator
    const [seasonLoading, setSeasonLoading] = useState(false);
    // Retrevied movie
    const [movie, setMovie] = useState<Movie>();
    // Selected translation
    const [translation, setTranslation] = useState<Translation>();
    // Fetched seasons
    const [seasons, setSeasons] = useState<Season[]>([]);
    // Selected season
    const [season, setSeason] = useState<Season>();
    // Fetched episodes
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    // Selected episode
    const [episode, setEpisode] = useState<Episode>();
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
    // Get seasons & episodes when changing translators
    useEffect(() => {
        async function getTranslation() {
            try {
                setSeasonLoading(true);
                const tr = translation ?? movie?.translators[0];
                if (tr) {
                    const seasons = await getTranslationSeries(
                        movie?.id!,
                        tr,
                        movie?.favs
                    );
                    setSeasons(seasons);
                    // Clear previous selected season if existed
                    setSeason(undefined);
                }
            }
            finally {
                setSeasonLoading(false);
            }
        }
        getTranslation();
    }, [translation]);
    // Open next dropdown for seasons otherwise go watch movie
    useEffect(() => {
        if (seasons.length == 0 && movie)
            goWatchMovie();
        else
        seasonDropdown.current?.open();
    },[seasons]);
    // Open episode selector when season is selected
    useEffect(() => {
        if (season) {
            setEpisodes(season.episodes);
            episodeDropdown.current?.open();
        }
    },[season]);
    // Go watch movie when episode is selected
    useEffect(() => {
        if (episode)
        goWatchMovie();
    },[episode]);
    function goWatchMovie() {
        if (!translation)
            return Alert.alert("No translation", "Please select translation");
        if (seasons.length > 0 && !season)
            return Alert.alert('No translation', 'Please select season & episode');
        if (movie)
            nav.push("watch", {
                movie,
                translation,
                season, episode
            });
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
                            cache:'force-cache',
                            uri:movie.thumbnail
                            }}
                            className="h-96 w-60"/>
                            <Text style={{
                                color:colors.text
                            }}
                            className="text-center m-1 text-lg">
                                {movie.description}
                            </Text>
                    </ScrollView>
                    <View className="flex-grow-0 py-1" style={{backgroundColor:colors.border}}>
                        {/* Dropdown for translations */}
                        <Dropdown
                        ref={translationDropdown}
                        data={movie.translators}
                        style={{marginHorizontal:24, height:0}}
                        selectedTextStyle={{display:"none"}}
                        containerStyle={{backgroundColor:colors.background}}
                        backgroundColor="#0006"
                        activeColor={colors.border}
                        placeholder=""
                        iconStyle={{display:'none'}}
                        labelField="name"
                        mode="modal"
                        valueField="id"
                        onChange={(t) => setTranslation(t)}
                        />
                        {/* Dropdown for seasons */}
                        <Dropdown
                        ref={seasonDropdown}
                        data={seasons}
                        style={{marginHorizontal:24, height:0}}
                        selectedTextStyle={{display:"none"}}
                        containerStyle={{backgroundColor:colors.background}}
                        backgroundColor="#0006"
                        activeColor={colors.border}
                        placeholder=""
                        iconStyle={{display:'none'}}
                        labelField="name"
                        mode="modal"
                        valueField="id"
                        onChange={(s) => setSeason(s)}
                        />
                        {/* Dropdown for episodes */}
                        <Dropdown
                        ref={episodeDropdown}
                        data={episodes}
                        style={{marginHorizontal:24, height:0}}
                        selectedTextStyle={{display:"none"}}
                        containerStyle={{backgroundColor:colors.background}}
                        backgroundColor="#0006"
                        activeColor={colors.border}
                        placeholder=""
                        iconStyle={{display:'none'}}
                        labelField="name"
                        mode="modal"
                        valueField="id"
                        onChange={(e) => setEpisode(e)}
                        />
                            <Button onClick={() => translationDropdown.current?.open()}>
                                <Text className="text-center text-4xl font-bold"
                                style={{color:colors.text}}>WATCH</Text>
                            </Button>
                    </View>
                </View>
            )
                : <ActivityIndicator className="m-2" color={colors.text} size={'large'} />
            }
        </View>
    );
}