import axios, { AxiosError } from 'axios';
import { Text, View, ActivityIndicator } from 'react-native';
import { AsyncState } from '../../../utils/types';
import { useEffect, useState } from 'react';
import TouchableCard from '../../TouchableCard';
import i18n from '../../../i18n';
import { Theme } from '@react-navigation/native';

interface HostProps {
  host: string,
  onSelect: (value: string) => void
  refresh: boolean
  t: typeof i18n.t
  theme: Theme
}

const Host = ({ host, onSelect, refresh, t, theme }: HostProps) => {
  const [state, setState] = useState<AsyncState>('idle');
  const [pingMs, setPing] = useState(0);
  useEffect(() => {
    async function fetch() {
      setState('loading')
      const before = Date.now();
      try {
        await axios.get(host, { validateStatus(_) { return true }, timeout: 3000 });
        setPing(Date.now() - before);
        setState('success');
      }
      catch (error) {
        if (error instanceof AxiosError)
          setState(error.message.includes('timeout') ? 'notfound' : 'fail');
      }

    }
    fetch();
  }, [refresh]);
  function renderStatus() {
    switch (state) {
      case "idle":
        return <Text style={{ color: theme.colors.text }}>Idle</Text>
      case "loading":
        return <Text style={{ color: theme.colors.text }}>{t('settings.host.connecting')}...</Text>
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
      onClick={() => onSelect(host)}>
      <View className='flex flex-row'>
        <View className='flex flex-col flex-grow'>
          <Text className='text-lg' style={{ color: theme.colors.text }}>{host}</Text>
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

