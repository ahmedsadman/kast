import { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { HStack } from '@chakra-ui/react';
import { useApp, useAppDispatch } from '../../contexts/AppContext';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Reaction from './Reaction';

import styles from './ReactionOverlay.module.css';

function ReactionsOverlay() {
  const appState = useApp();
  const appDispatch = useAppDispatch();
  const reactionsEnd = useRef<HTMLDivElement>(null);

  const handleOnFinish = (id: string) => {
    appDispatch?.({ type: 'remove_reaction', payload: { id } });
  };

  const scrollToEnd = useCallback(() => {
    reactionsEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const debouncedScrollToEnd = useCallback(debounce(scrollToEnd), []);

  useEffect(() => {
    scrollToEnd();
  }, [scrollToEnd]);

  return (
    <HStack
      width={500}
      position="absolute"
      pointerEvents="none"
      overflow="hidden"
      bottom={200}
      left="30%"
      opacity="0.9"
      justifyContent="center"
      alignItems="center"
    >
      <TransitionGroup component={null}>
        {appState?.reactions.map((reaction) => (
          <CSSTransition
            key={reaction.id}
            timeout={300}
            classNames={{
              enterActive: styles.reactionEnterActive,
              enterDone: styles.reactionEnterDone,
              exitActive: styles.reactionExitActive,
            }}
            onEntered={debouncedScrollToEnd}
          >
            <Reaction reaction={reaction} onFinish={() => handleOnFinish(reaction.id)} />
          </CSSTransition>
        ))}
      </TransitionGroup>
      <div ref={reactionsEnd}></div>
    </HStack>
  );
}

export default ReactionsOverlay;
