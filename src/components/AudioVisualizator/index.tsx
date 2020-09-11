import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  handleError: (err: DOMException) => void;
};

const useStyles = makeStyles({
  volumeLevel: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    maxWidth: '100%',
    width: 0,
    backgroundColor: 'green',
    opacity: 0.3,
    transition: 'width 0.1s'
  }
});

const AudioVisualizator = ({ handleError }: Props) => {
  const classes = useStyles();
  const volume = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const CONSTRAINS: MediaStreamConstraints = { audio: true, video: false };
    let stream: MediaStream;

    const checkMicrophone = async (
      constrains: MediaStreamConstraints
    ): Promise<void> => {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constrains);

        const audioContext: AudioContext = new AudioContext();
        const analyser: AnalyserNode = audioContext.createAnalyser();
        const microphone: MediaStreamAudioSourceNode = audioContext.createMediaStreamSource(
          stream
        );
        const scriptProcessor: ScriptProcessorNode = audioContext.createScriptProcessor(
          2048,
          1,
          1
        );

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        scriptProcessor.onaudioprocess = () => {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          let values = 0;

          let length = array.length;
          for (let i = 0; i < length; i++) {
            values += array[i];
          }

          let average = Math.round(values / length);

          if (volume && volume.current) {
            volume.current.style.width = `${average}%`;
          }
        };
      } catch (error) {
        handleError(error);
      }
    };

    checkMicrophone(CONSTRAINS);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  });

  return <div className={classes.volumeLevel} ref={volume}></div>;
};

export default AudioVisualizator;
