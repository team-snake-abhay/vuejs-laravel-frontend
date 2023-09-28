<template>
  <div class="col-12 audioPlayerArea limited-max-width">
    <div class="row justify-center q-mb-md">
      <!-- <div class="col-12">
        <audio id="wavSource" :src="audio" type="audio/wav" controls></audio>
      </div> -->
      <div class="col-12">
        <div class="row items-center q-px-md">
          <div class="col-auto q-pa-sm">{{ formatedPlayedTime }}</div>
          <q-slider
            class="col q-pa-sm"
            v-model="sliderModel"
            color="deep-orange"
            :marker-labels="objMarkerLabel"
            switch-marker-labels-side
            marker-labels-class="marker-label-as-marker-point"
            :min="0"
            :max="tDurationInt"
          />
          <div class="col-auto q-pa-sm">{{ formatedDuration() }}</div>
        </div>
      </div>
      <div class="col-auto q-pa-sm q-mt-xs">
        <q-btn
          class="flip-vertical"
          round
          size="sm"
          @click="backward"
          color="ndark-2"
          icon="undo"
        />
      </div>
      <div class="col-auto q-py-xs q-px-sm">
        <q-btn
          round
          size="md"
          @click="playToggle"
          color="primary"
          :loading="audioLoading"
          :icon="isPlaying ? 'o_pause' : 'o_play_arrow'"
        />
      </div>
      <div class="col-auto q-pa-sm q-mt-xs">
        <q-btn
          class="flip-vertical"
          round
          size="sm"
          @click="forward"
          color="ndark-2"
          icon="redo"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { throttle, useQuasar } from 'quasar';
// import { usePublicStore } from '../stores/public';
const $q = useQuasar();
const props = defineProps({
  playTime: {
    required: false,
    default: 0,
  },
  audio: {
    type: String,
    default: null,
  },
  totalDuration: {
    type: Number,
    default: null,
  },
  background_audio: {
    type: String,
    default: null,
  },
  background_volume: {
    type: [Number, String],
    default: 0.2,
  },
});
const emit = defineEmits(['update:playTime', 'onAudioEnd']);

// const publicStore = usePublicStore();

// const playerTimeNow = ref(0);
// const start = ref(0);
// // const duration = ref(0);
// const audioLength = ref(0);

const audioLoading = ref(false);
const isPlaying = ref(false);
const playTimeRef = ref(0);
// let storyAudio = null as any;
let storyAudio = ref<any>(null);
let bgAudio = ref<any>(null);
const tDurationInt = ref(0);

// player button actions
const playToggle = async () => {
  console.count('playToggle trigered');
  if (isPlaying.value) await pause();
  else await play();
};
const play = async () => {
  if (!storyAudio.value && props.audio) {
    console.log('pler - play to init');
    await init(props.audio);
  }
  console.log({ 'pler - playing error': storyAudio.value });
  isPlaying.value = true;
  console.count('playing story audio');
  await storyAudio.value.play();
  console.count('playing bgAudio');
  if (bgAudio.value) await bgAudio.value.play();
};
const pause = async () => {
  console.count('pause trigered');
  isPlaying.value = false;
  await storyAudio.value.pause();
  if (bgAudio.value) await bgAudio.value.pause();
};
const stop = async () => {
  console.count('pause trigered');
  isPlaying.value = false;
  if (storyAudio.value) await storyAudio.value.setAttribute('src', null);
  if (bgAudio.value) await bgAudio.value.setAttribute('src', null);
};
const forward = async () => {
  console.count('forward trigered');
  if (storyAudio.value.currentTime + 5 < storyAudio.value.duration) {
    storyAudio.value.currentTime = storyAudio.value.currentTime + 5;

    // background audio forward
    if (bgAudio.value) {
      if (bgAudio.value.currentTime + 5 < bgAudio.value.duration) {
        bgAudio.value.currentTime = bgAudio.value.currentTime + 5;
      } else {
        // on bgaudio.value finish start from begining
        bgAudio.value.currentTime =
          bgAudio.value.currentTime + 5 - bgAudio.value.duration;
      }
    }
  }
};
const backward = () => {
  console.log('backward trigered');
  if (storyAudio.value.currentTime > 5) {
    storyAudio.value.currentTime = storyAudio.value.currentTime - 5;
    if (bgAudio.value)
      bgAudio.value.currentTime = storyAudio.value.currentTime - 5;
  } else {
    storyAudio.value.currentTime = 0;
    if (bgAudio.value) bgAudio.value.currentTime = 0;
  }
};
const setVolume = (level: number) => {
  storyAudio.value.volume = level;
};
const sliderModel = computed({
  get() {
    return playTimeRef.value;
  },
  set(val) {
    if (isPlaying.value) pause();
    storyAudio.value.currentTime = val;
    emitPlayTime(val);
  },
});

