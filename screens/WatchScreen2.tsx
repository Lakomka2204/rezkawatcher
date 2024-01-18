import { RouteProp, useFocusEffect, useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import Video from "react-native-video";
import { Episode, Movie, Season, Translation, VideoInfo, VideoProps, VideoQuality, getMovie, getStream, getTime } from "../logic/movie";
import { NavigationProps } from "../App";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/FontAwesome5";
import Button from "../components/Button";
import Slider from "@react-native-community/slider";
let hasSeries = false;
interface MenuItem {
  text: string;
  onClick: () => void;
  arrow?: 'none' | 'back' | 'forward';
  closing: boolean;
}
type Menu = MenuItem[];

const HIDEUI_TIMEOUT = 6000;
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export default function WatchScreen2() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true, 'fade');
      return () => {
        StatusBar.setHidden(false, 'fade');
      };
    }, []),
  );
  // Theme
  const { colors, dark } = useTheme();
  // Route props
  const route = useRoute<RouteProp<NavigationProps, "watch2">>();
  // Navigation prop
  const nav = useNavigation();
  // Video object ref
  const player = useRef<Video>(null);
  // Select quality ref
  const qualityDropdown = useRef<IDropdownRef>(null);

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
  const [isLoading, setLoading] = useState(false);
  // Video has ended
  const [isEnd, setEnd] = useState(false);
  // Video speed
  const [speed, setSpeed] = useState(1);
  // Video slider position
  const [slider, setSlider] = useState(0);


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
  // Back button
  const backButton: MenuItem = {
    text: "Back",
    arrow: 'back',
    onClick() {
      setSettingsMenu(initialMenu)
    },
    closing: false,
  }
  // Start menu
  let initialMenu: Menu = [
    {
      arrow: 'forward',
      text: "Speed",
      closing: false,
      onClick() {
        setSettingsMenu([
          backButton,
          ...SPEEDS.map(x => ({ text: `x${x}`, onClick() { setSpeed(x) }, closing: true }))
        ])
      }
    },
    {
      arrow: 'forward',
      text: "Quality",
      closing: false,
      onClick() {
        setSettingsMenu([
          backButton,
          ...sources?.videos.map(x => ({ text: x.quality.toString(), onClick() { setSource(x) }, closing: true })) ?? []
        ])
      }
    }
  ]
  // Settings menu
  const [settingsMenu, setSettingsMenu] = useState<Menu>(initialMenu);
  useEffect(() => {
    // Hold UI while settings menu is open
    settingsVisible ? showUI() : hideUI()
  },[settingsVisible])
  useEffect(() => {
    if (isLoading) return;
    // Go back to the timestamp when changing between qualities, don't know how will work when changing between series
    player.current?.seek(currentTime);
  },[isLoading]);
  // Update settings quality list
  useEffect(() => {
    setSettingsMenu(initialMenu);
  }, [sources])
  function hideUI() {
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
    <View style={StyleSheet.absoluteFill} className="bg-gray-600">
      <Video
        ref={player}
        fullscreenOrientation="landscape"
        fullscreen
        paused={paused}
        rate={speed}
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
          uri: source?.streamUrl ||
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
            <Icon name="step-backward" size={32} color={colors.background} />
          </Pressable>
          <Pressable className="px-9 py-6" android_disableSound
            onPress={() => setPause(!paused)}>
            {
              isLoading
                ?
                <ActivityIndicator size={32} color={colors.background} />
                :
                <Icon name={paused ? "play" : "pause"} size={32} color={colors.background} />
            }
          </Pressable>
          <Pressable className="px-9 py-6" android_disableSound>
            <Icon name="step-forward" size={32} color={colors.background} />
          </Pressable>
        </View>
      }
      {/* Playlist control */}
      {isVisible &&
        <View className="absolute top-4 left-8 right-auto bottom-auto p-2">
          <Button className="flex flex-row items-center" android_disableSound>
            <Icon name="bars" size={24} color={colors.background} />
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
              thumbTintColor={colors.background}
              minimumTrackTintColor={colors.border}
              maximumTrackTintColor={colors.background}
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
      {/* Playback settings */}
      {isVisible &&
        <View className="absolute top-4 right-8 left-auto bottom-auto p-2 flex items-end">
          <Pressable onPress={() => setSettingsVisible(!settingsVisible)}>
            <Icon name="cog" size={24} color={colors.background} />
          </Pressable>
          {
            settingsVisible &&
            <FlatList data={settingsMenu}
              className="border"
              style={{backgroundColor:colors.background,borderColor:colors.border}}
              contentContainerStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              renderItem={({ item }) => (
                <Pressable onPress={() => {
                  item.onClick();
                  if (item.closing) {
                    setSettingsMenu(initialMenu);
                    setSettingsVisible(false);
                  }
                }}
                  className="px-2 py-1 flex flex-row items-center">
                  {
                    item.arrow == "back" &&
                    <Icon style={{ paddingRight: 8 }} name="chevron-left" size={18} />
                  }
                  <Text className="text-black text-lg">{item.text}</Text>
                  {
                    item.arrow == "forward" &&
                    <Icon style={{ paddingLeft: 8 }} name="chevron-right" size={18} />
                  }
                </Pressable>
              )} />
          }
        </View>
      }

    </View>
  )
}