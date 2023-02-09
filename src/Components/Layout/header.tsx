/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/ban-ts-comment */
import {
  Box,
  Button,
  Flex,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { MdAddCircle } from 'react-icons/md';

import ChakraImage from '@/Components/ChakraImage';
import CreateNewVm from '@/Components/Layout/CreateNewVm';
import Theme from '@/styles/theme';

// const id: number = Math.floor(Math.random() * 1000000);
const id = 643761;

export default function Header() {
  const githubUrlAvatar = `https://avatars.githubusercontent.com/u/${id}?v=4`;
  return (
    <Box as='nav' w='100%'>
      <Flex
        as='header'
        justifyContent='space-between'
        alignItems='center'
        bg={Theme.colors.tertiary.main}
        px='0.5rem'
        py='0.4rem'
        color='white'
        gap='0.7rem'
      >
        <Text as='h1' fontSize={['0.9rem', '1.2rem']}>
          Manage Servers
        </Text>
        <Box pos='relative' flexShrink={0}>
          {/*  Avatar */}
          <ChakraImage
            src={githubUrlAvatar}
            alt='User Avatar'
            width={70}
            height={70}
            w='40px'
            borderRadius={9999}
            h='40px'
            bg='gray.400'
          />
        </Box>

        <Flex justifyContent='space-between'>
          <AddNewServerButton />
        </Flex>
      </Flex>
    </Box>
  );
}

function AddNewServerButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        bg='#016F54'
        _hover={{ bg: '#008f70' }}
        _focus={{ boxShadow: 'outline' }}
        onClick={onOpen}
        leftIcon={<MdAddCircle />}
      >
        <Text ml={2}>New Instance</Text>
      </Button>
      {isOpen && (
        <Portal>
          <CreateNewVm isOpen={isOpen} onClose={onClose} />
        </Portal>
      )}
    </>
  );
}
