import {useTheme} from '@react-navigation/native';
import cn from 'classnames';
import React from 'react';
import {Text} from 'react-native';

function Title() {
  const textColor = useTheme().colors.text;
  return (
    <Text className={'text-2xl align-middle'} style={{color: textColor}}>
      Rezka Watcher
    </Text>
  );
}

export default Title;
