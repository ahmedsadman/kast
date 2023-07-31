import { useEffect } from 'react';

import { ReactionMessage } from '../../types';

function Reaction({ reaction, onFinish, ...props }: ReactionProps) {
  useEffect(() => {
    setTimeout(() => {
      onFinish(reaction.id);
    }, 6000);
  });

  return <div {...props}>{reaction.emoji}</div>;
}

type ReactionProps = {
  reaction: ReactionMessage;
  onFinish: (_id: string) => void;
};

export default Reaction;
