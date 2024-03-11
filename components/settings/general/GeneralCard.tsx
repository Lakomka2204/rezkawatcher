import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import TouchableCard from '../../TouchableCard';
import { Theme } from '@react-navigation/native';
import { useMemo } from 'react';

interface ThemeCardProps {
  value:string
  onSelect: (value: string) => void
  selected: string
  theme: Theme
  text:string
}

function GeneralCard({onSelect,selected,value,text,theme}: ThemeCardProps) {
  const isSelected = useMemo(() => {
    return selected == value;
  },[selected])
  return (
    <TouchableCard
      className='m-1 p-3 rounded-md'
      style={{ backgroundColor: theme.colors.card }}
      onClick={() => onSelect(value)}>
      <View className='flex flex-row items-center'>
        <Icon color={isSelected ? 'green' :'gray'} name={isSelected?'circle-check':'circle'} solid={isSelected} size={24}/>
        <View className='flex flex-col flex-grow mx-2'>
          <Text className='text-lg' style={{color: theme.colors.text}}>{text}</Text>
        </View>
      </View>
    </TouchableCard>
  );
};

export default GeneralCard;
