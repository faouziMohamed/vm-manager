/* eslint-disable @typescript-eslint/naming-convention */
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
import { VscGroupByRefType } from 'react-icons/vsc';

import { NextRouterWithQueries, updateQueryParams } from '@/lib/utils';
import { GroupByOption, groupByOptions, GroupByValue } from '@/lib/vmUtils';

type SelectedItem = GroupByOption;
type MenuProps = {
  onSelect?: (value: GroupByValue) => void;
};

export default function GroupByMenu({ onSelect = () => {} }: MenuProps) {
  const [selected, setSelected] = useState<SelectedItem>({
    name: 'Group By',
    value: 'default',
  });
  const router = useRouter() as NextRouterWithQueries;
  // const {
  //   query: { group_by },
  // } = router;

  // if the group_by param is in the url, set the selected value to the value of the group_by param

  const onSelectionChange = useCallback(
    (value: GroupByOption) => {
      if (value.value === selected.value) return;
      onSelect(value.value);
      setSelected({ name: value.name, value: value.value });
      updateQueryParams(router, value, 'group_by');
    },
    [onSelect, router, selected.value],
  );

  // if (
  //   group_by &&
  //   group_by !== selected.value &&
  //   groupByOptionsValues.includes(group_by)
  // ) {
  //   const selectedGroupBy = groupByOptions.find(
  //     (item) => item.value === group_by,
  //   );
  //   onSelectionChange(selectedGroupBy!);
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
          <VscGroupByRefType />
          <Text>{selected.name}</Text>
        </Flex>
      </MenuButton>
      <MenuList>
        {groupByOptions.map((item) => (
          <MenuItem key={item.name} onClick={() => onSelectionChange(item)}>
            {item.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
