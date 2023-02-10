import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { GoSettings } from 'react-icons/go';

import { adjustColor } from '@/lib/utils';
import { PowerStateValue } from '@/lib/vmUtils';

import VmIcon from '@/Components/images/CreatingVm';
import Paragraph from '@/Components/Paragraph';

type VmInstanceProps = {
  dataId: string;
  color: string;
  serverName: string;
  ipAddress: string;
  status: PowerStateValue;
};
export default function VmInstanceCard(props: VmInstanceProps) {
  const { dataId, color, ipAddress, serverName, status } = props;
  return (
    <Card data-id={dataId} px='1rem' w='100%'>
      <Stack direction='row' alignItems='center' justifyContent='space-around'>
        <VmIcon
          w='5rem'
          flexShrink={0.3}
          screenColor={adjustColor(color, -20)}
          linesColor={adjustColor(color, 20)}
        />
        <CardBody>
          <Heading size='sm'>{serverName}</Heading>
          <Text>{ipAddress}</Text>
          <Flex alignItems='center' gap='0.3rem'>
            <Box w='10px' h='10px' bg={color} borderRadius={9999} />
            <Paragraph>{status}</Paragraph>
          </Flex>
          <Button leftIcon={<GoSettings />}>Manage</Button>
        </CardBody>
      </Stack>
    </Card>
  );
}
