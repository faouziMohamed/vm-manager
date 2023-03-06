import {
  ToastId,
  ToastPosition,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';
import { useCallback, useRef } from 'react';

export type AppToastProps = {
  title: string;
  position: ToastPosition;
  status?: UseToastOptions['status'];
  description?: string;
  duration?: UseToastOptions['duration'];
};
export default function useAppToast({
  title,
  status,
  position,
  description,
  duration = null,
}: AppToastProps) {
  const toastRef = useRef<ToastId>();
  const toast = useToast();

  return useCallback(
    (opt?: UseToastOptions) => {
      toastRef.current = toast({
        title,
        position,
        isClosable: true,
        description,
        status: status || 'info',
        duration: duration || null,
        ...opt,
      });
      return toastRef.current;
    },
    [description, duration, position, status, title, toast],
  );
}
