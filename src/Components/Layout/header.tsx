/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/ban-ts-comment */
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { BiLogInCircle } from 'react-icons/bi';
import { MdAddCircle } from 'react-icons/md';

import { adjustColor } from '@/lib/utils';

import ChakraImage from '@/Components/ChakraImage';
import CreateNewVm from '@/Components/Layout/CreateNewVm';
import ButtonLink from '@/Components/Links/ButtonLink';
import UnStyledLink from '@/Components/Links/UnStyledLink';
import Theme from '@/styles/theme';

// const id: number = Math.floor(Math.random() * 1000000);
const id = 643761;
const pagesToShowLogOutButton = ['/verify-email'];
function ActionButton() {
  const { status } = useSession();
  const router = useRouter();

  const actionLink = {
    signIn: {
      text: 'Sign In',
      link: '/signin',
    },
    signUp: {
      text: 'Sign Up',
      link: '/register',
    },
  };
  const isSignInPage = router.asPath === actionLink.signIn.link;
  if (status === 'authenticated') {
    return pagesToShowLogOutButton.includes(router.asPath) ? (
      <Button
        bg='#016F54'
        _hover={{ bg: '#008f70' }}
        _focus={{ boxShadow: 'outline' }}
        leftIcon={<BiLogInCircle />}
        onClick={() => void signOut({ callbackUrl: '/signin' })}
      >
        <Text>Log Out</Text>
      </Button>
    ) : (
      <Flex justifyContent='space-between'>
        <AddNewServerButton />
      </Flex>
    );
  }

  return (
    <Button
      as={ButtonLink}
      href={isSignInPage ? actionLink.signUp.link : actionLink.signIn.link}
      color='#00404E'
      bg='#CDF6FF'
      _hover={{
        bg: adjustColor('#CDF6FF', 15),
        color: adjustColor('#00404E', -70),
      }}
      _focus={{ boxShadow: 'outline' }}
    >
      <Text>
        {isSignInPage ? actionLink.signUp.text : actionLink.signIn.text}
      </Text>
    </Button>
  );
}

export default function Header() {
  const githubUrlAvatar = `https://avatars.githubusercontent.com/u/${id}?v=4`;
  return (
    <Box as='nav' w='100%'>
      <Flex
        as='header'
        justifyContent='space-between'
        alignItems='center'
        bg={Theme.colors.secondary.main}
        px='0.5rem'
        py='0.4rem'
        color='white'
        gap='0.7rem'
      >
        <UnStyledLink href='/' fontSize={['0.9rem', '1.2rem']}>
          Manage Servers
        </UnStyledLink>
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
        {/* { */}
        {/*  status!=='authenticated' */}
        {/* } */}
        <ActionButton />
      </Flex>
    </Box>
  );
}

export function AddNewServerButton(props: ButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        bg='#016F54'
        _hover={{ bg: '#008f70' }}
        _focus={{ boxShadow: 'outline' }}
        onClick={onOpen}
        leftIcon={<MdAddCircle />}
        {...props}
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
