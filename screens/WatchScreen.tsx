import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useCallback} from 'react';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Video from 'react-native-video';
import Button from '../components/Button';
import cn from 'classnames';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';
import {
  Movie,
  VideoProps,
  getStream,
  Season,
  Episode,
  Translation,
  getMovie,
  getTime,
  VideoInfo,
  Subtitles,
} from '../logic/movie';
import convert from 'react-native-video-cache';
import {Dropdown, IDropdownRef} from 'react-native-element-dropdown';
import {NavigationProps} from '../App';
import Playlist from '../components/Playlist';
let isSeries = false;

function WatchScreen() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true, 'fade');
      return () => {
        StatusBar.setHidden(false, 'fade');
      };
    }, []),
  );
  const timeout = 6000;
  const route = useRoute<RouteProp<NavigationProps>>();
  const nav = useNavigation();
  const player = useRef<Video>(null);
  const qualityDropdown = useRef<IDropdownRef>(null);
  const subtitleDropdown = useRef<IDropdownRef>(null);
  const [paused, setPause] = useState(false);
  const [muted, setMute] = useState(false);
  const [sliderVal, setSliderVal] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [ccEnabled, setCcEnabled] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [visibleTimerId, setVTimerId] = useState<NodeJS.Timeout>();
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [season, setSeason] = useState<Season>();
  const [episode, setEpisode] = useState<Episode>();
  const [translation, setTranslation] = useState<Translation>();
  const [isLoading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie>();
  const [currentVideo, setCurrentVideo] = useState<VideoProps>();
  const [currentSubtitles, setCurrentSubs] = useState<Subtitles>();
  const [videoUrl, setVideoUrl] = useState<VideoInfo>({
    videos: [],
    subtitles: [],
  });
  const [episodeIndex, setEpIndex] = useState(-1);
  const [isEnd, setEnd] = useState(false);
  const [cachedUrl, setCached] = useState(
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  );
  function handleRelease() {
    setVTimerId(
      setTimeout(() => {
        setVisible(false);
        clearTimeout(visibleTimerId);
      }, timeout),
    );
  }
  function handlePress() {
    if (visibleTimerId) clearTimeout(visibleTimerId);
  }
  function handleGeneralTouch() {
    setVisible(!isVisible);
  }
  useEffect(() => {
    player.current?.props.textTracks?.pop();
    player.current?.props.textTracks?.push({
      type: 'text/vtt',
      uri: currentSubtitles!.url,
      language: currentSubtitles?.language,
      title: currentSubtitles?.displayLanguage,
    });
  }, [currentSubtitles]);
  useEffect(() => {
    // @ts-ignore
    if (!route.params['movie']) {
      Alert.alert('No movie was provided!');
      nav.goBack();
      return;
    }
    // @ts-ignore
    const paramMovie = route.params['movie'] as Movie;
    setMovie(paramMovie);
    // @ts-ignore
    const paramSeason = route.params['season'] as Season;
    setSeason(paramSeason);
    // @ts-ignore
    const paramEpisode = route.params['episode'] as Episode;
    setEpisode(paramEpisode);
    // @ts-ignore
    const paramTranslation = route.params['translation'] as Translation;
    setTranslation(paramTranslation);
  }, []);
  useEffect(() => {
    async function updateMedia() {
      if (!translation) return;

      if (season && episode) {
        if (!movie) return;
        const videos = await getStream(
          movie?.id,
          season?.id,
          episode?.id,
          translation?.id,
        );
        isSeries = true;
        setVideoUrl(videos);
      } else {
        if (!movie) return;
        const movies = await getMovie(movie?.id, movie?.favs, translation);
        setVideoUrl(movies);
      }
      if (!isSeries) return setEpIndex(-1);
      // is first episode
      const episodeIndex = season?.episodes.indexOf(episode!);
      setEpIndex(episodeIndex ?? -1);
    }
    updateMedia();
  }, [episode, season, translation]);
  useEffect(() => {
    if (videoUrl?.videos.length == 0) return;
    player.current?.seek(0);
    setCurrentTime(0);
    setSliderVal(0);
    setCurrentVideo(videoUrl?.videos[0]);
    if (videoUrl.subtitles.length > 0)
      setCurrentSubs(
        videoUrl.subtitles.find(x => x.language === videoUrl.defaultSubtitle) ??
          videoUrl.subtitles[0],
      );
  }, [videoUrl]);
  useEffect(() => {
    if (currentVideo?.url) {
      setCurrentTime(0);
      setSliderVal(0);
      setCached(convert(currentVideo?.url));
    }
  }, [currentVideo]);
  useEffect(() => {
    if (isLoading) return;
    player.current?.seek(currentTime);
  }, [isLoading]);

  useEffect(() => {
    if (!paused && isEnd) setEnd(false);
  }, [paused]);

  useEffect(() => {
    return () => {
      if (visibleTimerId) clearTimeout(visibleTimerId);
    };
  }, [visibleTimerId]);

  return (
    <View className="w-full h-full bg-black">
      <Video
        className="absolute left-0 right-0 top-0 bottom-0"
        resizeMode="contain"
        fullscreenOrientation="landscape"
        fullscreen
        onSeek={() => {
          if (isEnd) setPause(false);
        }}
        onPlaybackStalled={() => setLoading(true)}
        onPlaybackResume={() => setLoading(false)}
        onReadyForDisplay={() => setLoading(false)}
        allowsExternalPlayback
        source={{uri: cachedUrl}}
        ref={player}
        paused={paused}
        muted={muted}
        selectedTextTrack={{
          type: ccEnabled ? 'index' : 'disabled',
          value: ccEnabled ? 0 : undefined,
        }}
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
        onError={e => console.log('VP ERROR', e.error.errorString)}
      />
      <Pressable
        onPress={handleGeneralTouch}
        onPressIn={handlePress}
        onPressOut={handleRelease}
        android_disableSound
        className={cn(
          'absolute top-8 bottom-8 left-8 right-8 flex-1 justify-center',
        )}>
        {isVisible && (
          <View className="flex flex-row items-center justify-around">
            {isEnd ? (
              <>
                <Pressable
                  android_disableSound
                  onPress={() => {
                    player.current?.seek(0);
                    setPause(false);
                  }}
                  className={cn('bg-black opacity-90 rounded-md py-2 px-8')}>
                  <Icon name="redo" size={64} color={'#fff'} />
                </Pressable>
                {episodeIndex < season!.episodes.length - 1 && (
                  <Pressable
                    android_disableSound
                    onPress={() => {
                      setEpisode(season?.episodes[episodeIndex + 1]);
                      setPause(false);
                    }}
                    className={cn('bg-black opacity-90 rounded-md py-2 px-8')}>
                    <View className=" flex flex-col items-center">
                      <Icon name="step-forward" size={40} color={'#fff'} />
                      <Text className="text-white text-lg">
                        {season?.episodes[episodeIndex + 1].name}
                      </Text>
                    </View>
                  </Pressable>
                )}
              </>
            ) : (
              <>
                <Pressable
                  android_disableSound
                  onPress={() => {
                    if (!isLoading) player.current?.seek(currentTime - 5);
                  }} //todo replace with changeable value
                  className={cn('bg-black opacity-90 rounded-md py-2 px-8')}>
                  <Icon name={'backward'} size={64} color={'#fff'} />
                </Pressable>
                <Pressable
                  android_disableSound
                  onPress={() => {
                    if (!isLoading) setPause(!paused);
                  }}
                  className={cn('bg-black opacity-90 rounded-md py-2 px-8')}>
                  {isLoading ? (
                    <ActivityIndicator size={64} color={'white'} />
                  ) : (
                    <Icon
                      name={paused ? 'play' : 'pause'}
                      size={64}
                      color={'#fff'}
                    />
                  )}
                </Pressable>
                <Pressable
                  android_disableSound
                  onPress={() => {
                    if (!isLoading) player.current?.seek(currentTime + 5);
                  }} //todo replace with changeable value
                  className={cn('bg-black opacity-90 rounded-md py-2 px-8')}>
                  <Icon name={'forward'} size={64} color={'#fff'} />
                </Pressable>
              </>
            )}
          </View>
        )}
      </Pressable>
      {isVisible && (
        <View className="absolute left-1 top-1">
          <Button onClick={() => setPlaylistVisible(!playlistVisible)}>
            <View className="bg-black opacity-80 border-2 border-white rounded-md flex flex-row px-4 items-center">
              <View className="flex flex-row items-center justify-center">
                <Icon
                  name={'bars'}
                  solid={ccEnabled}
                  size={30}
                  color={'#fff'}
                />
                <Text className="text-white text-xl ml-1">
                  {season?.name} {episode?.name} {translation?.name}
                </Text>
              </View>
            </View>
          </Button>
        </View>
      )}
      {isVisible && isSeries && (
        <View
          className={cn(
            'absolute right-1 top-1',
            'bg-black opacity-80 border-2 border-white rounded-md flex flex-row items-center',
          )}>
          {episodeIndex > 0 && (
            <View className="p-2 py-1">
              <Button
                onClick={() => {
                  setEpisode(season?.episodes[episodeIndex - 1]);
                  setPause(false);
                }}>
                <Icon name="fast-backward" size={36} color={'white'} />
              </Button>
            </View>
          )}
          {episodeIndex < season!.episodes.length - 1 && (
            <View className="p-2 py-1">
              <Button
                onClick={() => {
                  setEpisode(season?.episodes[episodeIndex + 1]);
                  setPause(false);
                }}>
                <Icon name="fast-forward" size={36} color={'white'} />
              </Button>
            </View>
          )}
        </View>
      )}
      {isVisible && (
        <View
          className={cn(
            'absolute right-1 left-1 bottom-1 bg-black',
            'opacity-80 border-2 border-white rounded-md flex flex-row px-4 items-center justify-between',
          )}>
          <Text className="text-white flex-grow-0">
            {getTime(currentTime)}
            {' / '}
            {getTime(totalTime)}
          </Text>
          <View className={'flex-grow'}>
            <Slider
              thumbTintColor="white"
              minimumTrackTintColor="#ccc"
              maximumTrackTintColor="white"
              onValueChange={v => setSliderVal(v)}
              value={currentTime / totalTime}
              onResponderStart={handlePress}
              onResponderEnd={() => {
                player.current?.seek(sliderVal * totalTime);
                handleRelease();
              }}
            />
          </View>
          {videoUrl.subtitles.length > 0 && (
            <View className="flex-grow-0">
              <Dropdown
                ref={subtitleDropdown}
                data={videoUrl.subtitles}
                containerStyle={styles.dropdown}
                renderItem={item => {
                  return (
                    <View className="p-1 m-2">
                      <Text
                        className={cn(
                          'text-white',
                          currentSubtitles?.language === item.language //todo make state for current subtitle
                            ? 'font-bold text-xl'
                            : 'text-lg',
                        )}>
                        {item.displayLanguage}
                      </Text>
                    </View>
                  );
                }}
                labelField={'displayLanguage'}
                valueField={'url'}
                mode="modal"
                autoScroll
                keyboardAvoiding
                renderRightIcon={v => null}
                renderLeftIcon={v => (
                  <Button
                    onClick={() => setCcEnabled(!ccEnabled)}
                    onLongPress={() => subtitleDropdown.current?.open()}>
                    <Icon
                      name={'closed-captioning'}
                      solid={ccEnabled}
                      size={30}
                      color={'#fff'}
                    />
                  </Button>
                )}
                onChange={changedItem => setCurrentSubs(changedItem)}
              />
            </View>
          )}
          <View className="flex-grow-0">
            <Dropdown
              ref={qualityDropdown}
              data={videoUrl.videos}
              containerStyle={styles.dropdown}
              renderItem={item => {
                return (
                  <View className="p-1 m-2">
                    <Text
                      className={cn(
                        'text-white',
                        currentVideo?.quality === item.quality
                          ? 'font-bold text-xl'
                          : 'text-lg',
                      )}>
                      {item.quality}
                    </Text>
                  </View>
                );
              }}
              labelField="quality"
              valueField="url"
              mode="modal"
              autoScroll
              keyboardAvoiding
              renderRightIcon={v => null}
              renderLeftIcon={v => (
                <Button onClick={() => qualityDropdown.current?.open()}>
                  <Icon name={'cog'} size={30} color={'#fff'} />
                </Button>
              )}
              onChange={changedItem => setCurrentVideo(changedItem)}
            />
          </View>
          <View className="flex-grow-0">
            <Button onClick={() => setMute(!muted)}>
              <Icon
                style={styles.icon}
                name={muted ? 'volume-mute' : 'volume-up'}
                size={30}
                color={'#fff'}
              />
            </Button>
          </View>
        </View>
      )}
      {playlistVisible && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setPlaylistVisible(false)}>
          <ScrollView className="absolute left-0 top-0 bottom-0 bg-black opacity-80 w-1/2 max-w-screen-sm p-3">
            <Playlist
              returnFn={({type, item}) => {
                switch (type) {
                  case 'series':
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
                translation: translation?.id,
              }}
              level={0}
              items={movie!.translators.map(x => ({
                name: x.name,
                translation: x,
                type: 'translation',
              }))}
              info={{favs: movie!.favs, id: movie!.id}}
              type={isSeries ? 'series' : 'movie'}
            />
          </ScrollView>
        </Pressable>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  dropdown: {
    borderRadius: 6,
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'black',
    opacity: 0.8,
  },
  icon: {padding: 3, margin: 1},
});
export default WatchScreen;
