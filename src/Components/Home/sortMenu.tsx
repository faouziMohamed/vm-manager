import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { MdSort } from 'react-icons/md';

const menuItemsNames = [
  'Most Recent',
  'Oldest First',
  'Region',
  'Status',
  'Name',
  'Ip Address',
] as const;
const values = [
  'none',
  'mostRecent',
  'oldestFirst',
  'region',
  'status',
  'name',
  'ipAddress',
] as const;
export type SortMenuValue = (typeof values)[number];
type MenuRowItem = {
  // noinspection TypeScriptUnresolvedVariable
  name: (typeof menuItemsNames)[number];
  value: (typeof values)[number];
};
const menuItems: MenuRowItem[] = [
  { name: 'Most Recent', value: 'mostRecent' },
  { name: 'Oldest First', value: 'oldestFirst' },
  { name: 'Region', value: 'region' },
  { name: 'Status', value: 'status' },
  { name: 'Name', value: 'name' },
  { name: 'Ip Address', value: 'ipAddress' },
];
type SelectedItem = MenuRowItem;
type MenuProps = {
  onSelect?: (value: SortMenuValue) => void;
};

export default function SortMenu({ onSelect = () => {} }: MenuProps) {
  const [selected, setSelected] = useState<SelectedItem>({
    name: 'Most Recent',
    value: 'mostRecent',
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
          <MdSort />
          <Text>Sort</Text>
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
