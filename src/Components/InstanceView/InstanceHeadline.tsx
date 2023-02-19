import { Heading, HStack, IconButton, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { IoIosRefresh } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';
import { KeyedMutator } from 'swr';

import { VMInstance } from '@/lib/types';
import { adjustColor, copyToClipboard } from '@/lib/utils';
import { powerStateColors } from '@/lib/vmUtils';

import VmMonitorIcon from '@/Components/images/VmMonitorIcon';
import Paragraph from '@/Components/Paragraph';
import { refreshVmInstance } from '@/Services/client/vm.service';

export default function InstanceHeadline(props: {
  instance: VMInstance;
  mutate: KeyedMutator<VMInstance>;
}) {
  const { instance, mutate } = props;
  const router = useRouter();
  const screenColor =
    instance.powerState === 'running'
      ? powerStateColors.running
      : powerStateColors.default;
  return (
    <HStack alignItems='flex-start' spacing={2} justifyContent='space-between'>
      <HStack alignItems='flex-start' spacing={2}>
        <VmMonitorIcon
          w='3.5rem'
          flexShrink={0.3}
          screenColor={screenColor}
          linesColor={adjustColor(screenColor, 10)}
        />
        <Stack spacing={0} pt='0.2rem'>
          <Heading as='h2' size='xs' fontFamily='var(--font-secondary)'>
            {instance.serverName}
          </Heading>
          <Paragraph fontSize='xs'>Virtual machine</Paragraph>
        </Stack>
        <HeadingButtonAction instance={instance} mutate={mutate} />
      </HStack>
      <IconButton
        h='1.5rem'
        p='0.5rem'
        variant='ghost'
        aria-label='Close the vm instance page back to the previous page'
        title='Close the vm instance page back to the previous page'
        icon={<GrClose />}
        onClick={() => {
          void router.push('/');
        }}
      />
    </HStack>
  );
}

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
        title='Button to toggle mark a vm as favorite'
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
        aria-label={"Copy the server's to clipboard"}
        title={"Copy server's to clipboard"}
        icon={<MdContentCopy />}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() => {
          void copyToClipboard(instance.serverName);
        }}
      />

      <IconButton
        alignSelf='flex-start'
        h='1.5rem'
        px='0.1rem'
        minW='none'
        variant='ghost'
        aria-label='Refresh the vm data'
        title='Refresh the vm data'
        icon={<IoIosRefresh />}
        onClick={() => {
          void refreshVmInstance(instance.instanceId);
        }}
      />
    </>
  );
}
