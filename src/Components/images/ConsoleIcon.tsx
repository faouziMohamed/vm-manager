/* eslint-disable react/jsx-props-no-spreading */

import { chakra, ChakraProps } from '@chakra-ui/react';

function ConsoleIconComponent(props: ChakraProps & { className?: string }) {
  const { className = '' } = props;
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 71 25'
    >
      <path
        fill='#017489'
        d='m2 8 51-2 15-1V0C55 2 42 6 30 11l-2 3c0 1 1 2 3 2l10 2v-4l-6 3c-2 1-2 3-1 5 1 3 3 3 5 3 3 0 3-5 0-5h-1c0 1 0 0 0 0v1l1-1 4-2c2 0 2-3 0-4l-12-3v5c12-5 25-9 38-11 3-1 2-5-1-5L17 2 2 3c-3 0-3 5 0 5Z'
      />
    </svg>
  );
}

const ConsoleIcon = chakra(ConsoleIconComponent, {
  shouldForwardProp: (prop) => ['fill'].includes(prop),
});

ConsoleIcon.displayName = 'ConsoleIcon';
export default ConsoleIcon;
