import { Text, View, StyleSheet, FlatList, Pressable, ActivityIndicator, Button, Modal, RefreshControl } from 'react-native';
import useAppTheme from '../../../hooks/useAppTheme';
import Host from './HostCard';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TouchableCard from '../../TouchableCard';

interface HostAvailabilityProps {
  title: string,
  hosts: string[]
  onConfirm: (value: string | null) => void
  visible: boolean
}
const HostAvailability = (props: HostAvailabilityProps) => {
  const [{ theme }] = useAppTheme();
  const [refresh, setRefresh] = useState(false);
  const {t} = useTranslation();
  return (
    <Modal visible={props.visible} animationType='slide' onRequestClose={() => props.onConfirm(null)}>
      <View style={{ backgroundColor: theme.colors.background, flex: 1 }} className='p-4'>
        <Text className='text-2xl mb-4 flex-grow-0' style={{ color: theme.colors.text }}>{props.title}</Text>
        <FlatList
          className='flex-grow'
          data={props.hosts}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => setRefresh(!refresh)} />
          }
          renderItem={({ item }) => (
            <Host host={item} onSelect={props.onConfirm} refresh={refresh} />
          )}
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

export default HostAvailability;
