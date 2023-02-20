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
import { KeyedMutator } from 'swr';

import { PowerStateValue } from '@/lib/types';

import { manageVmInstance } from '@/Services/client/vm.service';
import {
  CreateVmResult,
  ManageVmAction,
} from '@/Services/server/azureService/azure.types';

type ControlItem = {
  icon: IconType;
  text: string;
  q?: QueryType;
  title: string;
  action: ManageVmAction;
  actioning: PowerStateValue | 'deleting' | 'restarting';
  disabled?: boolean;
};
type QueryType = 'xs' | 'sm' | 'md';

function getControlItems(instance: CreateVmResult) {
  const controlItems: ControlItem[] = [
    {
      icon: MdRestartAlt,
      text: 'Restart',
      q: 'xs',
      title: 'Restart the VM instance',
      action: 'restart',
      actioning: 'restarting',
      disabled: ['starting', 'stopping', 'stopped'].includes(
        instance.powerState,
      ),
    },
    {
      icon: BsStopFill,
      text: 'Stop',
      q: 'sm',
      title: 'Stop the VM instance',
      action: 'stop',
      actioning: 'stopping',
      disabled: ['stopped', 'stopping', 'starting'].includes(
        instance.powerState,
      ),
    },
    {
      icon: RiDeleteBin5Line,
      text: 'Delete',
      q: 'md',
      title: 'Delete the VM instance',
      action: 'delete',
      actioning: 'deleting',
    },
  ];
  return controlItems;
}

function onClick(
  instance: CreateVmResult,
  item: ControlItem,
  mutate: KeyedMutator<CreateVmResult>,
) {
  return () => {
    instance.powerState = item.actioning as PowerStateValue;
    void mutate(instance);
    void manageVmInstance(instance, item.action);
  };
}

function HeadlineControlButton(props: {
  item: ControlItem;
  instance: CreateVmResult;
  mutate: KeyedMutator<CreateVmResult>;
}) {
  const { item, instance, mutate } = props;
  const handleClick = onClick(instance, item, mutate);
  return (
    <Button
      fontSize='0.8rem'
      px='0.6rem'
      h='2.2rem'
      aria-label={item.text}
      leftIcon={<item.icon />}
      title={item.title}
      onClick={handleClick}
      isDisabled={item.disabled}
    >
      {item.text}
    </Button>
  );
}

export default function VmInstanceControlButtons(props: {
  instance: CreateVmResult;
  mutate: KeyedMutator<CreateVmResult>;
}) {
  const { instance, mutate } = props;
  const [isXs, isSm, isMd] = useMediaQuery(
    ['(min-width: 332px)', '(min-width: 406px)', '(min-width: 475px)'],
    { ssr: true, fallback: false },
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [mounted]);
  if (!mounted) return null;
  const controlItems = getControlItems(instance);
  const startItem: ControlItem = {
    icon: BsFillPlayFill,
    text: 'Start',
    title: 'Click to start the instance',
    action: 'start',
    actioning: 'starting',
    disabled: ['starting', 'running', 'stopping'].includes(instance.powerState),
  };

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
        <HeadlineControlButton
          item={startItem}
          instance={instance}
          mutate={mutate}
        />

        {isXs &&
          controlItems.map(
            (item) =>
              item.q === 'xs' && (
                <HeadlineControlButton
                  key={item.text}
                  item={item}
                  instance={instance}
                  mutate={mutate}
                />
              ),
          )}
        {isSm &&
          controlItems.map(
            (item) =>
              item.q === 'sm' && (
                <HeadlineControlButton
                  key={item.text}
                  item={item}
                  instance={instance}
                  mutate={mutate}
                />
              ),
          )}
        {isMd &&
          controlItems.map(
            (item) =>
              item.q === 'md' && (
                <HeadlineControlButton
                  key={item.text}
                  item={item}
                  instance={instance}
                  mutate={mutate}
                />
              ),
          )}

        {!isMd && (
          <ShowDynamicMenu
            instance={instance}
            isXs={isXs}
            isSm={isSm}
            isMd={isMd}
            mutate={mutate}
          />
        )}
      </ButtonGroup>
    </HStack>
  );
}
function ShowDynamicMenu(props: {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  instance: CreateVmResult;
  mutate: KeyedMutator<CreateVmResult>;
}) {
  const { isXs, isSm, isMd, instance, mutate } = props;
  const controlItems = getControlItems(instance);
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
                onClick={onClick(instance, item, mutate)}
                isDisabled={item.disabled}
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
                  onClick={onClick(instance, item, mutate)}
                  isDisabled={item.disabled}
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
                  onClick={onClick(instance, item, mutate)}
                  isDisabled={item.disabled}
                >
                  {item.text}
                </MenuItem>
              ))}
        </MenuList>
      </Portal>
    </Menu>
  );
}
