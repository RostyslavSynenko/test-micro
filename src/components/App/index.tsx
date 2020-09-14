import React, { useState } from 'react';
import MicrophoneTestContainer from '../MicrophoneTestContainer';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'whitesmoke'
  }
});

const App = () => {
  const classes = useStyles();
  const [isWorking, setIsWorking] = useState(false);

  const handleSuccess = (): void => {
    setIsWorking(true);
  }; // stub

  const handleError = (): void => {
    setIsWorking(true);
  }; // stub

  return (
    <div className={classes.container}>
      {!isWorking && (
        <MicrophoneTestContainer
          handleSuccess={handleSuccess}
          handleError={handleError}
        />
      )}
    </div>
  );
};

export default App;
