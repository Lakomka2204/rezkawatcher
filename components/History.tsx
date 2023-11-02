import { Button, Text, TextInput, View } from "react-native";

function History() {
  
  return (
    <View>
      <Text className={"text-4xl text-black font-semibold self-start mt-2 mb-2"}>
        History
      </Text>
      <View>
        <Text className="text-black">There's no movies yet, so start watching!</Text>
      </View>
    </View>
  );
}

export default History;
