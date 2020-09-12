import React from 'react';
import MicrophoneTest from '../MicrophoneTest';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 70,
    backgroundColor: theme.palette.primary.main
  }
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <MicrophoneTest />
    </div>
  );
};

export default App;
