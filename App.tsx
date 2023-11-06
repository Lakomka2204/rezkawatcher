import { View, Text, Button, TextInput, Touchable, TouchableOpacity, StatusBar } from "react-native";
import History from "./components/History";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect, useState } from "react";
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { SafeAreaView } from "react-native-safe-area-context";
import SearchResultsScreen from "./screens/SearchResultsScreen";
import Title from "./components/Title";
import Main from "./screens/Main";
import axios from "axios";
import {AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';
import MovieScreen from "./screens/MovieScreen";
NativeWindStyleSheet.setOutput({
  default: 'native'
});
import {init} from "./logic/init";
import WatchScreen from "./screens/WatchScreen";
init();
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <SafeAreaView className={"flex-1 items-stretch self-stretch"}>
        <StatusBar translucent/>
        <AutocompleteDropdownContextProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="main" component={Main} options={{title:'Rezka Watcher',
          headerRight(props) {
            const nav = useNavigation()
            //@ts-ignore
              return <Button title="movie" onPress={() => nav.navigate('watch')}/>
          },}}/>
            <Stack.Screen name="sub" component={SearchResultsScreen}
            options={{title:"Search results",animation:'fade', statusBarAnimation:'fade'}}/>
            <Stack.Screen name="mov" component={MovieScreen}
            options={{title:"Movie", animation:'fade', statusBarAnimation:'fade'}}/>
            <Stack.Screen name="watch" component={WatchScreen} 
            options={{navigationBarHidden:true, statusBarHidden:true,headerShown:false, statusBarTranslucent:true, animation:'fade', statusBarAnimation:'fade', orientation:'landscape',
          }}/>
          </Stack.Navigator>
        </NavigationContainer>
        </AutocompleteDropdownContextProvider>
      </SafeAreaView>
  );
}
