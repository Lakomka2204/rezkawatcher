import React, {useEffect, useState} from 'react';
import Title from '../components/Title';
import SearchBar from '../components/SearchBar';
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  View,
} from 'react-native';
import History from '../components/History';
import {useNavigation} from '@react-navigation/native';
import {SearchBarProps} from 'react-native-screens';
import {NavigationProps} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

function Main() {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  React.useLayoutEffect(() => {
    nav.setOptions({
      headerSearchBarOptions: {
        autoCapitalize: 'none',
        inputType: 'text',
        placeholder: 'Search for movies & cartoons & etc',
        placement: 'stacked',
        hideWhenScrolling: true,
        disableBackButtonOverride: true,
        hideNavigationBar: false,
        obscureBackground: true,
        shouldShowHintSearchIcon: false,
        onSearchButtonPress: e =>
          nav.navigate('sub', {query: e.nativeEvent.text}),
      },
    });
  }, [nav]);
  return (
    <View className={'flex-1 items-stretch p-3 self-stretch'}>
      <History />
    </View>
  );
}

export default Main;
