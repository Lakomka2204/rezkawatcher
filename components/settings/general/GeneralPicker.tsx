import { Text, View, FlatList, Button, Modal } from 'react-native';
import useAppTheme from '../../../hooks/useAppTheme';
import GeneralCard from './GeneralCard';
import { useTranslation } from 'react-i18next';
import TouchableCard from '../../TouchableCard';

interface PickerProps {
  title: string,
  values:string[],
  selected:string,
  onConfirm:(value:string|null)=>void
  visible:boolean
  translator:(value:string)=>string
}
function Picker(props: PickerProps) {
  const [{theme}] = useAppTheme();
  const {t} = useTranslation();
  return (
    <Modal visible={props.visible} animationType='slide'>
    <View style={{backgroundColor:theme.colors.background,flex:1}} className='p-4'>
      <Text className='text-2xl mb-4 flex-grow-0' style={{color:theme.colors.text}}>{props.title}</Text>
      <FlatList
      className='flex-grow'
      data={props.values}
      renderItem={({item}) => 
      <GeneralCard
      translator={props.translator}
      value={item}
      text={item}
      selected={props.selected}
      onSelect={props.onConfirm}/>}
        />
      <TouchableCard 
        className='m-1 p-2 rounded-md border flex items-center'
        style={{borderColor:theme.colors.text}}
        onClick={() => props.onConfirm(null)}>
          <Text style={{color:theme.colors.text}}>{t('close').toUpperCase()}</Text>
        </TouchableCard>
    </View>
        </Modal>
  );
};

export default Picker;
