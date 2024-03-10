import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import useAppTheme from '../../../hooks/useAppTheme';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useTranslation } from 'react-i18next';

interface ThemeCardProps {
  text:string
  value:string
  onSelect: (value: string) => void
  selected: string
  translator:(value:string)=>string
}

function GeneralCard(props: ThemeCardProps) {
  const [{ theme }] = useAppTheme();
  const {t} = useTranslation(); 
  return (
    <TouchableOpacity
      className='m-1 p-3 rounded-md'
      style={{ backgroundColor: theme.colors.card }}
      onPress={() => props.onSelect(props.value)}
      activeOpacity={0.6} >
      <View className='flex flex-row'>
        <View className='flex flex-col flex-grow'>
          <Text className='text-lg' style={{color: theme.colors.text}}>{t(props.translator(props.text))}</Text>
        </View>
        {
          props.selected == props.value &&
        <Icon color={'green'} name='circle-check' solid size={24}/>
        }
      </View>
    </TouchableOpacity>
  );
};

export default GeneralCard;
