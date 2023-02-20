import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

export default function AppBlurredModal(props: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const { isOpen, onClose, title, children } = props;
  return (
    <Box>
      <Modal
        isCentered
        isOpen={isOpen}
        closeOnOverlayClick={false}
        onClose={onClose}
        motionPreset='slideInRight'
        blockScrollOnMount
        scrollBehavior='inside'
      >
        <BlurredModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function BlurredModalOverlay() {
  return (
    <ModalOverlay
      bg='none'
      backdropFilter='auto'
      backdropInvert='30%'
      backdropBlur='2px'
    />
  );
}
