import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import cn from 'classnames';
import {useNavigation} from '@react-navigation/native';
import {PreviewMovie} from '../logic/movie';
import Button from './Button';
import {NavigationProps} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const Movie: React.FC<{movie: PreviewMovie}> = ({movie}) => {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  return (
    <Button
      onClick={() => nav.navigate('mov', {link: movie.url})}
      disabled={!movie.enabled}
      className={cn('z-10 bg-slate-300')}>
      {movie.thumbnail && (
        <Image
          className={'h-64 w-40 bg-slate-500'}
          source={{uri: movie.thumbnail}}
        />
      )}
      <Text
        className={cn(
          'p-1 font-semibold w-40 bg-slate-400 text-black',
          !movie.enabled && 'opacity-0',
        )}>
        {movie.name}
      </Text>
    </Button>
  );
};

export default Movie;
