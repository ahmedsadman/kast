import { Grid, GridItem } from '@chakra-ui/react';
import MediaSection from './MediaSection';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.mainContainer}>
      <Grid h="100vh" flex={1} templateColumns="repeat(12, 1fr)" gap={0}>
        <GridItem colSpan={10} bg="#2C3333">
          <MediaSection />
        </GridItem>
        <GridItem colSpan={2} bg="black" />
      </Grid>
    </div>
  );
}

export default App;
