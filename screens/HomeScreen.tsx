import { Text, View } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import TouchableCard from '../components/TouchableCard';
import Icon from 'react-native-vector-icons/FontAwesome6';
import useLanguage from '../hooks/useLanguage';
import { useEffect } from 'react';
import { NavigationProps } from '../utils/types';


const HomeScreen = () => {
  const [{theme}] = useAppTheme();
  const [t] = useLanguage();
  const nav = useNavigation<NavigationProp<NavigationProps,'home'>>();

  useEffect(() => {
    nav.setOptions({
      headerRight(prop:any) {
        return <TouchableCard onClick={() => nav.navigate('search')} className='mx-4'>
          <Icon color={prop.tintColor} name='magnifying-glass' size={22} />
        </TouchableCard>
      },
      title: t('home'),
    })
  },[t,theme,nav]);
  return (
    <View>
      <Text style={{color:theme.colors.text}}>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

