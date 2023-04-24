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

function InviteModal({ isOpen, onClose, roomId, closeOnOverlayClick = false }: ModalProps) {
  const getInviteLink = () => `http://localhost:1420/${roomId}`;

  return (
    <Modal isOpen={isOpen} isCentered size="lg" onClose={onClose} closeOnOverlayClick={closeOnOverlayClick}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Copy this link to invite</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <AtSignIcon color="gray.300" />
            </InputLeftElement>
            <Input type="text" readOnly value={getInviteLink()} />
          </InputGroup>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Okay
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
  closeOnOverlayClick?: boolean;
};

export default InviteModal;
