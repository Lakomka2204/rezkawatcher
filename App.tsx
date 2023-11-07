import {StatusBar} from 'react-native';
import {NativeWindStyleSheet} from 'nativewind';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import SearchResultsScreen from './screens/SearchResultsScreen';
import Main from './screens/Main';
import {AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';
import MovieScreen from './screens/MovieScreen';
NativeWindStyleSheet.setOutput({
  default: 'native',
});
import {init} from './logic/init';
import WatchScreen from './screens/WatchScreen';
import {Episode, Movie, Season, Translation} from './logic/movie';
import {NavigationContainer} from '@react-navigation/native';
init();
const Stack = createNativeStackNavigator();
export type NavigationProps = {
  main: undefined;
  sub: {query: string} | undefined;
  mov: {link: string} | undefined;
  watch:
    | {
        movie: Movie;
        season?: Season;
        episode?: Episode;
        translation: Translation;
      }
    | undefined;
};
export default function App() {
  return (
    <SafeAreaView className={'flex-1 items-stretch self-stretch'}>
      <StatusBar translucent />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="main"
          screenOptions={{
            animation: 'simple_push',
            animationTypeForReplace: 'push',
          }}>
          <Stack.Screen
            name="main"
            component={Main}
            options={{
              title: 'Rezka Watcher',
              headerTitleAlign: 'center',
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="sub"
            component={SearchResultsScreen}
            options={{
              title: 'Search results',
              statusBarAnimation: 'fade',
            }}
          />
          <Stack.Screen
            name="mov"
            component={MovieScreen}
            options={{
              title: 'Movie',
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
    </SafeAreaView>
  );
}
