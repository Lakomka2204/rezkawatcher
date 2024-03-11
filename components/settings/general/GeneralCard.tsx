import * as React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import TouchableCard from '../../TouchableCard';
import { Theme } from '@react-navigation/native';

interface ThemeCardProps {
  value:string
  onSelect: (value: string) => void
  selected: string
  theme: Theme
  text:string
}

function GeneralCard({onSelect,selected,value,text,theme}: ThemeCardProps) {
  return (
    <TouchableCard
      className='m-1 p-3 rounded-md'
      style={{ backgroundColor: theme.colors.card }}
      onClick={() => onSelect(value)}>
      <View className='flex flex-row'>
        <View className='flex flex-col flex-grow'>
          <Text className='text-lg' style={{color: theme.colors.text}}>{text}</Text>
        </View>
        {
          selected == value &&
        <Icon color={'green'} name='circle-check' solid size={24}/>
        }
      </View>
    </TouchableCard>
  );
};

export default GeneralCard;
