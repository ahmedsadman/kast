import { useEffect, useRef } from 'react';
import { HStack } from '@chakra-ui/react';
import { useApp, useAppDispatch } from '../../contexts/AppContext';
import Reaction from './Reaction';

function ReactionsOverlay() {
  const appState = useApp();
  const appDispatch = useAppDispatch();
  const reactionsEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reactionsEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [appState?.reactions.length]);

  const handleOnFinish = (id: string) => {
    appDispatch?.({ type: 'remove_reaction', payload: { id } });
  };

  return (
    <HStack
      maxWidth={500}
      position="absolute"
      pointerEvents="none"
      overflow="hidden"
      bottom={200}
      left="30%"
      fontSize="2.5em"
      opacity="0.9"
    >
      {appState?.reactions.map((reaction) => (
        <Reaction key={reaction.id} reaction={reaction} onFinish={() => handleOnFinish(reaction.id)} />
      ))}
      <div ref={reactionsEnd}></div>
    </HStack>
  );
}

export default ReactionsOverlay;
