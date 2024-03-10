import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import useAppTheme from '../../../hooks/useAppTheme';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useTranslation } from 'react-i18next';
import TouchableCard from '../../TouchableCard';

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
    <TouchableCard
      className='m-1 p-3 rounded-md'
      style={{ backgroundColor: theme.colors.card }}
      onClick={() => props.onSelect(props.value)}>
      <View className='flex flex-row'>
        <View className='flex flex-col flex-grow'>
          <Text className='text-lg' style={{color: theme.colors.text}}>{t(props.translator(props.text))}</Text>
        </View>
        {
          props.selected == props.value &&
        <Icon color={'green'} name='circle-check' solid size={24}/>
        }
      </View>
    </TouchableCard>
  );
};

export default GeneralCard;
