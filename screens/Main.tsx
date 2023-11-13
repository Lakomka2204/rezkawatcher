import React, {useEffect, useState} from 'react';
import Title from '../components/Title';
import SearchBar from '../components/SearchBar';
import {Appearance, TouchableOpacity, View} from 'react-native';
import History from '../components/History';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {NavigationProps} from '../App';

function Main() {
  const nav = useNavigation<NavigationProp<NavigationProps>>();
  const route = useRoute<RouteProp<NavigationProps>>();
  const {colors, dark} = useTheme();
  useEffect(() => {
    nav.setOptions({
      headerTitleAlign: 'center',
      headerTitle() {
        return route?.params &&
          // @ts-ignore
          route?.params['search'] == true ? (
          <SearchBar />
        ) : (
          <Title />
        );
      },
      headerRight() {
        const params = route.params;
        // @ts-ignore
        return params && params['search'] == true ? (
          <TouchableOpacity
            touchSoundDisabled
            className="px-3"
            onPress={() => nav.setParams({search: false})}>
            <Icon name="close" size={24} color={dark ? 'white' : 'black'} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            touchSoundDisabled
            className="px-3"
            onPress={() => nav.setParams({search: true})}>
            <Icon name="search1" size={24} color={dark ? 'white' : 'black'} />
          </TouchableOpacity>
        );
      },
    });
  }, [route]);

  return (
    <View className={'flex-1 items-stretch p-3 self-stretch'}>
      <History />
    </View>
  );
}

export default Main;
