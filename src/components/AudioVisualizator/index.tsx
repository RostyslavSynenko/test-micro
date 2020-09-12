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
    let analyser: AnalyserNode;
    let scriptProcessor: ScriptProcessorNode;

    const showAudioLevel = (level: number): void => {
      if (volume && volume.current) {
        volume.current.style.width = `${level}%`;
      }
    };

    const handleAudioProcess = () => {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      const length = array.length;
      let values = 0;

      for (let i = 0; i < length; i++) {
        values += array[i];
      }

      let averageAudioLevel = Math.round(values / length);

      showAudioLevel(averageAudioLevel);
    };

    const checkMicrophone = async (
      constrains: MediaStreamConstraints
    ): Promise<void> => {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constrains);

        const audioContext: AudioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const microphone: MediaStreamAudioSourceNode = audioContext.createMediaStreamSource(
          stream
        );
        scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        // microphone.connect(audioContext.destination); with sound
        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        scriptProcessor.addEventListener('audioprocess', handleAudioProcess);
      } catch (error) {
        handleError(error);
      }
    };

    checkMicrophone(CONSTRAINS);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      if (scriptProcessor) {
        scriptProcessor.removeEventListener('audioprocess', handleAudioProcess);
      }
    };
  });

  return <div className={classes.volumeLevel} ref={volume}></div>;
};

/*
  useEffect(() => {
    const CONSTRAINS: MediaStreamConstraints = { audio: true, video: false };
    let stream: MediaStream;
    let scriptProcessor: ScriptProcessorNode;

    const showAudioLevel = (level: number): void => {
      if (volume && volume.current) {
        volume.current.style.width = `${level}%`;
      }
    };

    const handleAudioProcess = (event: AudioProcessingEvent): void => {
      const inputData = event.inputBuffer.getChannelData(0);
      const inputDataLength = inputData.length;
      let total = 0;

      for (let i = 0; i < inputDataLength; i++) {
        total += Math.abs(inputData[i++]);
      }

      // const rms = Math.sqrt(total / inputDataLength);
      const level = Math.min(total, 100);

      showAudioLevel(level);
    };

    const checkMicrophone = async (
      constrains: MediaStreamConstraints
    ): Promise<void> => {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constrains);

        const audioContext: AudioContext = new AudioContext();
        const microphone: MediaStreamAudioSourceNode = audioContext.createMediaStreamSource(
          stream
        );
        scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        // microphone.connect(audioContext.destination); // with sound
        microphone.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        scriptProcessor.addEventListener('audioprocess', handleAudioProcess);
      } catch (error) {
        handleError(error);
      }
    };

    checkMicrophone(CONSTRAINS);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      if (scriptProcessor) {
        scriptProcessor.removeEventListener('audioprocess', handleAudioProcess);
      }
    };
  });
*/

export default AudioVisualizator;
