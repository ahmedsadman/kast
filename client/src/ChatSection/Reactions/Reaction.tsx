import { useEffect } from 'react';

import { ReactionMessage } from '../../types';

function Reaction({ reaction, onFinish }: ReactionProps) {
  useEffect(() => {
    setTimeout(() => {
      onFinish(reaction.id);
    }, 6000);
  });

  return <div>{reaction.emoji}</div>;
}

type ReactionProps = {
  reaction: ReactionMessage;
  onFinish: (_id: string) => void;
};

export default Reaction;
