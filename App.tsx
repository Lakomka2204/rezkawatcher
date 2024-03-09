import {
  StatusBar,
  useColorScheme,
} from 'react-native';
import { NativeWindStyleSheet } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
NativeWindStyleSheet.setOutput({
  default: 'native',
});
import init from './logic/axios';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRef,
  ParamListBase,
  Theme,
  useTheme,
} from '@react-navigation/native';
import { useEffect, useMemo, useRef } from 'react';
import { NavigationProps } from './utils/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import Icon from 'react-native-vector-icons/FontAwesome6';
import useAppTheme from './hooks/useAppTheme';
import SettingsScreen from './screens/SettingsScreen';
import { SelectProvider } from '@mobile-reality/react-native-select-pro';
init();
const Tab = createBottomTabNavigator();
export default function App() {
  const navContainer = useRef<NavigationContainerRef<ParamListBase>>(null);
  const [{ theme }] = useAppTheme();
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <StatusBar translucent backgroundColor={theme.colors.background} animated showHideTransition="fade" barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <SelectProvider>
        <NavigationContainer theme={theme} ref={navContainer}>
          <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon(props) {
                  return <Icon {...props} name='house' />
                }
              }} />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                tabBarIcon(props) {
                  return <Icon {...props} name='gear' />
                }
              }} />
          </Tab.Navigator>
        </NavigationContainer>
      </SelectProvider>
    </SafeAreaView>
  );
}
