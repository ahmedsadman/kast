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

function JoinModal({ isOpen, onClose, closeOnOverlayClick = false }: ModalProps) {
  return (
    <Modal isOpen={isOpen} isCentered size="lg" onClose={onClose} closeOnOverlayClick={closeOnOverlayClick}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter Room ID to join</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <AtSignIcon color="gray.300" />
            </InputLeftElement>
            <Input type="text" placeholder="Room ID" />
          </InputGroup>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => {}}>
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
  closeOnOverlayClick?: boolean;
};

export default JoinModal;
