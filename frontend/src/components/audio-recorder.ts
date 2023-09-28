export const useAudioRecorder = () =>
  new Promise(async (resolve) => {
    if (!window.MediaRecorder) {
      console.log('Media Recorder not available');
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [] as any[];

    mediaRecorder.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();
    const pause = () => mediaRecorder.pause();
    const resume = () => mediaRecorder.resume();
    const cancel = () => stopAndClear();

    const stop = () =>
      new Promise((resolve) => {
        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks, {
            type: 'audio/mp3',
          });

          // type: 'audio/mp4; codecs=opus',
          // type: 'audio/ogg; codecs=opus',
          // const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          // const audioURL = window.URL.createObjectURL(blob);

          const audioUrl = URL.createObjectURL(audioBlob);
          // const audio = new Audio(audioUrl);
          // const play = () => audio.play();
          resolve({ audioBlob, audioUrl });
        });
        stopAndClear();
      });

    const stopAndClear = () => {
      try {
        mediaRecorder.stop();
      } catch (error) {}
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (error) {}
      });
    };

    resolve({ start, stop, pause, resume, cancel });
  });

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

// example

// (async () => {
//   const recorder = await useAudioRecorder();
//   recorder.start();
//   await sleep(3000);
//   const audio = await recorder.stop();
//   audio.play();
// })();
