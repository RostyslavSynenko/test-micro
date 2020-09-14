import React from 'react';
import AudioMeter from '../AudioMeter';
import { Button, Typography } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  handlePermissionError: (err: DOMException) => void;
  handleSuccess: () => void;
  handleError: () => void;
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    position: 'relative',
    margin: `${theme.spacing(3)}px 0`
  },
  micIcon: {
    color: 'lightgrey',
    fontSize: 60
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const MicrophoneTest = ({
  handlePermissionError,
  handleSuccess,
  handleError
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.iconContainer}>
        <MicIcon className={classes.micIcon} />
        <AudioMeter handleError={handlePermissionError} />
      </div>
      <Typography variant="h5" component="p">
        Please say, "I save lives"
      </Typography>
      <div className={classes.buttonsContainer}>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          onClick={handleError}
        >
          It didn't work
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleSuccess}
        >
          It worked!
        </Button>
      </div>
    </div>
  );
};

export default MicrophoneTest;
