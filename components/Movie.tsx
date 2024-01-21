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
import {useNavigation, useTheme} from '@react-navigation/native';
import {PreviewMovie} from '../logic/movie';
import Button from './Button';
import {NavigationProps} from '../utils/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const Movie: React.FC<{movie: PreviewMovie}> = ({movie}) => {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const {colors, dark} = useTheme();
  return (
    <Button
      onClick={() => nav.push('mov', {link: movie.url})}
      disabled={!movie.enabled}
      className="z-10">
      {movie.thumbnail && (
        <Image className={'h-64 w-40'} source={{uri: movie.thumbnail}} />
      )}
      <Text
        className={cn('p-1 font-semibold w-40', !movie.enabled && 'opacity-0')}
        style={{
          backgroundColor: colors.border,
          color: colors.text,
        }}>
        {movie.name}
      </Text>
    </Button>
  );
};

export default Movie;
