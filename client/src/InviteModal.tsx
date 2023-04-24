import { useEffect, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  HStack,
  IconButton,
  useClipboard,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';

function InviteModal({ isOpen, onClose, roomId, closeOnOverlayClick = false }: ModalProps) {
  const { onCopy, setValue: setClipboardValue, hasCopied } = useClipboard('');

  const getInviteLink = useCallback(() => {
    return roomId ? `http://localhost:1420/${roomId}` : '';
  }, [roomId]);

  useEffect(() => {
    setClipboardValue(getInviteLink());
  }, [roomId, setClipboardValue, getInviteLink]);

  return (
    <Modal isOpen={isOpen} isCentered size="lg" onClose={onClose} closeOnOverlayClick={closeOnOverlayClick}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Copy this link to invite</ModalHeader>
        <ModalBody>
          <HStack>
            <Input type="text" readOnly value={getInviteLink()} />
            <IconButton
              aria-label="Copy to Clipboard"
              icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
              onClick={onCopy}
            />
          </HStack>
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
