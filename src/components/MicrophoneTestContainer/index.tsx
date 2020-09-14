import React, { useState } from 'react';
import MicrophoneTest from '../MicrophoneTest';
import { Button, Typography } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  handleSuccess: () => void;
  handleError: () => void;
};

const useStyles = makeStyles(theme => ({
  container: {
    width: 480,
    minHeight: 250,
    padding: theme.spacing(3),
    backgroundColor: 'white',
    borderRadius: theme.spacing(1)
  },
  title: {
    textAlign: 'center'
  },
  button: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    margin: theme.spacing(1)
  }
}));

const MicrophoneTestContainer = ({ handleSuccess, handleError }: Props) => {
  const classes = useStyles();
  const [testMicro, setTestMicro] = useState(false);
  const [permissionError, setPermissionError] = useState<DOMException | null>(
    null
  );

  const startTest = (): void => {
    setTestMicro(true);
  };

  const handlePermissionError = (err: DOMException): void => {
    setPermissionError(err);
    setTestMicro(false);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" component="h2" className={classes.title}>
        Test microphone
      </Typography>
      {!testMicro ? (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={!permissionError && <PlayArrowIcon />}
          disabled={Boolean(permissionError)}
          onClick={startTest}
        >
          {permissionError ? 'No permission' : 'Test'}
        </Button>
      ) : (
        <MicrophoneTest
          handlePermissionError={handlePermissionError}
          handleSuccess={handleSuccess}
          handleError={handleError}
        />
      )}
    </div>
  );
};

export default MicrophoneTestContainer;
