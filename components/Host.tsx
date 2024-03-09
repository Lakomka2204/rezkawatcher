import axios from 'axios';
import { Text, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { AsyncState } from '../utils/types';
import { useEffect, useState } from 'react';
import useAppTheme from '../hooks/useAppTheme';

interface HostProps {
  host: string,
  onSelect: (value: string) => void
}

const Host = (props: HostProps) => {

  const [state, setState] = useState<AsyncState>('idle');
  const [pingMs, setPing] = useState(0);
  const [{ theme }] = useAppTheme();
  const styles = StyleSheet.create({
    text: {
      color: theme.colors.text
    }
  });

  useEffect(() => {
    async function fetch() {
      setState('loading')
      const before = Date.now();
      try {
        await axios.get("https://"+props.host,{validateStatus(_){return true}});
        setPing(Date.now() - before);
        setState('success');
      }
      catch (error) {
        console.error("Axios ping error", error);
        setState('fail');
      }

    }
    fetch();
  }, []);
  function renderStatus() {
    switch (state) {
      case "idle":
        return <Text style={styles.text}>Idle</Text>
      case "loading":
        return <Text style={styles.text}>Connecting...</Text>
        case "success":
          return <Text className='text-green-500'>Response {pingMs}ms</Text>
          case 'fail':
            return <Text className='text-red-600'>Error</Text>
    }
  }
  return (
    <Pressable className='m-1 p-3 rounded-md' style={{backgroundColor:theme.colors.border}} onPress={() => props.onSelect(props.host)}>
      <View className='flex flex-row'>
        <View className='flex flex-col flex-grow'>
          <Text className='text-lg' style={styles.text}>{props.host}</Text>
          {renderStatus()}
        </View>
        {
          state === 'loading' &&
        <ActivityIndicator color={'white'} size={24}/>
        }
      </View>
    </Pressable>
  );
};

export default Host;

