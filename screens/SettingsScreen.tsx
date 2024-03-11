import { Text, View, StyleSheet, FlatList, Button, SectionList, ToastAndroid, Modal, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMMKVString } from 'react-native-mmkv';
import config from '../config';
import HostAvailability from '../components/settings/host/HostPicker';
import Picker from '../components/settings/general/GeneralPicker';
import useLanguage from '../hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import TouchableCard from '../components/TouchableCard';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ModalWindow, { ModalRef } from '../components/settings/ModalWindow';
import { Theme } from '@react-navigation/native';
import i18n from '../i18n';
interface SettingsScreenProps { }
interface ComponentProps {
  tkey: string,
  values:string[]
  theme: Theme,
  t: typeof i18n.t,
  setValue: (value: string) => void
}
interface GeneralComponentProps extends ComponentProps {
  value: string;
}
function GeneralComponent({ setValue, t, theme, value, tkey, values }: GeneralComponentProps) {
  const [modal, setModal] = useState(false);
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
      <Picker
        translator={v => `settings.${tkey}.${v}`}
        selected={value}
        title={t(`settings.${tkey}.select`)}
        values={values}
        visible={modal}
        onConfirm={(v) => {
          if (v)
            setValue(v);
          else
            setModal(false);
        }}
      />
    </>
  )
}
interface HostComponentProps extends ComponentProps {
  value: string|undefined;
}
function HostComponent({setValue,t,theme,tkey,value,values}:HostComponentProps) {
  const [modal, setModal] = useState(false)
  const hintRef = useRef<ModalRef>(null);
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
      <HostAvailability
        title={t(`settings.${tkey}.select`)}
        visible={modal}
        hosts={values}
        onConfirm={(host) => {
          if (host) setValue(host);
          setModal(false)
        }} />
    </>
  )
}
const SettingsScreen = (props: SettingsScreenProps) => {
  const [{ theme, value:themeValue }, setTheme] = useAppTheme();
  const [host, setHost] = useMMKVString(config.keys.mainHost);
  const [cdn, setCdn] = useMMKVString(config.keys.cdnHost);
  const [t, lang, setLang] = useLanguage();
  return (
    <View className='m-3'>
      <Text style={{ color: theme.colors.text }} className='mx-1'>{t('settings.hint')}</Text>
      <GeneralComponent
      tkey='lang'
      setValue={setLang}
      t={t}
      theme={theme}
      value={lang}
      values={config.langs}
      />
      <GeneralComponent
      tkey='theme'
      setValue={setTheme}
      t={t}
      theme={theme}
      value={themeValue}
      values={config.themes}
      />
      <HostComponent
      setValue={setHost}
      t={t}
      theme={theme}
      tkey='mainHost'
      value={host}
      values={config.hosts}
      />
      <HostComponent
      setValue={setCdn}
      t={t}
      theme={theme}
      tkey='cdnHost'
      value={cdn}
      values={config.cdns}
      />
    </View>
  );
};

export default SettingsScreen;

