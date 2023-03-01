import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import { GoSignOut } from 'react-icons/go';
import { MdManageAccounts, MdSettings } from 'react-icons/md';

import { LOGIN_PAGE } from '@/lib/client-route';
import { AppUser } from '@/lib/types';
import { adjustColor, formatName } from '@/lib/utils';

import ChakraImage from '@/Components/ChakraImage';
import Paragraph from '@/Components/Paragraph';
import Theme from '@/styles/theme';

export default function UserOptionsAvatar() {
  const id = 643761;
  const githubUrlAvatar = `https://avatars.githubusercontent.com/u/${id}?v=4`;
  const { data: session } = useSession();
  const user = session?.user as AppUser;
  return (
    <Menu>
      <MenuButton flexShrink={0.1} aria-label='Options' pos='relative'>
        <ChakraImage
          src={githubUrlAvatar}
          alt='User Avatar'
          width={70}
          height={70}
          w='40px'
          borderRadius={9999}
          h='40px'
        />
      </MenuButton>

      <MenuList color='#222' px='0.6rem' py='0.5rem'>
        <MenuItem pointerEvents='none' borderRadius='0.5rem'>
          <HStack gap='0.5rem' alignItems='center' py='0.2rem'>
            <ChakraImage
              src={user.avatar ?? githubUrlAvatar}
              alt='User Avatar'
              width={70}
              height={70}
              w='40px'
              borderRadius={9999}
              h='40px'
            />
            <Paragraph fontWeight={700} fontSize='1rem'>
              {formatName(user.firstname, user.lastname)}
            </Paragraph>
          </HStack>
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<MdManageAccounts size='2rem' />}>
          <Stack spacing={0}>
            <Paragraph fontWeight={500}>Account</Paragraph>
            <Paragraph fontSize='0.8rem' color='gray.500'>
              Manage your account settings
            </Paragraph>
          </Stack>
        </MenuItem>
        <MenuItem icon={<MdSettings size='2rem' />}>
          <Stack spacing={0}>
            <Paragraph fontWeight={500}>Settings</Paragraph>
            <Paragraph fontSize='0.8rem' color='gray.500'>
              Manage app preferences
            </Paragraph>
          </Stack>
        </MenuItem>
        <MenuDivider />

        <MenuItem p={0} as={Box}>
          <Button
            bg='#3C8094'
            color={Theme.colors.secondary[50]}
            _hover={{ bg: adjustColor('#3C8094', 10) }}
            _active={{ bg: adjustColor('#3C8094', 20) }}
            w='100%'
            leftIcon={<GoSignOut size='1.2rem' />}
            fontFamily='var(--font-secondary)'
            fontSize='1rem'
            onClick={() => void signOut({ callbackUrl: LOGIN_PAGE })}
          >
            <Box mt='-1'>Log Out</Box>
          </Button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
