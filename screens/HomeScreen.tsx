import { useTheme } from '@react-navigation/native';
import { Text, View, StyleSheet, Button } from 'react-native';
import ModalWindow, { ModalRef } from '../components/settings/ModalWindow';
import { useRef, useState } from 'react';
import HostPickerv2 from '../components/settings/host/HostPicker';
import useLanguage from '../hooks/useLanguage';
import useAppTheme from '../hooks/useAppTheme';
import config from '../config';

interface HomeScreenProps {}

const HomeScreen = (props: HomeScreenProps) => {
  const [{theme}] = useAppTheme();
  const modalRef = useRef<ModalRef>(null);
  const [t] = useLanguage();
  function show() {
    modalRef.current?.show()
    setTimeout(() => modalRef.current?.hide(),2000);
  }
  return (
    <View style={styles.container}>
      <Text style={{color:theme.colors.text}}>HomeScreen</Text>
      <HostPickerv2
      setValue={(v)=>console.log('selected',v)}
      t={t}
      theme={theme}
      tkey='cdnHost'
      value=''
      values={config.hosts}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {}
});
