import { Text, View } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';
import { useMMKVString } from 'react-native-mmkv';
import config from '../config';
import useLanguage from '../hooks/useLanguage';
import HostPickerv2 from '../components/settings/host/HostPicker';
import GeneralPicker from '../components/settings/general/GeneralPicker';
const SettingsScreen = () => {
  const [{ theme, value: themeValue }, setTheme] = useAppTheme();
  const [host, setHost] = useMMKVString(config.keys.mainHost);
  const [cdn, setCdn] = useMMKVString(config.keys.cdnHost);
  const [t, lang, setLang] = useLanguage();
  return (
    <View className='m-3'>
      <Text style={{ color: theme.colors.text }} className='mx-1'>{t('settings.hint')}</Text>
      <GeneralPicker
        tkey='lang'
        setValue={setLang}
        t={t}
        theme={theme}
        value={lang}
        values={config.langs}
      />
      <GeneralPicker
        tkey='theme'
        setValue={setTheme}
        t={t}
        theme={theme}
        value={themeValue}
        values={config.themes}
      />
      <HostPickerv2
        setValue={setHost}
        t={t}
        theme={theme}
        tkey='mainHost'
        value={host}
        values={config.hosts}
      />
      <HostPickerv2
        setValue={setCdn}
        t={t}
        theme={theme}
        tkey='cdnHost'
        value={cdn}
        values={config.cdns}
      />
    </View>
  );
};

export default SettingsScreen;

