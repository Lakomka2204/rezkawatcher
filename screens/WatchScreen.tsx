import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  GestureResponderEvent,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCallback} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Video, {FilterType} from 'react-native-video';
import Button from '../components/Button';
import cn from 'classnames';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';
import History from '../components/History';
import {
  Instance,
  Movie,
  getTranslationSeries,
  VideoProps,
  parseCdnUrl,
  getStream,
  Season,
  Episode,
  Translation,
  getMovie,
  getTime,
} from '../logic/movie';
import convert from 'react-native-video-cache';
import {Dropdown, IDropdownRef} from 'react-native-element-dropdown';

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
  const route = useRoute();
  const nav = useNavigation();
  const player = useRef<Video>(null);
  const qualityDropdown = useRef<IDropdownRef>(null);
  const [paused, setPause] = useState(false);
  const [muted, setMute] = useState(false);
  const [sliderVal, setSliderVal] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [ccEnabled, setCcEnabled] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [visibleTimerId, setVTimerId] = useState<NodeJS.Timeout>();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [season, setSeason] = useState<Season>();
  const [episode, setEpisode] = useState<Episode>();
  const [translation, setTranslation] = useState<Translation>();
  const [isLoading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie>();
  const [currentVideo, setCurrentVideo] = useState<VideoProps>();
  const [videoUrl, setVideoUrl] = useState<VideoProps[]>([]);
  const [cachedUrl, setCached] = useState('');
  useEffect(() => {
    async function fetch() {
      // @ts-ignore
      if (!route.params['movie']) {
        Alert.alert('No movie');
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
    }
    fetch();
  }, []);
  useEffect(() => {
    async function updateMedia() {
      if (season && episode) {
        if (!movie) return;
        const videos = await getStream(
          movie?.id,
          season?.id,
          episode?.id,
          translation?.id,
        );
        setVideoUrl(videos);
      } else {
        if (!movie) return;
        const movies = await getMovie(movie?.id, movie?.favs, translation);
        setVideoUrl(movies);
      }
    }
    updateMedia();
  }, [episode, season, translation]);
  useEffect(() => {
    if (videoUrl.length == 0) return;
    setCurrentVideo(videoUrl[0]);
    player.current?.seek(0);
  }, [videoUrl]);
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
    if (isVisible) setPause(!paused);
    else setVisible(true);
  }
  useEffect(() => {
    console.log('trying to seek', isLoading);
    if (!isLoading) player.current?.seek(currentTime);
  }, [isLoading]);
  useEffect(() => {
    return () => {
      if (visibleTimerId) clearTimeout(visibleTimerId);
    };
  }, [visibleTimerId]);
  useEffect(() => {
    if (currentVideo?.url) setCached(convert(currentVideo?.url));
  }, [currentVideo]);
  return (
    <View className="w-full h-full bg-blue-400">
      <Video
        className="absolute left-0 right-0 top-0 bottom-0 bg-blue-400"
        resizeMode="contain"
        fullscreenOrientation="landscape"
        fullscreen
        allowsExternalPlayback
        source={{uri: cachedUrl}}
        ref={player}
        paused={paused}
        muted={muted}
        onProgress={p => setCurrentTime(p.currentTime)}
        onLoad={data => {
          setTotalTime(data.duration);
          setLoading(false);
        }}
        onLoadStart={() => setLoading(true)}
        onEnd={() => {
          player.current?.seek(0);
          setPause(true);
        }}
        onError={e => console.log('VP ERROR', e.error.errorString)}
      />

      <Pressable
        onPress={handleGeneralTouch}
        onLongPress={() => setVisible(!isVisible)}
        onPressIn={handlePress}
        onPressOut={handleRelease}
        android_disableSound
        className={cn(
          'absolute align-items-center ',
          'top-8 bottom-8 left-24 right-24',
          'self-center text-center mb-0 flex flex-col',
        )}>
        {isVisible && (
          <View
            className={cn(
              'ml-auto mr-auto mt-auto mb-auto',
              'bg-black opacity-90 rounded-md py-2 px-8',
            )}>
            {isLoading ? (
              <ActivityIndicator size={'large'} />
            ) : (
              <Icon name={paused ? 'play' : 'pause'} size={64} color={'#fff'} />
            )}
          </View>
        )}
      </Pressable>
      <Pressable></Pressable>
      {isVisible && (
        <View
          className={cn(
            'absolute left-1 top-1 bg-black',
            'opacity-80 border-2 border-white rounded-md flex flex-row px-4 items-center',
          )}>
          <Button onClick={() => console.log('Open playlist')}>
            <View className="flex flex-row items-center justify-center">
              <Icon name={'bars'} solid={ccEnabled} size={30} color={'#fff'} />
              <Text className="text-white text-xl ml-1">
                {season?.name} {episode?.name} {translation?.name}
              </Text>
            </View>
          </Button>
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
              onValueChange={v => setSliderVal(v)}
              value={currentTime / totalTime}
              onResponderStart={handlePress}
              onResponderEnd={() => {
                player.current?.seek(sliderVal * totalTime);
                handleRelease();
              }}
            />
          </View>
          <View className="flex-grow-0">
            <Button
              onClick={() => setCcEnabled(!ccEnabled)}
              onLongPress={c => console.log('TOGGLE CAPTION LIST')}>
              <Icon
                style={{padding: 3, margin: 1}}
                name={'closed-captioning'}
                solid={ccEnabled}
                size={30}
                color={'#fff'}
              />
            </Button>
          </View>
          <View className="flex-grow-0">
            <Dropdown
              ref={qualityDropdown}
              data={videoUrl}
              labelField="quality"
              valueField="url"
              mode="modal"
              autoScroll
              dropdownPosition="bottom"
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
                style={{padding: 3, margin: 1}}
                name={muted ? 'volume-mute' : 'volume-up'}
                size={30}
                color={'#fff'}
              />
            </Button>
          </View>
        </View>
      )}
      <Modal
        animationType="slide"
        visible={settingsVisible}
        hardwareAccelerated
        onRequestClose={() => setSettingsVisible(!settingsVisible)}>
        <View>
          <Text>Prikol</Text>
        </View>
      </Modal>
    </View>
  );
}

export default WatchScreen;
