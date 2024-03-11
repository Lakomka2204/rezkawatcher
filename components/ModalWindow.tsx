import { Text, View, Modal, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, Pressable } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';
import { ReactNode, Ref, forwardRef, useImperativeHandle, useState } from 'react';
import TouchableCard from './TouchableCard';
import useLanguage from '../hooks/useLanguage';

interface ModalProps {
  title: string
  children: ReactNode
}
export interface ModalRef {
  show: () => void
  hide: () => void
  set: (value: boolean) => void
}
const ModalWindow = (props: ModalProps, ref: Ref<ModalRef>) => {
  const [{ theme }] = useAppTheme();
  const [t] = useLanguage();
  const [visible, setVisible] = useState(false);
  useImperativeHandle(ref, () => ({
    hide() {
      setVisible(false)
    },
    show() {
      setVisible(true)
    },
    set(value) {
      setVisible(value);
    },
  }));
  return (
    <Modal transparent animationType='fade' visible={visible} className='flex' onRequestClose={() => setVisible(false)}>
      <TouchableOpacity className='flex-grow m-auto w-screen' style={{ backgroundColor: '#0006' }} activeOpacity={1} onPress={() => setVisible(false)}>
        <Pressable className='m-auto rounded-md opacity-100' style={{ backgroundColor: theme.colors.card, minWidth: '60%', maxWidth:'80%' }}>
          <Text style={{ color: theme.colors.text }} className='text-lg p-2 text-center'>{props.title}</Text>
          <View
            className='border-y p-2'
            style={{ borderColor: theme.colors.text }}
            children={props.children} 
            pointerEvents='none'/>
          <TouchableCard className='p-2 rounded-b-md'
            onClick={() => setVisible(false)}>
            <Text
              style={{ color: theme.colors.primary }}
              className='text-center'>{t('close').toUpperCase()}</Text>
          </TouchableCard>
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
};

export default forwardRef(ModalWindow);
