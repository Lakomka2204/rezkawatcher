import React, { useRef } from 'react'
import { ActivityIndicator, Animated, Image, Pressable, Text, TouchableOpacity } from 'react-native'
import cn from 'classnames';
import { useNavigation } from '@react-navigation/native';
import { PreviewMovie } from '../logic/movie';
import Button from './Button';
const Movie : React.FC<{movie: PreviewMovie}> = ({movie}) => {
  
  const mv = movie as PreviewMovie;
  const nav = useNavigation();
  function gotoMovie() {
    // @ts-ignore
    nav.navigate("mov",{link:mv.url})
  }
  
  return (
    <Button onClick={gotoMovie} disabled={!mv.enabled} className={cn('z-10 bg-slate-300',!mv.enabled && 'opacity-0')}>
        <Image className={'h-64 w-40 bg-slate-500'} source={{uri:mv.thumbnail}}
        />
        <Text className={'p-1 font-semibold w-40 bg-slate-400 text-black'}>{mv.name}</Text>
        </Button>
  )
};

export default Movie;