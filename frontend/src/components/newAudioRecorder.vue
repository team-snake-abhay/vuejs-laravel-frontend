<template>
  <div class="row q-py-lg audio-recorder" :class="{ dense: $q.screen.lt.md }">
    <q-btn round icon="close" flat @click="reset" class="absolute-top-right" />
    <div v-if="recordingStep === 1" class="col-12">
      <div class="row">
        <div class="col-12 col-md-auto q-pl-lg text-center q-mt-lg q-pt-md">
          <q-img fit="contain" src="/mic.png" style="width: 123px"></q-img>
        </div>
        <div class="col-12 col-md q-pa-lg">
          <div class="row justify-center q-mb-md">
            <div class="col-12">
              <div class="text-h6">
                Get ready to record {{ recordingLengthLimit / 60 }} minutes of
                audio!
              </div>
              <div class="q-pt-md">
                Recording in your browser is simple—just allow access to your
                computer's microphone when prompted
              </div>
              <q-btn
                class="q-my-md q-px-md"
                no-caps
                label="Start Recording"
                color="primary"
                @click="recordCounter"
              ></q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="recordingStep === 2" class="col-12">
      <div v-if="counterView" class="row justify-center">
        <div class="bg-ndark col-auto text-h6 start-counter">
          {{ startingCounter }}
        </div>
      </div>
      <div v-else class="row justify-center">
        <div class="col-12 text-center">
          <div class="text-h6 text-bold">
            Recording {{ !recording ? 'Paused' : '' }}
          </div>
          <div class="text-h6 text-bold">{{ recordedTime }}</div>
          <q-spinner-hourglass v-if="recording" />
        </div>
        <q-space class="q-py-xl" />
        <div class="col-auto q-mt-xs">
          <q-btn
            v-if="!recording"
            class="q-ma-sm q-pa-sm"
            round
            size="sm"
            color="ndark-2"
            icon="close"
            @click="reset"
          />
          <q-btn
            v-if="recording"
            class="q-ma-sm q-pa-md"
            round
            size="md"
            color="negative"
            icon="o_pause"
            @click="pauseRecording"
          />
          <q-btn
            v-else
            class="q-ma-sm q-pa-md"
            round
            size="md"
            color="primary"
            icon="o_circle"
            @click="resumeRecording"
          />
          <q-btn
            v-if="!recording"
            class="q-ma-sm q-pa-sm"
            round
            size="sm"
            color="ndark-2"
            icon="done"
            @click="stopRecorder"
          />
        </div>
      </div>
    </div>
    <div v-else-if="recordingStep === 3" class="col-12">
      <div class="row justify-center">
        <q-space class="q-py-xl" />
        <div class="col-12 text-center row justify-center q-pb-lg">
          <AudioPlayer
            v-if="recordedData && recordedData.url"
            :audio="recordedData.url"
            style="max-width: 400px"
            class="bg-nwhite"
          ></AudioPlayer>
        </div>

        <div class="col-12" style="max-width: 300px">
          <label class="text-bold"
            >Audio Title <span class="text-negative">*</span></label
          >
          <q-input
            dense
            outlined
            v-model="audioTitle"
            placeholder="Type this audio title"
            :rules="[(v) => v.length > 3 || '* Minimum 3 charecter.']"
          />
          <q-separator></q-separator>
        </div>

        <div class="col-12 text-center q-mt-md">
          <q-btn
            label="Delete"
            no-caps
            class="q-ma-sm q-px-lg"
            color="negative"
            @click="reset"
          ></q-btn>
          <q-btn
            label="Save"
            no-caps
            class="q-ma-sm q-px-lg"
            color="primary"
            :disable="audioTitle.length < 4"
            :loading="uploadingAudio"
            @click="saveRecording()"
          ></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
// import { useAudioRecorder } from 'components/audio-recorder';

