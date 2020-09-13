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

const SoundMeter = ({ handleError }: Props) => {
  const classes = useStyles();
  const volume = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const CONSTRAINS: MediaStreamConstraints = { audio: true, video: false };
    let stream: MediaStream;
    let microphone: MediaStreamAudioSourceNode;
    let scriptProcessor: ScriptProcessorNode;

    const showAudioLevel = (soundLevel: number): void => {
      if (volume && volume.current) {
        volume.current.style.width = `${soundLevel}%`;
      }
    };

    const handleAudioProcess = (event: AudioProcessingEvent): void => {
      const inputData: Float32Array = event.inputBuffer.getChannelData(0);
      const inputDataLength: number = inputData.length;
      let total: number = 0;

      for (let i = 0; i < inputDataLength; i++) {
        total += Math.abs(inputData[i++]);
      }

      const rms: number = Math.sqrt(total / inputDataLength);
      const soundLevel: number = Math.round(Number(rms.toFixed(2)) * 100);

      showAudioLevel(soundLevel);
    };

    const checkMicrophone = async (
      constrains: MediaStreamConstraints
    ): Promise<void> => {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constrains);

        const audioContext: AudioContext = new AudioContext();
        microphone = audioContext.createMediaStreamSource(stream);
        scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        // microphone.connect(audioContext.destination); // with sound
        microphone.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        scriptProcessor.addEventListener('audioprocess', handleAudioProcess);
      } catch (error) {
        handleError(error);
      }
    };

    const handleStop = (): void => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor.removeEventListener('audioprocess', handleAudioProcess);
      }

      if (microphone) {
        microphone.disconnect();
      }
    };

    checkMicrophone(CONSTRAINS);

    return () => {
      handleStop();
    };
  });

  return <div className={classes.volumeLevel} ref={volume}></div>;
};

/*
  useEffect(() => {
  const CONSTRAINS: MediaStreamConstraints = { audio: true, video: false };
  let stream: MediaStream;
  let analyser: AnalyserNode;
  let microphone: MediaStreamAudioSourceNode;
  let scriptProcessor: ScriptProcessorNode;

  const showAudioLevel = (level: number): void => {
    if (volume && volume.current) {
      volume.current.style.width = `${level}%`;
    }
  };

  const handleAudioProcess = (): void => {
    const array: Uint8Array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    const length: number = array.length;
    let values: number = 0;

    for (let i = 0; i < length; i++) {
      values += array[i];
    }

    const averageAudioLevel: number = Math.round(values / length);

    showAudioLevel(averageAudioLevel);
  };

  const checkMicrophone = async (
    constrains: MediaStreamConstraints
  ): Promise<void> => {
    try {
      stream = await navigator.mediaDevices.getUserMedia(constrains);

      const audioContext: AudioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      // microphone.connect(audioContext.destination); // with sound
      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      scriptProcessor.addEventListener('audioprocess', handleAudioProcess);
    } catch (error) {
      handleError(error);
    }
  };

  const handleStop = (): void => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    if (scriptProcessor) {
      scriptProcessor.disconnect();
      scriptProcessor.removeEventListener('audioprocess', handleAudioProcess);
    }

    if (analyser) {
      analyser.disconnect();
    }

    if (microphone) {
      microphone.disconnect();
    }
  };

  checkMicrophone(CONSTRAINS);

  return () => {
    handleStop();
  };
});
*/

export default SoundMeter;
