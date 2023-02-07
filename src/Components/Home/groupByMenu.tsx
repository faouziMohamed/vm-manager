import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { VscGroupByRefType } from 'react-icons/vsc';

const menuItemsNames = ['None', 'Region', 'Status'] as const;
const values = ['none', 'region', 'status'] as const;
export type GroupByMenuValue = (typeof values)[number];
type MenuRowItem = {
  // noinspection TypeScriptUnresolvedVariable
  name: (typeof menuItemsNames)[number];
  value: (typeof values)[number];
};
const menuItems: MenuRowItem[] = [
  { name: 'None', value: 'none' },
  { name: 'Status', value: 'status' },
  { name: 'Region', value: 'region' },
];
type SelectedItem = MenuRowItem;
type MenuProps = {
  onSelect?: (value: GroupByMenuValue) => void;
};

export default function GroupByMenu({ onSelect = () => {} }: MenuProps) {
  const [selected, setSelected] = useState<SelectedItem>({
    name: 'None',
    value: 'none',
  });
  const onSelectionChange = useCallback(
    (value: MenuRowItem) => {
      if (value.value === selected.value) return;
      onSelect(value.value);
      setSelected({ name: value.name, value: value.value });
    },
    [onSelect, selected.value],
  );
  return (
    <Menu>
      <MenuButton
        // _hover={{ bg: 'gray.400' }}
        // _expanded={{ bg: 'blue.400' }}
        px={4}
        py={2}
        transition='all 0.2s'
        borderRadius='md'
        _focus={{ boxShadow: 'outline' }}
        boxShadow='sm'
        borderWidth={1}
      >
        <Flex gap={2} alignItems='center'>
          <VscGroupByRefType />
          <Text>Group By</Text>
        </Flex>
      </MenuButton>
      <MenuList>
        {menuItems.map((item) => (
          <MenuItem key={item.name} onClick={() => onSelectionChange(item)}>
            {item.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
