import { RouteProp, useFocusEffect, useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import Video from "react-native-video";
import { Episode, Movie, Season, Translation, VideoInfo, VideoProps, VideoQuality, getMovie, getStream, getTime } from "../logic/movie";
import { NavigationProps, Speed } from "../utils/types";
import Icon from "react-native-vector-icons/FontAwesome5";
import Button from "../components/Button";
import Slider from "@react-native-community/slider";
import Playlist from "../components/Playlist";
import { WatchTime, saveWatchTime } from "../storage/watchtime";
import { Dropdown } from "react-native-element-dropdown";
let hasSeries = false;

const HIDEUI_TIMEOUT = 6000;
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(x => new Speed(x));
const SAVE_INTERVAL = 10;
export default function WatchScreen() {
    useFocusEffect(
        useCallback(() => {
            StatusBar.setHidden(true, 'fade');
            return () => {
                StatusBar.setHidden(false, 'fade');
            };
        }, []),
    );
    // Theme
    const { colors } = useTheme();
    // Themed styles
    const styles = makeStyles(colors);
    // Route props
    const route = useRoute<RouteProp<NavigationProps, "watch">>();
    // Navigation prop
    const nav = useNavigation();
    // Video object ref
    const player = useRef<Video>(null);

    // Video paused
    const [paused, setPause] = useState(false);
    // Current video current time
    const [currentTime, setCurrentTime] = useState(0);
    // Current video total time
    const [totalTime, setTotalTime] = useState(0);
    // UI hide timer
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    // UI visible
    const [isVisible, setVisible] = useState(false);
    // UI playlist visible
    const [playlistVisible, setPlaylistVisible] = useState(false);
    // Video loading
    const [isLoading, setLoading] = useState(true);
    // Video has ended
    const [isEnd, setEnd] = useState(false);
    // Video speed
    const [speed, setSpeed] = useState<Speed>(new Speed(1));

    // Current movie object
    const [movie, setMovie] = useState<Movie>()
    // Current season object
    const [season, setSeason] = useState<Season>();
    // Current episode object
    const [episode, setEpisode] = useState<Episode>();
    // Current translation object
    const [translation, setTranslation] = useState<Translation>();
    // All available video qualities with urls
    const [sources, setSources] = useState<VideoInfo>();
    // Current video source
    const [source, setSource] = useState<VideoProps>();
    // Selected quality
    // Todo replace value from asyncstorage
    const [quality, setQuality] = useState<VideoQuality>('360p');
    // Settings menu visibile
    const [settingsVisible, setSettingsVisible] = useState(false);
    // Watch time
    const [wt, setWT] = useState<WatchTime | undefined>(route.params?.watchTime);
    useEffect(() => {
        // Hold UI while settings menu is open
        settingsVisible ? showUI() : hideUI()
    }, [settingsVisible])
    useEffect(() => {
        if (isLoading) return;
        // Go back to the timestamp when changing between qualities,
        // don't know how will work when changing between series
        player.current?.seek(currentTime);
    }, [isLoading]);
    // Update settings quality list
    // Reset playtime when changing between series
    useEffect(() => {
        setCurrentTime(0);
        player.current?.seek(0, 0);
    }, [season, episode])
    // save playback to storage every X seconds
    // todo replace X seconds with saved settings value
    useEffect(() => {
        if (currentTime == 0) return;
        if (!movie) return;
        //! every X seconds save playback 
        if (currentTime % SAVE_INTERVAL > (SAVE_INTERVAL - 0.4)) {
            console.log('saving playback', currentTime, quality);
            saveWatchTime(movie.id, { secondsWatched: currentTime, videoQuality: quality });
        }
    }, [currentTime]);
    function hideUI() {
        setSettingsVisible(false);
        setTimer(
            setTimeout(() => {
                setVisible(false);
                clearTimeout(timer);
            }, HIDEUI_TIMEOUT)
        )
    }
    function showUI() {
        if (timer) clearTimeout(timer);
    }
    function toggleUI() {
        setVisible(!isVisible);
    }
    useEffect(() => {
        if (totalTime == 0) return;
        console.log('loading', isLoading, 'wt', wt, 'current', currentTime, 'total', totalTime);
        if (wt) {
            player.current?.seek(wt?.secondsWatched ?? 0, 0)
            // setCurrentTime(wt.secondsWatched);
            setWT(undefined);
        }
    }, [totalTime]);
    // Grabbing parameters from route
    useEffect(() => {
        if (!route.params) {
            Alert.alert("Error", "No movie was provided!");
            return nav.goBack();
        }
        const pMovie = route.params.movie;
        const pSeason = route.params.season;
        const pEpisode = route.params.episode;
        const pTranslation = route.params.translation;
        if (wt)
            setQuality(wt.videoQuality)
        console.log('grabbed info', pMovie.name, pSeason?.name, pEpisode?.name, pTranslation.id);
        if (!movie)
            setMovie(pMovie);
        if (!translation)
            setTranslation(pTranslation);
        if (!season)
            setSeason(pSeason);
        if (!episode)
            setEpisode(pEpisode);
    }, []);
    // Updating media sources on translation/season/episode change
    useEffect(() => {
        async function fetchMedia() {
            if (!translation) return;
            // check if movie has seasons or eps, if it has,
            // grabbing video sources from one endpoint, otherwise from another
            // w/ different params
            if (season && episode) {
                if (!movie) return;
                const videoSources = await getStream(
                    movie.id,
                    season.id,
                    episode.id,
                    translation.id
                );
                hasSeries = true;
                setSources(videoSources);
            }
            else {
                if (!movie) return;
                const movieSources = await getMovie(
                    movie.id,
                    movie.favs,
                    translation
                );
                setSources(movieSources);
                hasSeries = false;
            }
        }
        fetchMedia();
    }, [translation, season, episode]);
    // Change media if video sources (sources) changed
    useEffect(() => {
        if (sources?.videos.length == 0) return;
        const preferredQuality = sources?.videos.find(x => x.quality == quality);
        if (preferredQuality)
            setSource(preferredQuality);
        else
            setSource(sources?.videos[0]);
    }, [sources]);

    return (
        <View style={StyleSheet.absoluteFill} className="bg-black">
            <Video
                ref={player}
                fullscreenOrientation="landscape"
                fullscreen
                paused={paused}
                rate={speed._x}
                className="absolute left-0 right-0 top-0 bottom-0"
                resizeMode="contain"
                onSeek={() => {
                    if (isEnd) setPause(false);
                }}
                onPlaybackStalled={() => setLoading(true)}
                onPlaybackResume={() => setLoading(false)}
                onReadyForDisplay={() => setLoading(false)}
                allowsExternalPlayback
                onProgress={p => setCurrentTime(p.currentTime)}
                onLoad={data => {
                    setTotalTime(data.duration);
                    setLoading(false);
                }}
                onLoadStart={() => setLoading(true)}
                onEnd={() => {
                    setPause(true);
                    setEnd(true);
                    setVisible(true);
                }}
                source={{
                    uri: source?.ukrtelCdn ||
                        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                }}
            />
            <Pressable
                onPressIn={showUI}
                onPressOut={hideUI}
                onPress={toggleUI}
                android_disableSound
                style={StyleSheet.absoluteFill}
            />
            {/* UI */}
            {isVisible &&
                <View
                    style={StyleSheet.absoluteFill}
                    className="opacity-50 bg-black"
                    focusable={false}
                    pointerEvents="none"
                />
            }
            {/* Play buttons */}
            {isVisible &&
                <View style={StyleSheet.absoluteFill} className="flex flex-row justify-evenly items-center">
                    <Pressable className="px-9 py-6" android_disableSound>
                        <Icon name="step-backward" size={32} color={"white"} />
                    </Pressable>
                    <Pressable className="px-9 py-6" android_disableSound
                        onPress={() => setPause(!paused)}>
                        {
                            isLoading
                                ?
                                <ActivityIndicator size={32} color={"white"} />
                                :
                                <Icon name={paused ? "play" : "pause"} size={32} color={"white"} />
                        }
                    </Pressable>
                    <Pressable className="px-9 py-6" android_disableSound>
                        <Icon name="step-forward" size={32} color={"white"} />
                    </Pressable>
                </View>
            }
            {/* Playlist control */}
            {isVisible &&
                <View className="absolute top-4 left-8 right-auto bottom-auto p-2">
                    <Button className="flex flex-row items-center" android_disableSound onClick={() => setPlaylistVisible(true)}>
                        <Icon name="bars" size={24} color={"white"} />
                        <Text className="text-white outline text-xl mx-2">{translation?.name} / {season?.name} {episode?.name}</Text>
                    </Button>
                </View>
            }
            {/* Timeline */}
            {isVisible &&
                <View className="absolute bottom-4 py-4 px-6 flex flex-row w-full items-center">
                    <Text className="flex-grow-0 text-white ">{getTime(currentTime)} / {getTime(totalTime)}</Text>
                    <View className="flex-grow w-auto">
                        <Slider
                            thumbTintColor={"white"}
                            minimumTrackTintColor={"white"}
                            maximumTrackTintColor={colors.border}
                            value={currentTime / totalTime}
                            onSlidingStart={showUI}
                            onSlidingComplete={(v) => {
                                player.current?.seek(v * totalTime);
                                hideUI()
                            }}
                        />
                    </View>
                </View>
            }
            {
                isVisible &&
                <View className="absolute top-4 right-8 left-auto bottom-auto p-2 flex flex-row justify-end w-full">
                    <Dropdown
                        style={styles.dd}
                        containerStyle={styles.ddContainer}
                        selectedTextStyle={styles.ddText}
                        placeholderStyle={styles.ddText}
                        backgroundColor="#0006"
                        activeColor={colors.border}
                        data={SPEEDS}
                        placeholder="Speed"
                        labelField="x"
                        valueField="x"
                        value={speed}
                        onChange={(s) => setSpeed(s)} />
                    {
                        sources && sources.videos && sources.videos.length > 0 &&
                        <Dropdown
                            style={styles.dd}
                            containerStyle={styles.ddContainer}
                            selectedTextStyle={styles.ddText}
                            placeholderStyle={styles.ddText}
                            backgroundColor="#0006"
                            activeColor={colors.border}
                            placeholder="Quality"
                            data={sources.videos}
                            labelField='quality'
                            valueField="streamUrl"
                            value={source}
                            onChange={(x) => setSource(x)} />
                    }
                </View>
            }
            {/* Playback settings */}

            {playlistVisible &&
                <Pressable style={StyleSheet.absoluteFill}
                    onPress={() => setPlaylistVisible(false)}
                >
                    <ScrollView className="absolute left-0 top-0 bottom-0 bg-black opacity-80 w-1/2 max-w-screen-sm p-3">
                        <Playlist
                            returnFn={({ type, item }) => {
                                switch (type) {
                                    case "series":
                                        setSeason(item.season);
                                        setEpisode(item.episode);
                                    case 'movie':
                                        setTranslation(item.translation);
                                        break;
                                }
                                setPlaylistVisible(false);
                            }}
                            selected={{
                                episode: episode?.id,
                                season: season?.id,
                                translation: translation?.id
                            }}
                            level={0}
                            items={movie?.translators.map(x => ({
                                name: x.name,
                                translation: x,
                                type: "translation"
                            })) ?? []}
                            info={{ favs: movie?.favs, id: movie!.id }}
                            type={hasSeries ? 'series' : 'movie'}
                        />
                    </ScrollView>
                </Pressable>
            }
        </View>
    )
}
const makeStyles = (colors: any) => StyleSheet.create({
    dd: { minWidth: '10%', backgroundColor: '#0004', borderWidth: 2, borderColor: '#000a', paddingHorizontal: 4 },
    ddContainer: { minWidth: '50%', backgroundColor: colors.background },
    ddText: { color: colors.text }
})