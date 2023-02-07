import { chakra } from '@chakra-ui/react';
import NextImage from 'next/image';

const ChakraImage = chakra(NextImage, {
  shouldForwardProp: (prop) =>
    ['height', 'width', 'quality', 'src', 'alt'].includes(prop),
});

export default ChakraImage;
