/* eslint-disable react/jsx-props-no-spreading */
import { chakra } from '@chakra-ui/react';

function CreatingVm({
  screenColor = '#D56FE6',
  linesColor = '#E482F4',
  ...rest
}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 48 49'
      {...rest}
    >
      <g clipPath='url(#a)'>
        <path fill='#919191' d='M47.5 1H24v47h23.5V1Z' />
        <path
          fill='#7C7D7D'
          d='M43.6 18.6H27.9v5h15.7v-5Zm0-7.8H27.9v4.9h15.7v-5Zm0 15.7H27.9v4.9h15.7v-5Z'
        />
        <path
          fill={screenColor}
          d='M33.8 12.8H2.5a2 2 0 0 0-2 2v23.4c0 1 .9 2 2 2h31.3c1 0 2-1 2-2V14.7c0-1-1-2-2-2Z'
        />
        <path
          fill='#DAD7E5'
          d='M.5 35.3h35.3v3a2 2 0 0 1-2 2H2.4a2 2 0 0 1-2-2v-3Z'
        />
        <path fill='#C6C3D8' d='M23 46h-9.8l1-5.8H22l1 5.8Z' />
        <path
          fill='#DAD7E5'
          d='M12.3 46H24a2 2 0 0 1 2 2H10.3a2 2 0 0 1 2-2Z'
        />
        <path
          fill='#7C7D7D'
          d='M30.9 45h9.7a3 3 0 0 1 3 3H27.9a3 3 0 0 1 3-3Z'
        />
        <path
          fill='#C6C3D8'
          d='M35.3 7.9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'
        />
        <path
          fill={linesColor}
          d='M11.3 35.3H5.4l8.8-22.5h5.9l-8.8 22.5Zm3.9 0h-2L22 12.8h2l-8.8 22.5Z'
        />
        <path fill='#EDEBF2' d='M18.1 38.2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z' />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 .5h48v48H0z' />
        </clipPath>
      </defs>
    </svg>
  );
}

const VmIcon = chakra(CreatingVm, {
  shouldForwardProp: (prop) =>
    ['fill', 'screenColor', 'linesColor'].includes(prop),
});

export default VmIcon;
