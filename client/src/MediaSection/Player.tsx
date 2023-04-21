import styles from './MediaSection.module.css';

function Player({ src }: PlayerProps) {
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video className={styles.playerVideo} controls src={src} autoPlay />;
}

type PlayerProps = {
  src: string;
};

export default Player;