import Recorder from '../lib/recorder.js';
import { convertTimeMMSS } from '../lib/utils.js';

import AudioPlayer from 'components/AudioPlayer.vue';
import { api } from 'src/boot/axios';
// const AudioConverter = require('convert-audio');
import { useQuasar } from 'quasar';
import { useAudioStore } from 'src/stores/audio';
import { useAuthStore } from 'src/stores/auth';
// import { computed, ref, onMounted } from 'vue';
// import { throttle, useQuasar } from 'quasar';

const fileType = 'wav';
const $q = useQuasar();
const $emit = defineEmits(['close', 'save']);
const recordingStep = ref(1);
const recording = ref(true);
const startCounterInterval = ref(null as any);
const startingCounter = ref(3);
const counterView = ref(true);
const recordTimeCounter = ref(0);
const audioTitle = ref('');
const uploadingAudio = ref(false);
const audioStore = useAudioStore();
const authStore = useAuthStore();
const recordingLengthLimit = authStore.permission.storyLength;

// new ........

const recorder = ref<any>({});
const recordList = ref<any[]>([]);
const callbackBefRec = (data: any) => console.debug({ before_record: data });
const callbackAfRec = (data: any) => console.debug({ after_record: data });
const callbackPause = (data: any) => console.debug({ rec_paused: data });
const callbackFailed = (data: any) => console.debug({ rec_failed: data });

const _initRecorder = () => {
  console.log('_initRecorder');
  return new Recorder({
    beforeRecording: callbackBefRec,
    afterRecording: callbackAfRec,
    pauseRecording: callbackPause,
    micFailed: callbackFailed,
    bitRate: 128,
    sampleRate: 44100,
    format: fileType,
  });
};

const toggleRecorder = () => {
  if (!isRecording.value || (isRecording.value && isPause.value)) {
    recording.value = true;
    recorder.value.start();
  } else {
    recorder.value.pause();
    recording.value = false;
  }
};

const stopRecorder = () => {
  if (!isRecording.value) {
    return;
  }

  recorder.value.stop();
  recordList.value = recorder.value.recordList();
  recordingStep.value = 3;
};

const pauseRecording = async () => {
  toggleRecorder();
};

const resumeRecording = async () => {
  toggleRecorder();
};

const isRecording = computed(() => recorder.value.isRecording);
const isPause = computed(() => recorder.value.isPause);
const volume = computed(() => parseFloat(recorder.value.volume));
const recordedTime = computed(() => {
  if (recordingLengthLimit && recorder.value.duration >= recordingLengthLimit) {
    stopRecorder();
  }

  return convertTimeMMSS(recorder.value.duration);
});
const recordedData = computed(() =>
  recordList.value.length ? recordList.value[recordList.value.length - 1] : null
);

const recordCounter = () => {
  recordingStep.value = 2;
  counterView.value = true;
  if (!startCounterInterval.value) {
    // console.log('seting interval');
    startCounterInterval.value = setInterval(recordCounter, 1000);
  } else if (startingCounter.value > 1) {
    // console.count('counter interval ' + startingCounter.value);
    startingCounter.value--;
  } else {
    // console.count('record setup ');
    clearInterval(startCounterInterval.value);
    startCounterInterval.value = null;
    recording.value = true;
    recorder.value = _initRecorder();
    toggleRecorder();

    counterView.value = false;
    startingCounter.value = 3;
  }
};

