import { Text, View } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';


const HomeScreen = () => {
  const [{theme}] = useAppTheme();
  return (
    <View>
      <Text style={{color:theme.colors.text}}>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

