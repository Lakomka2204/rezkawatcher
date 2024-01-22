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
import {NavigationProps} from '../utils/types';

function Main() {
  const nav = useNavigation<NavigationProp<NavigationProps>>();
  const route = useRoute<RouteProp<NavigationProps>>();
  const {colors} = useTheme();
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
            <Icon name="close" size={24} color={colors.text}/>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            touchSoundDisabled
            className="px-3"
            onPress={() => nav.setParams({search: true})}>
            <Icon name="search1" size={24} color={colors.text}/>
          </TouchableOpacity>
        );
      },
    });
  }, [route]);

  return (
      <History />
  );
}

export default Main;
