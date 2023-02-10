import { chakra } from '@chakra-ui/react';
import Link from 'next/link';

const ChakraLink = chakra(Link, {
  shouldForwardProp(prop: string): boolean {
    return ['href', 'ref', 'children'].includes(prop);
  },
});

ChakraLink.displayName = 'ChakraLink';

export default ChakraLink;
