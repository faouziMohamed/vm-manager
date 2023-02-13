import {
  Button,
  Divider,
  Flex,
  FlexProps,
  Heading,
  Stack,
} from '@chakra-ui/react';

import { adjustColor } from '@/lib/utils';

import Layout from '@/Components/Layout/Layout';
import UnderlineLink from '@/Components/Links/UnderlineLink';
import Paragraph from '@/Components/Paragraph';
import Theme from '@/styles/theme';

type AuthLayoutParams = FlexProps & {
  onSubmit: () => void;
  formTitle: string;
  submitButtonTitle: string;
  formAltAction?: {
    text?: string;
    link: string;
    linkText: string;
  };
};
export default function AuthLayout(props: AuthLayoutParams) {
  const {
    children,
    formTitle,
    submitButtonTitle,
    onSubmit,
    formAltAction,
    ...others
  } = props;

  return (
    <Layout px={0} bg='#F4F5F7'>
      <Flex
        w='100%'
        h='100%'
        justifyContent='center'
        py='1rem'
        px={{ base: '0.3rem', xs: '1.5rem' }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...others}
      >
        <Stack
          px='1.2rem'
          py='1.5rem'
          borderWidth={1}
          borderRadius='5px'
          maxW='32.5rem'
          w='100%'
          bg='#fff'
          spacing={5}
        >
          <Heading as='h2' fontSize='1.3rem'>
            {formTitle}
          </Heading>
          <Divider />
          <Stack as='form' spacing={4} onSubmit={onSubmit} w='100%'>
            {children}
            <Button
              type='submit'
              bg={Theme.colors.primary.main}
              color={Theme.colors.primary['50']}
              _hover={{ bg: adjustColor(Theme.colors.primary.main, 10) }}
              _active={{ bg: adjustColor(Theme.colors.primary.main, 20) }}
            >
              {submitButtonTitle}
            </Button>
          </Stack>
          <Divider />
          {!!formAltAction && (
            <Paragraph
              fontFamily='var(--font-secondary)'
              fontSize='0.87rem'
              textAlign='end'
            >
              {formAltAction?.text}
              <UnderlineLink href={formAltAction.link}>
                {formAltAction.linkText}
              </UnderlineLink>
            </Paragraph>
          )}
        </Stack>
      </Flex>
    </Layout>
  );
}
