import { Box, Heading, HStack, IconButton, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { IoIosRefresh } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';
import { KeyedMutator } from 'swr';

import { VMInstance } from '@/lib/types';
import { adjustColor } from '@/lib/utils';
import { powerStateColors } from '@/lib/vmUtils';

import VmMonitorIcon from '@/Components/images/VmMonitorIcon';
import PageBreadcrumb from '@/Components/InstanceView/PageBreadcrumb';
import Layout from '@/Components/Layout/Layout';
import Paragraph from '@/Components/Paragraph';
import { useVmInstance } from '@/Services/hooks';

function HeadingButtonAction({
  instance,
  mutate,
}: {
  instance: VMInstance;
  mutate: KeyedMutator<VMInstance>;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setIsFavorite(instance?.isFavorite ?? false);
  }, [mounted, instance]);
  return (
    <>
      <IconButton
        alignSelf='flex-start'
        h='1.5rem'
        px='0.1rem'
        minW='none'
        variant='ghost'
        aria-label='Button to toggle mark a vm as favorite'
        icon={isFavorite ? <AiFillStar /> : <AiOutlineStar />}
        onClick={() => {
          setIsFavorite((f) => !f);
          instance.isFavorite = isFavorite;
          void mutate(instance);
        }}
      />
      <IconButton
        alignSelf='flex-start'
        h='1.5rem'
        px='0.1rem'
        minW='none'
        variant='ghost'
        aria-label='Copy serverName to clipboard'
        icon={<MdContentCopy />}
      />

      <IconButton
        alignSelf='flex-start'
        h='1.5rem'
        px='0.1rem'
        minW='none'
        variant='ghost'
        aria-label='Refresh vm data'
        icon={<IoIosRefresh />}
      />
    </>
  );
}

export default function VmPage() {
  const router = useRouter();
  const { instanceId } = router.query as { instanceId: string | undefined };
  const { data: instance, mutate } = useVmInstance(instanceId);

  if (!instance) return null;
  const vmColor =
    instance.status === 'running'
      ? powerStateColors.running
      : powerStateColors.default;
  return (
    <Layout>
      <Box fontFamily='var(--font-primary)'>
        <PageBreadcrumb
          shouldRenderName={instanceId}
          currentPageLink={router.asPath}
          serverName={instance.serverName}
        />
        <HStack
          alignItems='flex-start'
          spacing={2}
          justifyContent='space-between'
        >
          <HStack alignItems='flex-start' spacing={2}>
            <VmMonitorIcon
              w='3.5rem'
              flexShrink={0.3}
              screenColor={vmColor}
              linesColor={adjustColor(vmColor, 10)}
            />
            <Stack spacing={0} pt='0.2rem'>
              <Heading as='h2' size='xs'>
                {instance.serverName}
              </Heading>
              <Paragraph fontSize='xs'>Virtual machine</Paragraph>
            </Stack>
            <HeadingButtonAction instance={instance} mutate={mutate} />
          </HStack>
          <IconButton
            alignSelf='flex-start'
            h='1.5rem'
            p='0.5rem'
            variant='ghost'
            aria-label='Close the vm instance page back to the previous page'
            icon={<GrClose />}
          />
        </HStack>
      </Box>
    </Layout>
  );
}
