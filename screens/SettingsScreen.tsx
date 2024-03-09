import { Text, View, StyleSheet, FlatList, Button, SectionList, ToastAndroid, Modal, ScrollView, Alert, TextInput } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';
import { useEffect, useMemo, useState } from 'react';
import { OptionType, Select } from '@mobile-reality/react-native-select-pro';
import { useMMKVString } from 'react-native-mmkv';
import config from '../config';
import HostAvailability from '../components/HostAvailability';
interface SettingsScreenProps { }

const SettingsScreen = (props: SettingsScreenProps) => {
  const [{ theme, value }, setTheme] = useAppTheme();
  const themes = config.themes.map(x => ({ label: x, value: x }));
  const hosts = config.hosts.map(x => ({ label: x, value: x }));
  const cdns = config.cdns.map(x => ({label:x,value:x}));
  const [host,setHost] = useMMKVString(config.keys.mainHost);
  const [cdn,setCdn] = useMMKVString(config.keys.cdnHost);
  const [mainHostModal,setMainHostModal]=useState(false);
  const [cdnHostModal,setCdnHostModal]=useState(false);
  return (
    <View className='m-3'>
      <Text style={{ color: theme.colors.text }} className='text-xl'>Theme</Text>
      <Select
        theme={theme.dark ? 'dark' : 'light'}
        options={themes}
        clearable={false}
        defaultOption={{ value, label: value }}
        onSelect={({ value }) => setTheme(value)}
      />
      <Text style={{ color: theme.colors.text }} className='text-xl'>Domain</Text>
      <Select
        theme={theme.dark ? 'dark' : 'light'}
        options={hosts}
        clearable={false}
        defaultOption={{ value: host!, label: host! }}
        onSelect={({ value }) => {
            setHost(value);
        }}
      />
      <Text style={{ color: theme.colors.text }} className='text-xl'>CDN Host</Text>
      <Select
        theme={theme.dark ? 'dark' : 'light'}
        options={cdns}
        clearable={false}
        defaultOption={{ value: cdn!, label: cdn! }}
        onSelect={({ value }) => {
            setCdn(value);
        }}
      />
      <Button title='change' onPress={()=>setMainHostModal(true)}/>
      <Button title='change CDN' onPress={()=>setCdnHostModal(true)}/>
        <HostAvailability
        visible={mainHostModal}
         hosts={config.hosts}
         onConfirm={(host) => {
          if (host) setHost(host);
          setMainHostModal(false)
          }}/>
          <HostAvailability
        visible={cdnHostModal}
         hosts={config.cdns}
         onConfirm={(cdn) => {
          if (cdn) setCdn(cdn);
          setCdnHostModal(false)
          }}/>
          
    </View>
  );
};

export default SettingsScreen;