// formated data
const formatedPlayedTime = computed(() => {
  return formatToMMSS(playTimeRef.value);
});
const formatedDuration = () => {
  const duration =
    storyAudio.value?.duration && Number.isInteger(storyAudio.value.duration)
      ? storyAudio.value.duration
      : props.totalDuration
      ? props.totalDuration
      : null;
  tDurationInt.value = duration;
  return duration ? formatToMMSS(duration) : '00:00';
};

const formatToMMSS = (val: number) => {
  const min = Math.floor(val / 60);
  const sec = Math.floor(val % 60);
  return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
};

const updatePlayTime = () => {
  // console.count('play');
  playTimeRef.value = storyAudio.value.currentTime;
  emitPlayTime(storyAudio.value.currentTime);
};

const emitPlayTime = throttle((val) => {
  // console.count('emitPlayTime  > ' + val);
  emit('update:playTime', val.toFixed(1));
}, 500);

// const objMarkerLabel = { 0: '•', 20: '•' };
const objMarkerLabel = {};

const init = async (audioLink: string, volume = 1) => {
  audioLoading.value = true;
  console.log('init from audio player');
  if (audioLink) {
    try {
      // init Story audio
      if (storyAudio.value) {
        storyAudio.value.setAttribute('src', audioLink);
      } else {
        storyAudio.value = await new Audio(audioLink);
      }
      storyAudio.value.volume = volume;

      tDurationInt.value = storyAudio.value?.duration
        ? storyAudio.value.duration
        : props.totalDuration
        ? props.totalDuration
        : null;

      if (props.background_audio) {
        // init background audio
        if (bgAudio.value) {
          bgAudio.value.setAttribute('src', props.background_audio);
        } else {
          bgAudio.value = await new Audio(props.background_audio);
          bgAudio.value.volume = props.background_volume || 0.1;
        }
        bgAudio.value.onended = function () {
          // bgAudio.value.currentTime = 0
          bgAudio.value.play();
        };

        await Promise.all([storyAudio.value.load(), bgAudio.value.load()]);
      } else {
        await storyAudio.value.load();
      }
      storyAudio.value.volume = volume;
      storyAudio.value.ontimeupdate = updatePlayTime;
      storyAudio.value.onended = reset;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: "Sorry! Couldn't access the audio.",
      });
    }
  } else {
    console.log({ 'perl - audio init ': audioLink });
    $q.notify({
      type: 'negative',
      message: "Couldn't access the audio.",
    });
  }

  audioLoading.value = false;
};

const reset = () => {
  console.log('audio > on ended > reset');
  init(props.audio);
  playTimeRef.value = 0;
  emitPlayTime(0);
  emit('onAudioEnd');

  isPlaying.value = false;
};

onMounted(async () => {
  console.log('perl - on mounted calling init');
  console.log({ 'props-audio': props.audio });
  if (props.audio) {
    await init(props.audio);
  } else {
    console.log('perl - audio not found');
  }
});

onBeforeUnmount(() => {
  stop();
});
defineExpose({ init, play, stop, isPlaying, setVolume });
</script>

<style lang="scss" scoped>
.audioPlayerArea {
  height: 81px;
}
</style>
