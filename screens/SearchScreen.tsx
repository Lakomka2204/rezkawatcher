import { View, Text, TextInput, FlatList, Alert, Animated } from 'react-native'
import React, { memo, useDeferredValue, useEffect, useRef, useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome6'
import useAppTheme from '../hooks/useAppTheme';
import TouchableCard from '../components/TouchableCard';
import { useDebounceValue } from 'usehooks-ts';
import { NavigationProps, QuickMovie } from '../utils/types';
import { Movie } from '../logic/movie';
import { useMMKVString } from 'react-native-mmkv';
import config from '../config';


export default function SearchScreen() {
  const nav = useNavigation<NavigationProp<NavigationProps, 'search'>>();
  const [host] = useMMKVString(config.keys.mainHost);
  useEffect(() => {
    nav.setOptions({
      headerShown: false,
    })
  }, []);
  const [{ theme }] = useAppTheme();
  const [instantQuery, setQuery] = useState('');
  const [query] = useDebounceValue(instantQuery, 500);
  const [results, setResults] = useState<QuickMovie[]>([]);
  useEffect(() => {
    if (!query) setResults([])
    async function getMovies() {
      if (!host) {
        Alert.alert("No host specified!");
        return;
      }
      setResults(await Movie.quickSearch(host, query));
    }
    getMovies();

  }, [query]);
  const [searchOpacity] = useState(new Animated.Value(1))
  useEffect(() => {
    Animated.timing(searchOpacity, { toValue: 0.6, duration: 150, useNativeDriver: true }).start()
  }, [instantQuery]);
  useEffect(() => {
      Animated.timing(searchOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start()
  }, [results])
  function goToSearch() {
    if (query)
      nav.navigate('searchResult', { query });
  }
  return (
    <View style={{backgroundColor:theme.colors.border}} className='h-screen'>
      <Animated.View className='flex flex-row items-center px-3' style={{
        backgroundColor:theme.colors.background}}>
        <TouchableCard onClick={() => nav.goBack()}>
          <Icon name='arrow-left' size={24} color={theme.colors.text} />
        </TouchableCard>
        <TextInput
          className='flex-grow mx-2'
          placeholder={'search'}
          clearButtonMode='always'
          autoFocus
          onChangeText={setQuery}
          onSubmitEditing={() => goToSearch()}
          value={instantQuery} />
        <TouchableCard onClick={() => setQuery('')}>
          <Icon name='xmark' size={24} color={theme.colors.text} />
        </TouchableCard>
      </Animated.View>
      <Animated.View style={{ opacity: searchOpacity }}>
        <FlatList
          data={results}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{backgroundColor:theme.colors.background}}
          renderItem={({ item }) => (
            <TouchableCard
              onClick={() => nav.navigate('movieDetails', { link: item.url })}
              className='p-2 m-1'>
              <Text style={{ color: theme.colors.text }}>{item.name}</Text>
            </TouchableCard>
          )}
        />
      </Animated.View>
    </View>
  )
}