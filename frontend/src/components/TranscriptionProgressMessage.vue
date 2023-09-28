<template>
  <q-card style="width: 350px">
    <q-linear-progress :value="transProgress" color="pink" />

    <q-card-section class="row items-center no-wrap">
      <div class="col-auto q-pr-md">
        <q-spinner v-if="filePreparingForTranscription" size="30px" />
        <q-spinner-gears v-else color="primary" size="2em" />
      </div>

      <div class="col">
        <div v-if="filePreparingForTranscription" class="text-weight-bold">
          Preparing for transcription
        </div>
        <div v-else class="text-weight-bold">Transcribing...</div>
        <div class="text-grey" v-if="Math.floor(timeCounter / 10) % 2 === 0">
          Sit back and relax while your audio is Transcribing.
        </div>
        <div class="text-grey" v-else>
          The bigger your audio file, the longer it is going to take.
        </div>
      </div>

      <q-space />
      <!-- {{ timeCounter }} -->
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useAudioStore } from 'src/stores/audio';
import { computed, onMounted, ref } from 'vue';

const $q = useQuasar();
// const transProgress = ref(0.01);
const props = defineProps({
  id: {
    require: true,
    default: null,
  },
  estimate: {
    require: true,
    default: 180000,
  },
});

const audioStore = useAudioStore();

let transInterval: any;
const filePreparingForTranscription = ref(true);
const timeCounter = ref(0);
const totalTried = ref(0);
let timeCounterInterval = null as any;
const progressValue = ref(0);

const progressPercent = computed(() =>
  Math.floor((progressValue.value / props.estimate) * 100)
);
const transProgress = computed(() => (1 / 100) * progressPercent.value);

const waitForTranscription = () => {
  clearInterval(transInterval);
  filePreparingForTranscription.value = false;
  transInterval = setInterval(() => {
    progressValue.value += 1000;
  }, 1000);
};

const sendRequest = () => {
  const payload = {
    id: props.id,
  };
  try {
    api.post('/audio/transcribe', payload).then((res: any) => {
      console.log('response from transcribeByAudioId');
      console.log({ res });
      if (res.data.success) {
        // positive res
        transCriptionSuccessful();
      } else {
        // negative res
        // Media not found
        if (
          res.data?.message ===
          'Request failed or flac conversion not completed yet, try once later'
        ) {
          if (totalTried.value === 0) {
            console.log('1st try > media not found');
            totalTried.value++;
            // : 2nd try if not
            setTimeout(() => {
              console.log('2nd call');
              sendTranscriptionRequest();
            }, 10000);
          } else {
            console.log('2nd try res > media not found');
            // : media couldn't found
            // > call transcription failed
            transCriptionFailled(
              'Converted file not found. Try again after sometime'
            );
          }
        } else {
          // file found but still transcription failed
          transCriptionFailled('Unknown reason');
        }
        // transcriptin failed
      }
    });
  } catch (error) {
    transCriptionFailled('Unknown reason');
  }
};

const sendTranscriptionRequest = () => {
  console.log('check sendTranscriptionRequest');
  filePreparingForTranscription.value = true;
  // request sent
  sendRequest();
  setTimeout(() => {
    console.log('waitForTransTimeout');
    waitForTranscription();
  }, 10000);
  // wait 10s check response
  //  response found
  //  // negative res : media not found > try another time if its not 2nd time Or deploy transcription failed
  //  // positive res : transcription Successfull > get audios
  // after 10s response didn't come
  // // call waitForTranscription
  //
};

onMounted(() => {
  console.log('on mounted');
  init();
});

const transCriptionFailled = (msg: string) => {
  console.log('transCriptionFailled : ' + msg);
  if (props.id) audioStore.removeToTranscriptionList(props.id);
  $q.notify({
    type: 'negative',
    message: 'Transcription Failed : ' + msg,
  });
  reset();
};

const transCriptionSuccessful = () => {
  console.log('transCriptionSuccessful ');
  audioStore.loadData();
  if (props.id) audioStore.removeToTranscriptionList(props.id);
  // Success message
  $q.notify({
    type: 'positive',
    message: "Transcription successful. Let's move to next step. ",
  });
  reset();
};

const init = () => {
  console.log('ch init');
  filePreparingForTranscription.value = true;

  setTimeout(() => {
    console.log('check sendTranscriptionRequest');
    sendTranscriptionRequest();
  }, 10000);

  clearInterval(timeCounterInterval);
  timeCounterInterval = setInterval(() => {
    timeCounter.value++;
  }, 1000);
};

const reset = () => {
  timeCounter.value = 0;
  totalTried.value = 0;
  progressValue.value = 0;
  filePreparingForTranscription.value = true;
  clearInterval(timeCounterInterval);
};
</script>
