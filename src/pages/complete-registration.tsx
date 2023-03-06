import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Input,
  Stack,
  ToastId,
  UseToastOptions,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { RiBillLine } from 'react-icons/ri';

import { AppUser } from '@/lib/types';
import { adjustColor, capitalize } from '@/lib/utils';
import useAppToast from '@/hooks/useAppToast';

import ChakraImage from '@/Components/ChakraImage';
import AuthLayout from '@/Components/Layout/AuthLayout';
import Paragraph from '@/Components/Paragraph';
import { uploadUserImage } from '@/Services/client/users.service';
import Theme from '@/styles/theme';

CompleteRegistration.auth = true;

function UserAvatarImage({ src }: { src: string }) {
  return (
    <ChakraImage
      src={src}
      alt='Profile Picture'
      objectFit='cover'
      borderRadius='full'
      flexShrink={0}
      width={256}
      height={256}
    />
  );
}

function loadNewUserAvatar(
  e: ChangeEvent<HTMLInputElement>,
  toast: (opt?: UseToastOptions) => ToastId,
  onLoadNewImage: (imageDataOrUrl: string) => void,
) {
  const file = e.target.files?.[0];
  if (!file) return null;
  // file size must not be greater than 500kb
  if (file.size > 500000) {
    toast({
      status: 'error',
      title: 'Upload Failed',
      description: 'File size must be less than or equal to 500kb',
    });
    return null;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    onLoadNewImage(reader.result as string);
  };
  return file;
}

async function sendUserAvatarToServer(
  setUploading: (value: ((prevState: boolean) => boolean) | boolean) => void,
  file: File,
  toast: (opt?: UseToastOptions) => string | number | undefined,
) {
  setUploading(true);
  // save file to server
  if (!file) {
    setUploading(false);
    toast({
      status: 'error',
      title: 'Error Saving Changes',
      description: 'No file was selected',
    });

    return;
  }
  try {
    await uploadUserImage(file);
    toast({
      status: 'success',
      title: 'Image Uploaded',
      description: 'Image uploaded successfully',
    });
  } catch (error) {
    toast({
      status: 'error',
      title: 'Error Saving Changes',
      description: 'An error occurred while saving changes',
    });
  } finally {
    setUploading(false);
  }
}

function UpdatableUserAvatar({ user }: { user: AppUser }) {
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar!);
  const [imageUpdated, setImageUpdated] = useState(false);
  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useAppToast({
    title: 'Avatar Updated',
    position: 'top',
    duration: 10000,
  });
  const imageFile = useRef<File>();
  const handleInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    imageFile.current = loadNewUserAvatar(e, toast, setAvatar) as File;
    setImageUpdated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveChanges = useCallback(async (file: File) => {
    await sendUserAvatarToServer(setUploading, file, toast);
    setImageUpdated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Stack
        justifyContent='center'
        alignItems='center'
        position='relative'
        borderRadius='full'
        bg='red'
      >
        <UserAvatarImage src={avatar} />
        <HStack
          position='absolute'
          justifyContent='flex-start'
          w='100%'
          objectFit='cover'
          alignSelf='flex-end'
          bottom={4}
          left={3}
        >
          <Button
            leftIcon={<MdOutlineEdit size='1.3rem' />}
            colorScheme='secondary'
            size='sm'
            fontWeight={500}
            py={1}
            _hover={{ bg: 'secondary.400' }}
            _active={{ bg: 'secondary.500' }}
            onClick={handleInputClick}
          >
            <Divider orientation='vertical' />
            <Box as='span' ml={2}>
              Upload a picture
            </Box>
          </Button>
          <Input
            type='file'
            name='avatar'
            display='none'
            ref={fileInputRef}
            accept={allowedFileTypes.join(',')}
            onChange={handleAvatarChange}
          />
        </HStack>
      </Stack>
      <Button
        fontSize='xs'
        variant='solid'
        colorScheme='gray'
        isDisabled={avatar === user.avatar || uploading || imageUpdated}
        onClick={() => void handleSaveChanges(imageFile.current!)}
        isLoading={uploading}
      >
        Save Changes
      </Button>
    </>
  );
}

export default function CompleteRegistration() {
  const { data } = useSession();
  const user = data?.user as AppUser;
  return (
    <AuthLayout
      hasForm={false}
      formTitle='Complete Registration'
      submitButtonTitle='Next (Billing Information)'
    >
      <Stack spacing={4} alignItems='center'>
        <Heading as='h3' fontWeight={500} fontSize='1rem' color='secondary.500'>
          Upload a profile picture
        </Heading>
        <UpdatableUserAvatar user={user} />
        <Heading as='h3' fontWeight={600} fontSize='1.4rem'>
          {capitalize(user.firstname)} {capitalize(user.lastname)}
        </Heading>
        <Paragraph color='#01266E'>
          You can skip this part and complete it later
        </Paragraph>
      </Stack>
      <Divider />
      <Button
        type='submit'
        // isLoading={isSubmitting}
        bg={Theme.colors.primary.main}
        color={Theme.colors.primary['50']}
        _hover={{ bg: adjustColor(Theme.colors.primary.main, 10) }}
        _active={{ bg: adjustColor(Theme.colors.primary.main, 20) }}
        leftIcon={<RiBillLine size='1.3rem' />}
      >
        Next (Billing Information)
      </Button>
    </AuthLayout>
  );
}
