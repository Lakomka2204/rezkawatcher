import { View, Text, Modal, FlatList, RefreshControl } from 'react-native'
import React, { useRef, useState } from 'react'
import i18n from '../../../i18n'
import { Theme } from '@react-navigation/native'
import TouchableCard from '../../TouchableCard'
import ModalWindow, { ModalRef } from '../ModalWindow'
import Icon from 'react-native-vector-icons/FontAwesome6'
import Host from './HostCard'
interface HostPickerProps {
  tkey: string,
  values:string[]
  theme: Theme,
  t: typeof i18n.t,
  setValue: (value: string) => void
  value: string|undefined
}
export default function HostPicker({setValue,t,theme,tkey,values,value}:HostPickerProps) {
  const [modal, setModal] = useState(false)
  const hintRef = useRef<ModalRef>(null);
  const [refresh, setRefresh] = useState(false);
  function select(v:string) {
    setValue(v);
    setModal(false)
  }
  return (
    <>
    <TouchableCard
        style={{ backgroundColor: theme.colors.card }}
        className='my-1 p-3 rounded-md flex flex-row items-center'
        onClick={() => setModal(true)}
        onLongClick={() => hintRef.current?.show()}>
        <View className='flex-grow flex flex-col'>
          <Text style={{ color: theme.colors.text }} className='text-xl'>{t(`settings.${tkey}.name`)}</Text>
          <Text style={{ color: theme.colors.text }}>{value}</Text>
        </View>
        {
          !value &&
          <Icon color={'red'} name='circle-exclamation' size={24} />
        }
      </TouchableCard>
      <ModalWindow
        title={t(`settings.${tkey}.name`)}
        ref={hintRef}>
        <Text style={{ color: theme.colors.text }}>{t(`settings.${tkey}.hint`)}</Text>
      </ModalWindow>
      <Modal visible={modal} animationType='slide' onRequestClose={() => setModal(false)}>
      <View style={{ backgroundColor: theme.colors.background, flex: 1 }} className='p-4'>
        <Text className='text-2xl mb-4 flex-grow-0' style={{ color: theme.colors.text }}>{t(`settings.${tkey}.name`)}</Text>
        <FlatList
          className='flex-grow'
          data={values}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => setRefresh(!refresh)} />
          }
          renderItem={({ item }) => (
            <Host 
            host={item} 
            onSelect={select} 
            refresh={refresh} 
            t={t}
            theme={theme}
            />
          )}
        />
        <TouchableCard 
        className='m-1 p-2 rounded-md border flex items-center'
        style={{borderColor:theme.colors.text}}
        onClick={() => setModal(false)}>
          <Text style={{color:theme.colors.text}}>{t('close').toUpperCase()}</Text>
        </TouchableCard>
      </View>
    </Modal>
    </>
  )
}