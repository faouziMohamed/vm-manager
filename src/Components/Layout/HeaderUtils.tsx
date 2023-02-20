/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/ban-ts-comment */

import {
  Button,
  ButtonProps,
  Flex,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { MdAddCircle } from 'react-icons/md';

import { adjustColor } from '@/lib/utils';

import CreateNewVm from '@/Components/Layout/CreateNewVm';
import UnStyledLink from '@/Components/Links/UnStyledLink';

const pagesToShowLogOutButton = ['/verify-email'];

export function HeaderActionButton() {
  const { status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return <div />;
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
        flexShrink={1}
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
      as={UnStyledLink}
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

export function AddNewServerButton(props: ButtonProps & { noMl?: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { ...others } = props;
  return (
    <>
      <Button
        bg='#016F54'
        _hover={{ bg: '#008f70' }}
        _focus={{ boxShadow: 'outline' }}
        onClick={onOpen}
        leftIcon={<MdAddCircle />}
        flexShrink={1}
        title='Create a New Virtual machine Instance'
        {...others}
      >
        <Text>New Instance</Text>
      </Button>
      {isOpen && (
        <Portal>
          <CreateNewVm isOpen={isOpen} onClose={onClose} />
        </Portal>
      )}
    </>
  );
}