const saveRecording = async () => {
  console.log('saveRecording');
  // download();
  // console.log('saving record');
  // console.log(blobFile);
  uploadingAudio.value = true;

  const type = recordedData.value.blob.type.split('/')[1];
  let formData = new FormData();
  let fileName = `${audioTitle.value}.${type}`;
  // let file = new File([convertedFile.data], fileName);

  formData.append('audio', recordedData.value.blob, fileName);
  formData.append('title', audioTitle.value);
  formData.append('audio_length', recordTimeCounter.value + '');

  try {
    const res = await api.post('/audio/save', formData);
    // console.log({ res });
    if (res.data.success) {
      console.log({ resForeRecord: res, id: res.data.data.mediaStorageObj.id });
      if (res.data.data.mediaStorageObj.id)
        audioStore.addToTranscriptionList(
          res.data.data.mediaStorageObj.id,
          res.data.data.mediaStorageObj.meta_info.file_size || null
        );
      reset();
      $emit('close');

      await audioStore.loadData();

      $q.notify({
        type: 'positive',
        message: 'Audio upload successfully ',
      });
    } else {
      const msg = res.data.message || "Audio couldn't upload properly. ";
      $q.notify({
        type: 'negative',
        message: msg,
      });
    }
  } catch (error: any) {
    let errorMsg = error.response?.data?.message ?? 'Audio upload failed';
    // TODO: change it on backend

    if (authStore.subscription === 'recurring') {
      if (errorMsg == 'Sorry your limit of monthly uploading audio exided') {
        errorMsg = 'Something unusual happened. Try with another file';
      } else if (
        errorMsg == 'Sorry your limit of daily story creation exided' ||
        errorMsg == 'Sorry your limit of monthly story creation exided'
      ) {
        errorMsg = 'Something unusual happened. Please Try later';
      }
    }

    errorMsg = errorMsg.replace('exided', 'exceeded');
    $q.notify({
      type: 'negative',
      message: errorMsg,
    });
  }
  uploadingAudio.value = false;
};

const download = () => {
  console.log('download');
  if (!recordedData.value.url) {
    return;
  }
  console.log('creating link');
  const type = recordedData.value.blob.type.split('/')[1];
  const link = document.createElement('a');
  link.href = recordedData.value.url;
  link.download = `${audioTitle.value}.${type}`;
  console.log('link created');
  link.click();
  console.log('link clicked');
};

const reset = async () => {
  if (recordingStep.value !== 1) {
    clearInterval(startCounterInterval.value);
    recordingStep.value = 1;
    recording.value = true;
    startingCounter.value = 3;
    startCounterInterval.value = null;
    counterView.value = true;
    recordTimeCounter.value = 0;
    // recordCounterIntervalStop();
  } else {
    $emit('close');
  }
};

onBeforeUnmount(() => {
  stopRecorder();
});

// prev........

// const record = async () => {
//   audioRecorder = await useAudioRecorder();
//   audioRecorder.start();
//   console.log('audio started');
//   recordCounterIntervalStart();
// };

// const stopRecording = async () => {
//   if (audioRecorder) {
//     audio = await audioRecorder.stop();
//   } else {
//     console.log('audioRecorder not found');
//   }
//   recordCounterIntervalStop();
//   recordingStep.value = 3;
// };

// const recordCounterIntervalStart = () => {
//   recordCounterIntervalStop();
//   recordCounterInterval.value = setInterval(() => {
//     if (recordTimeCounter.value < recordingLengthLimit)
//       recordTimeCounter.value++;
//     else stopRecording();
//   }, 1000);
// };
// const recordCounterIntervalStop = () => {
//   clearInterval(recordCounterInterval.value);
//   recordCounterInterval.value = null;
// };
// const formatedRecordtedTime = computed(() => {
//   return formatToMMSS(recordingLengthLimit - recordTimeCounter.value);
// });

// const formatToMMSS = (val: number) => {
//   const min = Math.floor(val / 60);
//   const sec = Math.floor(val % 60);
//   return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
// };
</script>

<style lang="scss" scoped>
.audioPlayerArea {
  height: 81px;
}
.start-counter {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  color: white;
  font-size: 3rem;
  text-align: center;
  line-height: 100%;
  padding: 24px 0;
  box-sizing: border-box;
  margin: 3rem 0 4rem;
}

.audio-recorder.dense {
  font-size: 0.8rem;
}
</style>
