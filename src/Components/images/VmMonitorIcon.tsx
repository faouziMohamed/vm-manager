/* eslint-disable react/jsx-props-no-spreading */

import { chakra } from '@chakra-ui/react';

function DynamicSVGMonitor({
  screenColor = '#D56FE6',
  linesColor = '#E482F4',
  ...rest
}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 29 29'
      {...rest}
    >
      <path
        fill={screenColor}
        d='M27.3 0H1.6C.8 0 0 .7 0 1.6v19.2c0 1 .8 1.6 1.6 1.6h25.7c.9 0 1.6-.7 1.6-1.6V1.6c0-.9-.7-1.6-1.6-1.6Z'
      />
      <path
        fill='#DAD7E5'
        d='M0 18.4h29v2.4a1.6 1.6 0 0 1-1.7 1.7H1.6A1.6 1.6 0 0 1 0 20.8v-2.4Z'
      />
      <path fill='#C6C3D8' d='M18.5 27.2h-8l.8-4.8h6.4l.8 4.8Z' />
      <path
        fill='#DAD7E5'
        d='M9.6 27.2h9.7a1.6 1.6 0 0 1 1.6 1.7H8a1.6 1.6 0 0 1 1.7-1.7Z'
      />
      <path
        fill={linesColor}
        d='M8.8 18.4H4L11.3 0H16L8.8 18.4Zm3.2 0h-1.6L17.7 0h1.6L12 18.4Z'
      />
      <path fill='#EDEBF2' d='M14.5 20.8a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Z' />
    </svg>
  );
}

const VmMonitorIcon = chakra(DynamicSVGMonitor, {
  shouldForwardProp: (prop) =>
    ['fill', 'screenColor', 'linesColor'].includes(prop),
});

VmMonitorIcon.displayName = 'VmMonitorIcon';
export default VmMonitorIcon;
