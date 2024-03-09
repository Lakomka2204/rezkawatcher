import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface HomeScreenProps {}

const HomeScreen = (props: HomeScreenProps) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={{color:theme.colors.text}}>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {}
});
