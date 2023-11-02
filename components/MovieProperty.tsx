import React from "react";
import { View, Text } from "react-native";

function MovieProperty({ name, value } : {name:string,value:string}) {
  return (
    <View>
    {value ? (
      <View> 
        <Text className={propNameText}>{name}</Text>
        <Text className={propValueText}>{value}</Text>
        </View>
      ) : <></>}
      </View>
  );
}
const propNameText = 'm-2 text-xl text-gray-500 text-left';
const propValueText = 'text-xl text-black text-center';
export default MovieProperty;
