import { Text, View, StyleSheet, FlatList, Button, SectionList, ToastAndroid, Modal, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';
import { useEffect, useMemo, useState } from 'react';
import { useMMKVString } from 'react-native-mmkv';
import config from '../config';
import HostAvailability from '../components/settings/host/HostPicker';
import Picker from '../components/settings/general/GeneralPicker';
import useLanguage from '../hooks/useLanguage';
import { useTranslation } from 'react-i18next';
interface SettingsScreenProps { }

const SettingsScreen = (props: SettingsScreenProps) => {
  const [{ theme, value }, setTheme] = useAppTheme();
  const [host, setHost] = useMMKVString(config.keys.mainHost);
  const [cdn, setCdn] = useMMKVString(config.keys.cdnHost);
  const [mainHostModal, setMainHostModal] = useState(false);
  const [cdnHostModal, setCdnHostModal] = useState(false);
  const [themeModal, setThemeModal] = useState(false);
  const [langModal, setLangModal] = useState(false);
  const [lang,setLang]=useLanguage();
  const {t} = useTranslation();
  return (
    <View className='m-3'>
      <TouchableOpacity activeOpacity={0.6}
        className='my-1 p-2 rounded-md'
        style={{ backgroundColor: theme.colors.card }}
        onPress={() => setLangModal(true)}>
        <Text style={{ color: theme.colors.text }} className='text-xl'>{t('settings.lang.name')}</Text>
        <Text style={{ color: theme.colors.text }}>{t(`settings.lang.${lang}`,{lng:lang})}</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.6}
        className='my-1 p-2 rounded-md'
        style={{ backgroundColor: theme.colors.card }}
        onPress={() => setThemeModal(true)}>
        <Text style={{ color: theme.colors.text }} className='text-xl'>{t('settings.theme.name')}</Text>
        <Text style={{ color: theme.colors.text }}>{t(`settings.theme.${value}`)}</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.6}
        className='my-1 p-2 rounded-md'
        style={{ backgroundColor: theme.colors.card }}
        onPress={() => setMainHostModal(true)}>
        <Text style={{ color: theme.colors.text }} className='text-xl'>{t('settings.mainHost.name')}</Text>
        <Text style={{ color: theme.colors.text }}>{host}</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.6}
        className='my-1 p-2 rounded-md'
        style={{ backgroundColor: theme.colors.card }}
        onPress={() => setCdnHostModal(true)}>
        <Text style={{ color: theme.colors.text }} className='text-xl'>{t('settings.cdnHost.name')}</Text>
        <Text style={{ color: theme.colors.text }}>{cdn}</Text>
      </TouchableOpacity>
      <Picker
      translator={v => `settings.lang.${v}`}
      selected={lang}
        title={t('settings.lang.select')}
        values={config.langs}
        visible={langModal}
        onConfirm={(v) => {
          if (v) 
          setLang(v);
        else
          setLangModal(false);
        }}
      />
      <Picker
      translator={v => `settings.theme.${v}`}
      selected={value}
        title={t('settings.theme.select')}
        values={config.themes}
        visible={themeModal}
        onConfirm={(v) => {
          if (v) 
          setTheme(v);
        else
          setThemeModal(false);
        }}
      />
      <HostAvailability
        title={t('settings.mainHost.select')}
        visible={mainHostModal}
        hosts={config.hosts}
        onConfirm={(host) => {
          if (host) setHost(host);
          setMainHostModal(false)
        }} />
      <HostAvailability
        title={t('settings.cdnHost.select')}
        visible={cdnHostModal}
        hosts={config.cdns}
        onConfirm={(cdn) => {
          if (cdn) setCdn(cdn);
          setCdnHostModal(false)
        }} />

    </View>
  );
};

export default SettingsScreen;

