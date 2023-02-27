import { Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { NextRouterWithQueries, SortOrderOption } from '@/lib/types';
import { updateQueryParams } from '@/lib/utils';

export default function SortDirection({
  onChange = () => {},
}: {
  onChange?: (value: string) => void;
}) {
  const router = useRouter() as NextRouterWithQueries;
  const [selected, setSelected] = useState<SortOrderOption>({
    name: 'Ascending',
    value: 'asc',
  });
  const onSelectionChange = useCallback(
    (value: SortOrderOption) => {
      if (value.value === selected.value) return;
      setSelected({ name: value.name, value: value.value });
      onChange(value.value);
      updateQueryParams(router, value, 'sort_order');
    },
    [onChange, router, selected.value],
  );

  const ascending: SortOrderOption = {
    name: 'Ascending',
    value: 'asc',
  };
  const descending: SortOrderOption = { name: 'Descending', value: 'desc' };

  return (
    <RadioGroup
      defaultValue={selected.name}
      borderWidth='1px'
      p='0.5rem'
      borderRadius='md'
    >
      <Stack spacing={2} direction='row'>
        <Radio
          colorScheme='red'
          value={ascending.value}
          onChange={() => onSelectionChange(ascending)}
        >
          Ascending
        </Radio>
        <Radio
          colorScheme='green'
          value={descending.value}
          onChange={() => onSelectionChange(descending)}
        >
          Descending
        </Radio>
      </Stack>
    </RadioGroup>
  );
}
