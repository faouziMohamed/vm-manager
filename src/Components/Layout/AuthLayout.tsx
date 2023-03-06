import {
  Button,
  Divider,
  Flex,
  FlexProps,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';

import { adjustColor } from '@/lib/utils';

import Layout from '@/Components/Layout/Layout';
import UnderlineLink from '@/Components/Links/UnderlineLink';
import Paragraph from '@/Components/Paragraph';
import Theme from '@/styles/theme';

type FormAltAction = {
  text?: string;
  link: string;
  linkText: string;
};
type AuthLayoutParams = FlexProps & {
  onSubmit?: () => void;
  formTitle: string;
  submitButtonTitle: string;
  isSubmitting?: boolean;
  errors?: string[] | undefined;
  formAltAction?: FormAltAction;
  formAltAction2?: FormAltAction;
  hasForm?: boolean;
};

export default function AuthLayout(props: AuthLayoutParams) {
  const {
    children,
    errors = [] as string[],
    formTitle,
    submitButtonTitle,
    isSubmitting = false,
    onSubmit = () => {},
    formAltAction,
    formAltAction2,
    hasForm = true,
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
          <FormTitle formTitle={formTitle} />
          <Divider />
          <Stack
            as={hasForm ? 'form' : 'section'}
            spacing={4}
            onSubmit={onSubmit}
            w='100%'
          >
            {!!errors.length && (
              <List spacing={3} color={Theme.colors.danger.main}>
                {errors.map((error) => (
                  <ListItem key={error}>
                    <ListIcon as={MdOutlineErrorOutline} />
                    {error}
                  </ListItem>
                ))}
              </List>
            )}
            {children}
            {hasForm && (
              <Button
                type='submit'
                isLoading={isSubmitting}
                bg={Theme.colors.primary.main}
                color={Theme.colors.primary['50']}
                _hover={{ bg: adjustColor(Theme.colors.primary.main, 10) }}
                _active={{ bg: adjustColor(Theme.colors.primary.main, 20) }}
              >
                {submitButtonTitle}
              </Button>
            )}
          </Stack>
          {!!formAltAction || (!!formAltAction2 && <Divider />)}
          <Stack spacing={0} alignItems='center'>
            {!!formAltAction && (
              <Paragraph
                fontFamily='var(--font-secondary)'
                fontSize='0.87rem'
                textAlign='end'
                color='gray.600'
              >
                {formAltAction?.text}
                <UnderlineLink
                  href={formAltAction.link}
                  fontWeight='500'
                  color={adjustColor(Theme.colors.primary.main, null, 80)}
                >
                  {formAltAction.linkText}
                </UnderlineLink>
              </Paragraph>
            )}
            {!!formAltAction2 && (
              <Paragraph
                fontFamily='var(--font-secondary)'
                fontSize='0.87rem'
                textAlign='end'
                color='gray.600'
              >
                {formAltAction2?.text}
                <UnderlineLink
                  href={formAltAction2.link}
                  color='warning.main'
                  fontWeight='400'
                >
                  {formAltAction2.linkText}
                </UnderlineLink>
              </Paragraph>
            )}
          </Stack>
        </Stack>
      </Flex>
    </Layout>
  );
}

function FormTitle({ formTitle }: { formTitle: string }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return <div />;
  return (
    <Heading as='h2' textAlign='center' fontSize='1.3rem'>
      {formTitle}
    </Heading>
  );
}
