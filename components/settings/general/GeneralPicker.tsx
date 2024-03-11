import { View, Text, Modal, FlatList } from 'react-native'
import React, { useRef, useState } from 'react'
import i18n from '../../../i18n'
import { Theme } from '@react-navigation/native'
import ModalWindow, { ModalRef } from '../../ModalWindow'
import TouchableCard from '../../TouchableCard'
import GeneralCard from './GeneralCard'
interface GeneralPickerProps {
  tkey: string,
  values:string[]
  theme: Theme,
  t: typeof i18n.t,
  setValue: (value: string) => void
  value: string
}
export default function GeneralPicker({setValue,t,theme,tkey,value,values}:GeneralPickerProps) {
  const [modal, setModal] = useState(false)
  const hintRef = useRef<ModalRef>(null);
  return (
    <>
      <TouchableCard
        style={{ backgroundColor: theme.colors.card }}
        className='my-1 p-3 rounded-md flex flex-col'
        onClick={() => setModal(true)}
        onLongClick={() => hintRef.current?.show()}>
        <Text style={{ color: theme.colors.text }} className='text-xl'>{t(`settings.${tkey}.name`)}</Text>
        <Text style={{ color: theme.colors.text }}>{t(`settings.${tkey}.${value}`)}</Text>
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
          renderItem={({ item }) =>
            <GeneralCard
            text={t(`settings.${tkey}.${item}`)}
            theme={theme}
              value={item}
              selected={value}
              onSelect={setValue} />}
        />
        <TouchableCard
          className='m-1 p-2 rounded-md border flex items-center'
          style={{ borderColor: theme.colors.text }}
          onClick={() => setModal(false)}>
          <Text style={{ color: theme.colors.text }}>{t('close').toUpperCase()}</Text>
        </TouchableCard>
      </View>
    </Modal>
    </>
  )
}