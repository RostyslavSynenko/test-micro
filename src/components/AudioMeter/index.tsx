import React, { useEffect, useRef } from 'react';
import MicIcon from '@material-ui/icons/Mic';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  handleError: (err: DOMException) => void;
};

const useStyles = makeStyles(theme => ({
  micIcon: {
    position: 'absolute',
    left: 0,
    bottom: 4, // place sound level MicIcon exact over MicIcon
    fontSize: 60,
    color: theme.palette.primary.main
  },
  audioLevel: {
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    bottom: 0,
    maxHeight: '100%',
    height: 0,
    width: '100%'
  }
}));

const SoundMeter = ({ handleError }: Props) => {
  const classes = useStyles();
  const audioLevelElem = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const CONSTRAINS: MediaStreamConstraints = { audio: true, video: false };
    let stream: MediaStream;
    let microphone: MediaStreamAudioSourceNode;
    let scriptProcessor: ScriptProcessorNode;

    const showAudioLevel = (audioLevel: number): void => {
      if (audioLevelElem && audioLevelElem.current) {
        audioLevelElem.current.style.height = `${audioLevel}%`;
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
      const SENSITIVITY: number = 200; // %
      const audioLevel: number = Math.round(
        Number(rms.toFixed(2)) * SENSITIVITY
      );

      showAudioLevel(audioLevel);
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

  return (
    <div className={classes.audioLevel} ref={audioLevelElem}>
      <MicIcon className={classes.micIcon} />
    </div>
  );
};

export default SoundMeter;
