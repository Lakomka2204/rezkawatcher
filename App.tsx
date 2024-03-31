import {
  StatusBar,
  Text,
} from 'react-native';
import { NativeWindStyleSheet } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
NativeWindStyleSheet.setOutput({
  default: 'native',
});
import init from './logic/axios';
import {
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import Icon from 'react-native-vector-icons/FontAwesome6';
import useAppTheme from './hooks/useAppTheme';
import SettingsScreen from './screens/SettingsScreen';
import useLanguage from './hooks/useLanguage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from './screens/SearchScreen';
import SearchResultScreen from './screens/SearchResultScreen';
import { NavigationProps } from './utils/types';
import { useEffect, useState } from 'react';

init();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<NavigationProps>();
const HomeStack = ({home,settings}:{home:string,settings:string}) => (
  <Tab.Navigator initialRouteName='Home'>
    <Tab.Screen
      name="sHome"
      component={HomeScreen} options={{
        title: home,
        tabBarIcon(props) {
          return <Icon {...props} name='house' />
        }
      }} />
    <Tab.Screen
      name="sSettings"
      component={SettingsScreen}
      options={{
        title: settings,
        tabBarIcon(props) {
          return <Icon {...props} name='gear' />
        }
      }} />
  </Tab.Navigator>
)
export default function App() {
  const [{ theme }] = useAppTheme();
  const [t] = useLanguage();

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <StatusBar translucent backgroundColor={theme.colors.background} animated showHideTransition="fade" barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          <Stack.Screen
            name='home' options={{
        headerShown: false,
            }}>
              {(props:any) => <HomeStack {...props} home={t('home')} settings={t('settings.name')}/>} 
            </Stack.Screen>
          <Stack.Screen name='search' component={SearchScreen} />
          <Stack.Screen name='searchResult' component={SearchResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
