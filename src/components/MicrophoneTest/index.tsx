import React, { useState } from 'react';
import AudioVisualizator from '../AudioVisualizator';
import Button from '@material-ui/core/Button';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 70,
    width: '100%',
    backgroundColor: theme.palette.primary.main
  },
  button: {
    position: 'relative',
    margin: theme.spacing(1)
  }
}));

const MicrophoneTest = () => {
  const classes = useStyles();
  const [checkMicro, setCheckMicro] = useState(false);
  const [permissionError, setPermissionError] = useState<DOMException | null>(
    null
  );

  let buttonMessage: string;

  if (permissionError) {
    buttonMessage = 'No permission';
  } else {
    buttonMessage = !checkMicro ? 'Test micro' : 'Stop test';
  }

  const toggleTest = (): void => {
    setCheckMicro(prevState => !prevState);
  };

  const handleError = (err: DOMException): void => {
    setPermissionError(err);
    setCheckMicro(false);
  };

  return (
    <div className={classes.container}>
      <Button
        variant="contained"
        color="default"
        size="small"
        className={classes.button}
        endIcon={<KeyboardVoiceIcon />}
        disabled={Boolean(permissionError)}
        onClick={toggleTest}
      >
        {buttonMessage}
        {checkMicro && !permissionError && (
          <AudioVisualizator handleError={handleError} />
        )}
      </Button>
    </div>
  );
};

export default MicrophoneTest;
