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

import { PowerStateValue } from '@/lib/types';
import { adjustColor } from '@/lib/utils';

import VmInstanceIcon from '@/Components/images/VmInstanceIcon';
import UnStyledLink from '@/Components/Links/UnStyledLink';
import Paragraph from '@/Components/Paragraph';

type VmInstanceProps = {
  instanceId: string;
  color: string;
  serverName: string;
  ipAddress: string;
  status: PowerStateValue;
};
export default function VmInstanceCard(props: VmInstanceProps) {
  const { instanceId, color, ipAddress, serverName, status } = props;
  return (
    <Card data-id={instanceId} px='1rem' w='100%'>
      <Stack direction='row' alignItems='center' justifyContent='space-around'>
        <VmInstanceIcon
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
          <Button
            as={UnStyledLink}
            href={`/vm/${instanceId}`}
            leftIcon={<GoSettings />}
          >
            Manage
          </Button>
        </CardBody>
      </Stack>
    </Card>
  );
}
