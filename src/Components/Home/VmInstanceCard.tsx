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

import { adjustColor } from '@/lib/utils';
import { PowerStateValue } from '@/lib/vmUtils';

import VmIcon from '@/Components/images/CreatingVm';
import Paragraph from '@/Components/Paragraph';

type VmInstanceProps = {
  dataId: string;
  hex: string;
  name: string;
  ipAddress: string;
  status: PowerStateValue;
};
export default function VmInstanceCard(props: VmInstanceProps) {
  const { dataId, hex, ipAddress, name, status } = props;
  return (
    <Card data-id={dataId} px='1rem'>
      <Stack direction='row' alignItems='center' justifyContent='space-around'>
        <VmIcon
          w='5rem'
          flexShrink={0.3}
          screenColor={adjustColor(hex, -20)}
          linesColor={adjustColor(hex, 20)}
        />
        <CardBody>
          <Heading size='sm'>{name}</Heading>
          <Text>{ipAddress}</Text>
          <Flex alignItems='center' gap='0.3rem'>
            <Box w='10px' h='10px' bg={hex} borderRadius={9999} />
            <Paragraph>{status}</Paragraph>
          </Flex>
          <Button>Manage</Button>
        </CardBody>
      </Stack>
    </Card>
  );
}
