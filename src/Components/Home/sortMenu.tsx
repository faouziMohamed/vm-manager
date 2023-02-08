import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { MdSort } from 'react-icons/md';

import { NextRouterWithQueries, updateQueryParams } from '@/lib/utils';
import { SortOption, sortOptions, SortValue } from '@/lib/vmUtils';

type SelectedItem = SortOption;
type MenuProps = {
  onSelect?: (value: SortValue) => void;
};

export default function SortMenu({ onSelect = () => {} }: MenuProps) {
  const [selected, setSelected] = useState<SelectedItem>({
    name: 'Sort',
    value: 'default',
  });
  const router = useRouter() as NextRouterWithQueries;
  // const {
  //   query: { sort },
  // } = router;

  const onSelectionChange = useCallback(
    (value: SortOption) => {
      if (value.value === selected.value) return;
      onSelect(value.value);
      setSelected({ name: value.name, value: value.value });
      updateQueryParams(router, value, 'sort');
    },
    [onSelect, router, selected.value],
  );

  // if the sort param is in the url, set the selected value to the default value of the sort param
  // if (sort && sort !== selected.value && sortOptionsValues.includes(sort)) {
  //   const selectedSort = sortOptions.find((item) => item.value === sort);
  //   onSelectionChange(selectedSort!);
  // }
  return (
    <Menu>
      <MenuButton
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
          <Text>{selected.name}</Text>
        </Flex>
      </MenuButton>
      <MenuList>
        {sortOptions.map((item) => (
          <MenuItem key={item.name} onClick={() => onSelectionChange(item)}>
            {item.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
