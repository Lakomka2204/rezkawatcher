import { useTheme } from '@react-navigation/native';
import { Text, View, StyleSheet, Button } from 'react-native';
import ModalWindow, { ModalRef } from '../components/settings/ModalWindow';
import { useRef, useState } from 'react';

interface HomeScreenProps {}

const HomeScreen = (props: HomeScreenProps) => {
  const theme = useTheme();
  const modalRef = useRef<ModalRef>(null);
  function show() {
    modalRef.current?.show()
    setTimeout(() => modalRef.current?.hide(),2000);
  }
  return (
    <View style={styles.container}>
      <Text style={{color:theme.colors.text}}>HomeScreen</Text>
      <Button title='open' onPress={() =>show()}/>
      <ModalWindow title='sex' ref={modalRef}>
        <Text>lox</Text>
        <Button title='1'/>
      </ModalWindow>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {}
});
