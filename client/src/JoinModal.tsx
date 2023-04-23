import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { AtSignIcon } from '@chakra-ui/icons';

function JoinModal({ isOpen, onClose, closeOnOverlayClick = false, onSubmit }: ModalProps) {
  const [name, setName] = useState('');

  return (
    <Modal isOpen={isOpen} isCentered size="lg" onClose={onClose} closeOnOverlayClick={closeOnOverlayClick}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter Display Name</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <AtSignIcon color="gray.300" />
            </InputLeftElement>
            <Input type="text" placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} />
          </InputGroup>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => onSubmit(name)}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_name: string) => void;
  closeOnOverlayClick?: boolean;
};

export default JoinModal;
