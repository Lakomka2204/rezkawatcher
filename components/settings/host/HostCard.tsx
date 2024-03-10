import axios, { AxiosError } from 'axios';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AsyncState } from '../../../utils/types';
import { useEffect, useState } from 'react';
import useAppTheme from '../../../hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import TouchableCard from '../../TouchableCard';

interface HostProps {
  host: string,
  onSelect: (value: string) => void
  refresh: boolean
}

const Host = (props: HostProps) => {
  const [state, setState] = useState<AsyncState>('idle');
  const [pingMs, setPing] = useState(0);
  const { t } = useTranslation();
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
        await axios.get(props.host, { validateStatus(_) { return true }, timeout: 3000 });
        setPing(Date.now() - before);
        setState('success');
      }
      catch (error) {
        if (error instanceof AxiosError)
          setState(error.message.includes('timeout') ? 'notfound' : 'fail');
      }

    }
    fetch();
  }, [props.refresh]);
  function renderStatus() {
    switch (state) {
      case "idle":
        return <Text style={styles.text}>Idle</Text>
      case "loading":
        return <Text style={styles.text}>{t('settings.host.connecting')}...</Text>
      case "success":
        return <Text className='text-green-500'>{t('settings.host.success', { ms: pingMs })}</Text>
      case 'fail':
        return <Text className='text-red-600'>{t('settings.host.fail')}</Text>
      case "notfound":
        return <Text className='text-red-600'>{t('settings.host.notfound')}</Text>
    }
  }
  return (
    <TouchableCard
      style={{ backgroundColor: theme.colors.card }}
      className='m-1 p-3 rounded-md'
      onClick={() => props.onSelect(props.host)}>
      <View className='flex flex-row'>
        <View className='flex flex-col flex-grow'>
          <Text className='text-lg' style={styles.text}>{props.host}</Text>
          {renderStatus()}
        </View>
        {
          state === 'loading' &&
          <ActivityIndicator color={theme.colors.text} size={24} />
        }
      </View>
    </TouchableCard>

  );
};

export default Host;

