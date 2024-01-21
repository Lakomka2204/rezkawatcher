import {
    StatusBar,
    useColorScheme,
} from 'react-native';
import { NativeWindStyleSheet } from 'nativewind';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchResultsScreen from './screens/SearchResultsScreen';
import Main from './screens/Main';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import MovieScreen from './screens/MovieScreen';
NativeWindStyleSheet.setOutput({
    default: 'native',
});
import { init } from './logic/init';
import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
    NavigationContainerRef,
} from '@react-navigation/native';
import { useRef } from 'react';
import WatchScreen from './screens/WatchScreen';
import MovieScreen2 from './screens/MovieScreen2';
import { NavigationProps } from './utils/types';
init();
const Stack = createNativeStackNavigator();

export default function App() {
    const nav = useRef<NavigationContainerRef<NavigationProps>>(null);
    const theme = useColorScheme();
    return (
        <SafeAreaView className={'flex-1 items-stretch self-stretch'}>
            <StatusBar translucent />
            <AutocompleteDropdownContextProvider>
                <NavigationContainer
                    ref={nav}
                    theme={theme == 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack.Navigator
                        initialRouteName="main"
                        screenOptions={{
                            animation: 'simple_push',
                            animationTypeForReplace: 'pop',
                            statusBarAnimation: 'fade',
                        }}>
                        <Stack.Screen name="main" component={Main} />
                        <Stack.Screen
                            name="sub"
                            component={SearchResultsScreen}
                            options={{
                                title: 'Loading...',
                            }}
                        />
                        <Stack.Screen
                            name="mov"
                            component={MovieScreen}
                            options={{
                                title: 'Loading...',
                            }}
                        />
                        <Stack.Screen
                            name="mov2"
                            component={MovieScreen2}
                            options={{
                                title: 'Loading...',
                            }}
                        />
                        <Stack.Screen
                            name="watch"
                            component={WatchScreen}
                            options={{
                                navigationBarHidden: true,
                                statusBarHidden: true,
                                headerShown: false,
                                statusBarTranslucent: true,
                                orientation: 'landscape',
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </AutocompleteDropdownContextProvider>
        </SafeAreaView>
    );
}
