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

import { powerStates, VmPowerState } from '@/lib/vmUtils';

export type MenuProps = {
  onSelect?: (value: VmPowerState['value']) => void;
};

type SelectedItem = { name: string; value: string };

export default function StatusFilterMenu({ onSelect = () => {} }: MenuProps) {
  const [selected, setSelected] = useState<SelectedItem>({
    name: 'All',
    value: 'all',
  });
  const router = useRouter();
  const onSelectionChange = useCallback(
    (value: VmPowerState) => {
      if (value.value === selected.value) return;
      onSelect(value.value);
      setSelected({ name: value.name, value: value.value });
      // add the filter param to the url, &filter=selected.value if the value is all, remove the filter param
      let query = { ...router.query };
      if (value.value === 'all') {
        const { filter, ...rest } = query;
        query = rest;
      } else {
        query = { ...query, filter: value.value };
      }

      void router.replace({ pathname: router.pathname, query }, undefined, {
        shallow: true,
      });
    },
    [onSelect, router, selected.value],
  );

  return (
    <Menu>
      <MenuButton
        title='Filter machines by status'
        px={4}
        py={2}
        transition='all 0.2s'
        borderRadius='md'
        boxShadow='sm'
        borderWidth={1}
        // sx={{ bg: Theme.colors.primary.main }}
        // _hover={{
        //   bg: adjustColor(Theme.colors.primary.main, -6),
        // }}
        // _expanded={{
        //   bg: adjustColor(Theme.colors.primary.main, -15),
        // }}
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
