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
import {NavigationProps} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

function Main() {
  return (
    <View className={'flex-1 items-stretch p-3 self-stretch'}>
      <History />
    </View>
  );
}

export default Main;
