import * as React from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, ActivityIndicator, Button, Modal } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';
import Host from './Host';

interface HostAvailabilityProps {
  hosts:string[]
  onConfirm:(value:string|null)=>void
  visible:boolean
}

const HostAvailability = (props: HostAvailabilityProps) => {
  const [{theme}] = useAppTheme();
  return (
    <Modal visible={props.visible} animationType='slide'>
    <View style={{backgroundColor:theme.colors.background,flex:1}} className='p-4'>
      <Text className='text-2xl mb-4 flex-grow-0' style={{color:theme.colors.text}}>Select the host</Text>
      <FlatList
      className='flex-grow'
      data={props.hosts}
      renderItem={({item}) => (
        <Host host={item} onSelect={props.onConfirm}/>
        )}
        />
      <Button title='Cancel' onPress={()=> props.onConfirm(null)}/>
    </View>
        </Modal>
  );
};

export default HostAvailability;
