import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { MdFilterList } from 'react-icons/md';

import { VmPowerState } from '@/lib/types';
import { NextRouterWithQueries, updateQueryParams } from '@/lib/utils';
import { powerStates } from '@/lib/vmUtils';

export type MenuProps = {
  onSelect?: (value: VmPowerState['value']) => void;
};

type SelectedItem = Omit<VmPowerState, 'iconColor'>;

export default function PowerStateFilterMenu({
  onSelect = () => {},
}: MenuProps) {
  const [selected, setSelected] = useState<SelectedItem>({
    name: 'Filter',
    value: 'default',
  });
  const router = useRouter() as NextRouterWithQueries;
  // const {
  //   query: { filter },
  // } = router;
  const onSelectionChange = useCallback(
    (value: VmPowerState) => {
      if (value.value === selected.value) return;
      onSelect(value.value);
      setSelected({ name: value.name, value: value.value });
      // add the filter param to the url, &filter=selected.value if the value is
      // the default value, remove the filter param
      updateQueryParams(router, value, 'filter');
    },
    [onSelect, router, selected.value],
  );

  // if the filter param is in the url, set the selected value to the value of the filter param
  // if (filter && filter !== selected.value && powerStateValues.includes(filter)) {
  //   const selectedFilter = powerStates.find((item) => item.value === filter);
  //  onSelectionChange(selectedFilter!);
  // }

  return (
    <Menu>
      <MenuButton
        title='Filter machines by power state'
        px={4}
        py={2}
        transition='all 0.2s'
        borderRadius='md'
        boxShadow='sm'
        borderWidth={1}
        _focus={{ boxShadow: 'outline' }}
      >
        <Flex gap={2} alignItems='center'>
          <MdFilterList />
          <Text>{selected.name}</Text>
        </Flex>
      </MenuButton>
      <MenuList color='#112'>
        {powerStates.map((item) => (
          <MenuItem
            key={item.name}
            onClick={() => onSelectionChange(item)}
            icon={
              <Box w='10px' h='10px' bg={item.iconColor} borderRadius={9999} />
            }
          >
            {item.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

// export function InitialFocus() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//
//   const initialRef = useRef(null);
//   const finalRef = useRef(null);
//
//   return (
//     <>
//       <Button onClick={onOpen}>Open Modal</Button>
//       <Button ml={4} ref={finalRef}>
//         I&apos;ll receive focus on close
//       </Button>
//
//       <Modal
//         initialFocusRef={initialRef}
//         finalFocusRef={finalRef}
//         isOpen={isOpen}
//         onClose={onClose}
//       >
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Create your account</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <FormControl>
//               <FormLabel>First name</FormLabel>
//               <Input ref={initialRef} placeholder='First name' />
//             </FormControl>
//
//             <FormControl mt={4}>
//               <FormLabel>Last name</FormLabel>
//               <Input placeholder='Last name' />
//             </FormControl>
//           </ModalBody>
//
//           <ModalFooter>
//             <Button colorScheme='blue' mr={3}>
//               Save
//             </Button>
//             <Button onClick={onClose}>Cancel</Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }
