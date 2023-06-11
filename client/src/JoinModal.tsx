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
  Text,
  Spinner,
} from '@chakra-ui/react';
import { AtSignIcon } from '@chakra-ui/icons';
import { useApp } from './contexts/AppContext';

function JoinModal({
  isOpen,
  loading,
  onClose,
  closeOnOverlayClick = false,
  onSubmit,
  joinError,
  socketError,
}: ModalProps) {
  const [name, setName] = useState('');
  const appState = useApp();
  const isConnected = appState?.isConnected;

  return (
    <Modal isOpen={isOpen} isCentered size="lg" onClose={onClose} closeOnOverlayClick={closeOnOverlayClick}>
      <ModalOverlay />
      <ModalContent
        minHeight="80px"
        alignItems={isConnected ? undefined : 'center'}
        justifyContent={isConnected ? undefined : 'center'}
      >
        {!socketError ? (
          isConnected ? (
            <>
              <ModalHeader>Enter Display Name</ModalHeader>
              <ModalBody>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <AtSignIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Display name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </InputGroup>
                {joinError && <Text color="red">{joinError}</Text>}
              </ModalBody>

              <ModalFooter>
                <Button disabled={loading} isLoading={loading} colorScheme="blue" mr={3} onClick={() => onSubmit(name)}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          ) : (
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          )
        ) : (
          <ModalBody>
            <Text color="red.500" fontWeight="bold">
              {socketError}
            </Text>
          </ModalBody>
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
  joinError: string | undefined;
  socketError: string | undefined;
};

export default JoinModal;
