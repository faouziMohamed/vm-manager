import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useMediaQuery,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { BsFillPlayFill, BsStopFill } from 'react-icons/bs';
import { GrConnect } from 'react-icons/gr';
import { MdRestartAlt } from 'react-icons/md';
import { RiDeleteBin5Line } from 'react-icons/ri';

import { VMInstance } from '@/lib/types';

import { mutateVmInstance } from '@/Services/client/vm.service';

type ControlItem = {
  icon: IconType;
  text: string;
  q: QueryType;
  title: string;
};
type QueryType = 'xs' | 'sm' | 'md';

const controlItems: ControlItem[] = [
  {
    icon: MdRestartAlt,
    text: 'Restart',
    q: 'xs',
    title: 'Restart the VM instance',
  },
  { icon: BsStopFill, text: 'Stop', q: 'sm', title: 'Stop the VM instance' },
  {
    icon: RiDeleteBin5Line,
    text: 'Delete',
    q: 'md',
    title: 'Delete the VM instance',
  },
];

export default function VmInstanceControlButtons(props: {
  instance: VMInstance;
}) {
  const { instance } = props;
  const [isXs, isSm, isMd] = useMediaQuery(
    ['(min-width: 332px)', '(min-width: 406px)', '(min-width: 475px)'],
    { ssr: true, fallback: false },
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [mounted]);
  if (!mounted) return null;
  return (
    <HStack
      spacing={2}
      w='100%'
      borderBottomWidth='3px'
      borderColor='gray.500'
      overflowX='auto'
    >
      <ButtonGroup variant='ghost' fontFamily='var(--font-secondary)'>
        <Button
          fontSize='0.8rem'
          px='0.5rem'
          h='2.2rem'
          leftIcon={<GrConnect />}
          ari-label='Click to download an rdp file to connect to the instance'
          title='Click to download an rdp file to connect to the instance'
        >
          Connect
        </Button>
        <Button
          fontSize='0.8rem'
          px='0.6rem'
          h='2.2rem'
          leftIcon={<BsFillPlayFill />}
          ari-label='Click to start the instance'
          title='Click to start the instance'
          onClick={() => {
            instance.powerState = 'running';
            void mutateVmInstance(instance.instanceId, instance);
          }}
        >
          Start
        </Button>

        {isXs &&
          controlItems.map(
            (item) =>
              item.q === 'xs' && (
                <Button
                  key={item.text}
                  fontSize='0.8rem'
                  px='0.6rem'
                  h='2.2rem'
                  aria-label={item.text}
                  leftIcon={<item.icon />}
                  title={item.title}
                >
                  {item.text}
                </Button>
              ),
          )}
        {isSm &&
          controlItems.map(
            (item) =>
              item.q === 'sm' && (
                <Button
                  key={item.text}
                  fontSize='0.8rem'
                  px='0.6rem'
                  h='2.2rem'
                  aria-label={item.text}
                  leftIcon={<item.icon />}
                  title={item.title}
                >
                  {item.text}
                </Button>
              ),
          )}
        {isMd &&
          controlItems.map(
            (item) =>
              item.q === 'md' && (
                <Button
                  key={item.text}
                  fontSize='0.8rem'
                  px='0.6rem'
                  h='2.2rem'
                  aria-label={item.text}
                  title={item.title}
                  leftIcon={<item.icon />}
                >
                  {item.text}
                </Button>
              ),
          )}

        {!isMd && <ShowDynamicMenu isXs={isXs} isSm={isSm} isMd={isMd} />}
      </ButtonGroup>
    </HStack>
  );
}
function ShowDynamicMenu(props: {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
}) {
  const { isXs, isSm, isMd } = props;
  return (
    <Menu>
      <MenuButton
        px='0.3rem'
        as={IconButton}
        icon={<BiDotsHorizontalRounded />}
        title='Click to show more options'
        aria-label='Click to show more options'
      />
      <Portal>
        <MenuList>
          {!isXs &&
            !isSm &&
            !isMd &&
            controlItems.map((item) => (
              <MenuItem
                key={item.text}
                icon={<item.icon />}
                aria-label={item.title}
                title={item.title}
              >
                {item.text}
              </MenuItem>
            ))}

          {isXs &&
            !isSm &&
            !isMd &&
            controlItems
              .filter((item) => !(item.q === 'xs'))
              .map((item) => (
                <MenuItem
                  key={item.text}
                  icon={<item.icon />}
                  aria-label={item.title}
                  title={item.title}
                >
                  {item.text}
                </MenuItem>
              ))}

          {isSm &&
            !isMd &&
            controlItems
              .filter((item) => item.q === 'md')
              .map((item) => (
                <MenuItem
                  key={item.text}
                  icon={<item.icon />}
                  aria-label={item.title}
                  title={item.title}
                >
                  {item.text}
                </MenuItem>
              ))}
        </MenuList>
      </Portal>
    </Menu>
  );
}
