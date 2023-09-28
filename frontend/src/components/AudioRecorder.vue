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
          <div class="text-h6 text-bold">{{ formatedRecordtedTime }}</div>
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
            @click="stopRecording"
          />
        </div>
      </div>
    </div>
    <div v-else-if="recordingStep === 3" class="col-12">
      <div class="row justify-center">
        <q-space class="q-py-xl" />
        <div class="col-12 text-center row justify-center q-pb-lg">
          <AudioPlayer
            v-if="audio && audio.audioUrl"
            :audio="audio.audioUrl"
            style="max-width: 400px"
            class="bg-nwhite"
            :totalDuration="recordTimeCounter"
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
            @click="saveRecording(audio.audioBlob)"
          ></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAudioRecorder } from 'components/audio-recorder';
import AudioPlayer from 'components/AudioPlayer.vue';
import { api } from 'src/boot/axios';
// const AudioConverter = require('convert-audio');
import { convert } from './convert-audio';
import { useQuasar } from 'quasar';
import { useAudioStore } from 'src/stores/audio';
import { useAuthStore } from 'src/stores/auth';
// import { computed, ref, onMounted } from 'vue';
// import { throttle, useQuasar } from 'quasar';

const $q = useQuasar();
const $emit = defineEmits(['close', 'save']);
const recordingStep = ref(1);
const recording = ref(true);
const startCounterInterval = ref(null as any);
const startingCounter = ref(3);
const counterView = ref(true);
const recordCounterInterval = ref(null as any);
const recordTimeCounter = ref(0);
const audioTitle = ref('');
const uploadingAudio = ref(false);
let audioRecorder = null as null | any;
let audio = null as null | any;
const audioStore = useAudioStore();
const authStore = useAuthStore();
const recordingLengthLimit = authStore.permission.storyLength;

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
    record();
    counterView.value = false;
    startingCounter.value = 3;
  }
};

const record = async () => {
  audioRecorder = await useAudioRecorder();
  audioRecorder.start();
  console.log('audio started');
  recordCounterIntervalStart();
};

const stopRecording = async () => {
  if (audioRecorder) {
    audio = await audioRecorder.stop();
  } else {
    console.log('audioRecorder not found');
  }
  recordCounterIntervalStop();
  recordingStep.value = 3;
};

const reset = async () => {
  if (recordingStep.value !== 1) {
    if (audioRecorder) {
      await audioRecorder.cancel();
      audioRecorder = null;
    }
    clearInterval(startCounterInterval.value);
    recordingStep.value = 1;
    recording.value = true;
    startingCounter.value = 3;
    startCounterInterval.value = null;
    counterView.value = true;
    recordTimeCounter.value = 0;
    recordCounterIntervalStop();
  } else {
    $emit('close');
  }
};

const pauseRecording = async () => {
  if (audioRecorder) {
    recording.value = false;
    await audioRecorder.pause();
  }
  recordCounterIntervalStop();
};

const resumeRecording = async () => {
  if (audioRecorder) {
    recording.value = true;
    await audioRecorder.resume();
  }
  recordCounterIntervalStart();
};

const recordCounterIntervalStart = () => {
  recordCounterIntervalStop();
  recordCounterInterval.value = setInterval(() => {
    if (recordTimeCounter.value < recordingLengthLimit)
      recordTimeCounter.value++;
    else stopRecording();
  }, 1000);
};
const recordCounterIntervalStop = () => {
  clearInterval(recordCounterInterval.value);
  recordCounterInterval.value = null;
};
const formatedRecordtedTime = computed(() => {
  return formatToMMSS(recordingLengthLimit - recordTimeCounter.value);
});

const formatToMMSS = (val: number) => {
  const min = Math.floor(val / 60);
  const sec = Math.floor(val % 60);
  return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
};

const saveRecording = async (blobFile: any) => {
  // console.log('saving record');
  // console.log(blobFile);
  uploadingAudio.value = true;
  const convertedFile: any = await convertAudio(blobFile);

  // console.log({ convertedFile });

  let formData = new FormData();
  let fileName = `${convertedFile.name}.${convertedFile.format}`;
  let file = new File([convertedFile.data], fileName);
  formData.append('audio', file, fileName);
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

const convertAudio = async (blob: any) => {
  let sourceAudioFile = blob;
  let targetAudioFormat = 'mp3';
  let convertedAudioDataObj = await convert(
    sourceAudioFile,
    targetAudioFormat,
    audioTitle.value
  );
  console.log('dump');
  console.log({ convertedAudioDataObj });
  // downloadAudio(convertedAudioDataObj);
  return convertedAudioDataObj;
};

const downloadAudio = (convertedAudioDataObj: any) => {
  let a = document.createElement('a');
  a.href = convertedAudioDataObj.data;
  a.download = convertedAudioDataObj.name + '.' + convertedAudioDataObj.format;
  a.click();
};
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
