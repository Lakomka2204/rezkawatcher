import {StatusBar, Text, TouchableOpacity, View} from 'react-native';
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
import {
  NavigationContainer,
  NavigationContainerRef,
  useTheme,
} from '@react-navigation/native';
import {useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchBar from './components/SearchBar';
import Title from './components/Title';
init();
const Stack = createNativeStackNavigator();
export type NavigationProps = {
  main: {search?: boolean} | undefined;
  sub: {query: string; page?: number} | undefined;
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
  const nav = useRef<NavigationContainerRef<NavigationProps>>(null);
  const theme = useTheme();
  return (
    <SafeAreaView className={'flex-1 items-stretch self-stretch'}>
      <StatusBar translucent />
      <AutocompleteDropdownContextProvider>
        <NavigationContainer ref={nav}>
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
                headerTitle() {
                  const route = nav.current?.getCurrentRoute();

                  return route?.params &&
                    // @ts-ignore
                    route?.params['search'] == true ? (
                    <SearchBar />
                  ) : (
                    <Title />
                  );
                },
                headerRight() {
                  const params = nav.current?.getCurrentRoute()?.params;
                  // @ts-ignore
                  return params && params['search'] == true ? (
                    <TouchableOpacity
                      touchSoundDisabled
                      className="px-3"
                      onPress={() => nav.current?.setParams({search: false})}>
                      <Icon
                        name="times"
                        light
                        size={24}
                        color={theme.dark ? 'white' : 'black'}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      touchSoundDisabled
                      className="px-3"
                      onPress={() => nav.current?.setParams({search: true})}>
                      <Icon
                        name="search"
                        light
                        size={24}
                        color={theme.dark ? 'white' : 'black'}
                      />
                    </TouchableOpacity>
                  );
                },
              }}
            />
            <Stack.Screen
              name="sub"
              component={SearchResultsScreen}
              options={{
                title: 'Search results',
                statusBarAnimation: 'fade',
                headerRight() {
                  const route = nav.current?.getCurrentRoute();
                  if (!route || !route.params) return <></>;
                  // @ts-ignore
                  const {query, page} = route.params;
                  const hideNext = !(page && page < 5);
                  const hidePrev = !(page && page > 1);
                  return (
                    <View className="flex flex-row items-center">
                      <TouchableOpacity
                        touchSoundDisabled
                        disabled={hidePrev}
                        className="px-3"
                        onPress={() =>
                          nav.current?.setParams({page: page - 1})
                        }>
                        <Icon
                          name="angle-left"
                          size={24}
                          light
                          color={hidePrev ? 'gray' : 'black'}
                        />
                      </TouchableOpacity>
                      <Text className="text-lg text-black">{page ?? 1}</Text>
                      <TouchableOpacity
                        touchSoundDisabled
                        disabled={hideNext}
                        className="px-3"
                        onPress={() =>
                          nav.current?.setParams({page: page + 1})
                        }>
                        <Icon
                          name="angle-right"
                          size={24}
                          light
                          color={hideNext ? 'gray' : 'black'}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                },
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
      </AutocompleteDropdownContextProvider>
    </SafeAreaView>
  );
}
