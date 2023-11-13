import {useTheme} from '@react-navigation/native';
import {Text, View} from 'react-native';

function History() {
  const colors = useTheme().colors;
  return (
    <View>
      <Text
        style={{color: colors.text}}
        className={'text-4xl font-semibold self-start mt-2 mb-2'}>
        History
      </Text>
      <View>
        <Text style={{color: colors.text}}>
          There's no movies yet, so start watching!
        </Text>
        <Text style={{color: colors.primary}}>Primary</Text>
        <Text style={{color: colors.background}}>Background</Text>
        <Text style={{color: colors.border}}>Border</Text>
        <Text style={{color: colors.card}}>Card</Text>
        <Text style={{color: colors.notification}}>notification</Text>
        <Text style={{color: colors.text}}>text</Text>
      </View>
    </View>
  );
}

export default History;
