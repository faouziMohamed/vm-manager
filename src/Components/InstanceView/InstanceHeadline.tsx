import { Heading, HStack, IconButton, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { IoIosRefresh } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';

import { PowerStateValue } from '@/lib/types';
import { adjustColor, copyToClipboard } from '@/lib/utils';
import { powerStateColors } from '@/lib/vmUtils';

import VmMonitorIcon from '@/Components/images/VmMonitorIcon';
import Paragraph from '@/Components/Paragraph';
import {
  refreshVmInstance,
  updateInstanceFavoriteStatus,
} from '@/Services/client/vm.service';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

const powerStates: PowerStateValue[] = ['starting', 'stopping'];
export default function InstanceHeadline(props: { instance: CreateVmResult }) {
  const { instance } = props;
  const router = useRouter();
  let screenColor = powerStateColors.default;
  if (instance.powerState === 'running') {
    screenColor = powerStateColors.running;
  } else if (powerStates.includes(instance.powerState)) {
    screenColor = powerStateColors.starting;
  }
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
        <HeadingButtonAction instance={instance} />
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

function HeadingButtonAction({ instance }: { instance: CreateVmResult }) {
  const [isFavorite, setIsFavorite] = useState(instance.isFavorite);

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
          void updateInstanceFavoriteStatus(instance.instanceId, instance);
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
