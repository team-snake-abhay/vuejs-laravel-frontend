<template>
  <div class="row q-col-gutter-lg">
    <div class="col-12 col-md-5">
      <div
        class="row q-col-gutter-lg text-center justify-center items-center audio-uploader-buttons"
      >
        <div
          class="col-6 col-md-12 cursor-pointer"
          @click="recordAudioDialog = true"
        >
          <div class="shadow-1 rounded-1">
            <img
              src="~assets/record.svg"
              alt="Record audio in borwser"
              class="q-pa-lg"
              :ratio="1 / 1"
              :height="$q.screen.lt.md ? '' : 270"
              style="max-width: 100%"
            />
            <div class="q-px-lg q-pb-lg text-semi-bold">
              Record audio in browser
            </div>
          </div>
        </div>
        <div
          class="col-6 col-md-12 cursor-pointer"
          @click="openAudioUploadForm"
        >
          <div class="shadow-1 rounded-1">
            <img
              src="~assets/upload.svg"
              alt="Upload your own audio"
              :height="$q.screen.lt.md ? '' : 270"
              class="q-pa-lg"
              style="max-width: 100%; max-height: 100%"
            />
            <div class="q-px-lg q-pb-lg text-semi-bold">
              Upload your own audio
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-7">
      <div
        :class="{ 'shadow-1 q-pa-md rounded-1': $q.screen.gt.sm }"
        style="width: 100%; height: 100%; overflow-y: auto"
      >
        <div class="row">
          <div class="col-12 text-h3">All Audios</div>
          <q-separator />

          <div class="col-12" style="">
            <q-spinner v-if="loading" />
            <q-spinner v-if="audioLoadingToPlay" />
            <q-list v-else>
              <AudioListItem
                v-for="a in audioStore.audios"
                :key="a.id"
                class="q-my-sm rounded-borders bg-grey-2"
                :class="{
                  selected: a.id === audioStore.seleectedAudioIdForNewStory,
                }"
                :active="a.id === audioStore.seleectedAudioIdForNewStory"
                active-class="text-primrary"
                :id="a.id"
                :local-path="a.local_path"
                :title="a.title"
                :playingAudioId="playingAudioId"
                :audioLength="
                  !!a.transcript && !!a.transcript.length
                    ? a.transcript[a.transcript.length - 1].start
                    : null
                "
                :hasWords="a.transcript && !!a.transcript.length"
                :fileSize="a.meta_info?.file_size || null"
                @play="playAudio(a.id, a.local_path, !!a.transcript)"
                @select="selectedAudioPath = a.local_path"
                :isTranscribed="!!a.transcript"
              ></AudioListItem>
              <div
                v-if="!audioStore.audios?.length"
                class="text-center text-ndark-2"
              >
                -- no items here --
              </div>
            </q-list>
          </div>
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div style="display: none">
            <AudioPlayer
              v-show="!!audioStore.seleectedAudioIdForNewStory"
              :audio="selectedAudioPath"
              ref="audioPlayerElement"
            ></AudioPlayer>
          </div>
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="addAudioDialog">
    <q-card class="rounded-borders audio-upload-card">
      <q-card-section>
        <AudioUploadForm @uploaded="onAudioUpload"></AudioUploadForm>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="recordAudioDialog" persistent>
    <q-card class="rounded-borders audio-record-card bg-nwhite q-pa-md">
      <AudioRecorder @close="recordAudioDialog = false"></AudioRecorder>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AudioUploadForm from '../../components/forms/AudioUploadForm.vue';
import AudioListItem from 'components/AudioListItem.vue';
import AudioPlayer from 'components/AudioPlayer.vue';
import { useAudioStore } from '../../stores/audio';
import AudioRecorder from 'components/AudioRecorder.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const audioPlayerElement = ref(null as any);
const audioStore = useAudioStore();
const loading = ref(false);
const addAudioDialog = ref(false);
const recordAudioDialog = ref(false);
const playingAudioId = ref(null as any);
const selectedAudioPath = ref('');
const selectedAudioForDelete = ref(null as null | number);
const audioLoadingToPlay = ref(false);

// const audioPlayingNow = ref(null as any);

const playAudio = async (id: any, url: string, isTranscribed: boolean) => {
  console.log('play audio trigger');
  if (isTranscribed) audioStore.seleectedAudioIdForNewStory = id;

  if (playingAudioId.value !== id) {
    playingAudioId.value = id;
    console.log('pler - initiating audio from list item parent');
    console.log({ url });
    audioLoadingToPlay.value = true;
    await audioPlayerElement.value.init(url);
    audioPlayerElement.value.play();
    audioLoadingToPlay.value = false;
  } else {
    playingAudioId.value = null;
    audioPlayerElement.value.stop();
  }
};

const onAudioUpload = () => {
  addAudioDialog.value = false;
  getAudios();
};

const getAudios = async () => {
  loading.value = true;
  await audioStore.loadData();
  loading.value = false;
};

onMounted(async () => {
  getAudios();
});

const openAudioUploadForm = () => {
  addAudioDialog.value = true;
};
</script>

<style lang="scss" scoped></style>
