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
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import Icon from 'react-native-vector-icons/FontAwesome6';
import useAppTheme from './hooks/useAppTheme';
import SettingsScreen from './screens/SettingsScreen';
import useLanguage from './hooks/useLanguage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
init();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = () => (
  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name='home' component={HomeScreen} />
  </Stack.Navigator>
)
export default function App() {
  const [{ theme }] = useAppTheme();
  const [t] = useLanguage();
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <StatusBar translucent backgroundColor={theme.colors.background} animated showHideTransition="fade" barStyle={theme.dark ? 'light-content' : 'dark-content'} />
        <NavigationContainer theme={theme}>
          <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen
              name="home"
              component={HomeStack}
              options={{
                
                title:t('home'),
                tabBarIcon(props) {
                  return <Icon {...props} name='house' />
                }
              }} />
            <Tab.Screen
              name="settings"
              component={SettingsScreen}
              options={{
                title:t('settings.name'),
                tabBarIcon(props) {
                  return <Icon {...props} name='gear' />
                }
              }} />
          </Tab.Navigator>
        </NavigationContainer>
    </SafeAreaView>
  );
}
