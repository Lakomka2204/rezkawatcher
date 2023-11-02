import React from 'react'
import Title from '../components/Title'
import SearchBar from '../components/SearchBar'
import { View } from 'react-native'
import History from '../components/History'
function Main() {
  return (
    <View className={"flex-1 items-stretch p-3 self-stretch"}>
    <SearchBar/>
    <History/>
    </View>
  )
}

export default Main