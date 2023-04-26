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
  Spinner,
} from '@chakra-ui/react';
import { AtSignIcon } from '@chakra-ui/icons';

function JoinModal({ isOpen, loading, onClose, isSocketConnected, closeOnOverlayClick = false, onSubmit }: ModalProps) {
  const [name, setName] = useState('');

  return (
    <Modal isOpen={isOpen} isCentered size="lg" onClose={onClose} closeOnOverlayClick={closeOnOverlayClick}>
      <ModalOverlay />
      <ModalContent
        minHeight="80px"
        alignItems={isSocketConnected ? undefined : 'center'}
        justifyContent={isSocketConnected ? undefined : 'center'}
      >
        {isSocketConnected ? (
          <>
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
              <Button disabled={loading} isLoading={loading} colorScheme="blue" mr={3} onClick={() => onSubmit(name)}>
                Submit
              </Button>
            </ModalFooter>
          </>
        ) : (
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        )}
      </ModalContent>
    </Modal>
  );
}

type ModalProps = {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (_name: string) => void;
  closeOnOverlayClick?: boolean;
  isSocketConnected: boolean;
};

export default JoinModal;
