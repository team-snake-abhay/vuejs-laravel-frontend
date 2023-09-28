<template>
  <div class="row" v-if="store.story">
    <div class="col-12 q-mb-md limited-max-width">
      <label class="text-bold"
        >Title <span class="text-negative">*</span></label
      >
      <q-input
        outlined
        dense
        placeholder="Awesome Story"
        v-model="store.story.title"
        :rules="[
          (val) => !!val || 'Field is required',
          (val) => val.length <= 100 || 'Please use maximum 100 characters. ',
        ]"
      />
    </div>

    <div class="col-12 q-mb-md limited-max-width">
      <q-tooltip
        v-if="!authStore.permission.chapter"
        anchor="center middle"
        self="top middle"
        :offset="[10, 10]"
      >
        <strong>Need upgraded package </strong>
      </q-tooltip>
      <label
        :class="authStore.permission.chapter ? '' : 'text-ndark-3'"
        class="text-bold"
        >Add or choose chapter (optional)
      </label>
      <InputSelectorWithCreate
        v-model="store.story.chapter_name"
        :options="chapterStore.chapterList"
        @add-new="addNewChapter"
        :loading="chapterCreating"
        v-if="authStore.permission.chapter"
      ></InputSelectorWithCreate>

      <div v-else class="bg-nwhite q-py-md rounded-borders"></div>
    </div>

    <div class="col-12 q-mb-md limited-max-width">
      <q-tooltip
        v-if="!authStore.permission.pass"
        anchor="center middle"
        self="top middle"
        :offset="[10, 10]"
      >
        <strong>Need upgraded package </strong>
      </q-tooltip>
      <label
        :class="authStore.permission.pass ? '' : 'text-ndark-3'"
        class="text-bold"
        >Add Password (optional)
      </label>
      <q-input
        v-model="store.story.pw"
        outlined
        type="text"
        hint="Restrict everyone to see it"
        dense
        autocomplete="nope"
        name="lock"
        v-if="authStore.permission.pass"
      >
      </q-input>
      <div v-else class="bg-nwhite q-py-md rounded-borders"></div>
    </div>

    <div class="col-12 q-mb-md limited-max-width">
      <q-tooltip
        v-if="!authStore.permission.backgroundMusic"
        anchor="center middle"
        self="top middle"
        :offset="[10, 10]"
      >
        <strong>Need upgraded package </strong>
      </q-tooltip>

      <label
        :class="authStore.permission.backgroundMusic ? '' : 'text-ndark-3'"
        class="text-bold"
        >Background Music (optional)</label
      >

      <div
        class="row q-col-gutter-sm"
        v-if="authStore.permission.backgroundMusic"
      >
        <div class="col-2">
          <q-btn
            outline
            :disable="!store.story.background_audio"
            round
            @click="playBGMusic(store.story?.background_audio || '')"
            :dense="$q.screen.lt.md"
            class="text-ndark-2"
          >
            <q-icon
              v-if="audioPlayerElement && audioPlayerElement.isPlaying"
              class="rotate-continuously"
              name="pause"
              color="red"
            ></q-icon>
            <q-icon v-else name="play_arrow"></q-icon>
          </q-btn>
        </div>
        <div class="col-10">
          <q-select
            class="text-ndark-2"
            v-model="store.story.background_audio"
            dense
            outlined
            :options="audioStore.backgroundAudios"
            option-label="title"
            option-value="path"
            clearable
            emit-value
            @update:model-value="stopBGMusic"
            :display-value="`${
              store.story.background_audio
                ? audioStore.backgroundAudios[
                    audioStore.backgroundAudios.findIndex(
                      (i) => i.path === store.story?.background_audio
                    )
                  ].title
                : 'Choose'
            }`"
          />
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col-auto q-pr-md">Volume</div>

            <div class="col q-pr-sm">
              <q-slider
                :marker-labels="volumeLabel"
                :modelValue="store.story.background_volume || 0.2"
                @update:modelValue="setVolume"
                :min="0.0"
                :max="0.5"
                :step="0.1"
              />
            </div>
          </div>
        </div>
        <AudioPlayer
          v-show="!!store.story.background_audio"
          :audio="store.story.background_audio"
          ref="audioPlayerElement"
          class="hidden"
        ></AudioPlayer>
      </div>

      <div v-else class="bg-nwhite q-py-md rounded-borders"></div>
    </div>
    <div class="col-12 q-mb-md limited-max-width">
      <label class="text-bold">Add a Cover Image for your awesome story</label>
      <SingleImageFileUploader
        v-model="store.story.thumbnail"
        class="q-mt-xs limited-max-width"
      ></SingleImageFileUploader>
    </div>

    <div
      v-if="!(store.story.thumbnail && store.story.thumbnail !== '')"
      class="col-12 q-mb-md limited-max-width"
    >
      <label
        :class="authStore.permission.imageSearch ? '' : 'text-ndark-3'"
        class="text-bold"
        >Or choose from Unsplash
      </label>
      <q-tooltip
        v-if="!authStore.permission.imageSearch"
        anchor="center middle"
        self="top middle"
        :offset="[10, 10]"
      >
        <strong>Need upgraded package </strong>
      </q-tooltip>
      <UnsplashImageSelector
        @on-select="
          (v) => {
            if (store.story) store.story.thumbnail = v;
          }
        "
        v-if="authStore.permission.imageSearch"
        orientation="portrait"
      ></UnsplashImageSelector>
      <div v-else class="bg-nwhite q-py-md rounded-borders"></div>
    </div>
  </div>
  <div v-else class="text-center">
    <q-spinner />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
// import { Card, Story } from '../models';
import { useStoryStore } from '../../stores/story';
import { useChapterStore } from '../../stores/chapter';
// import { isValueProvided } from '../validators';
import SingleImageFileUploader from '../SingleImageFileUploader.vue';
import InputSelectorWithCreate from '../InputSelectorWithCreate.vue';
import UnsplashImageSelector from '../UnsplashImageSelector.vue';
import { useAuthStore } from 'src/stores/auth';
import { useAudioStore } from 'src/stores/audio';
import AudioPlayer from 'components/AudioPlayer.vue';

const store = useStoryStore();
const authStore = useAuthStore();
const chapterStore = useChapterStore();
const audioStore = useAudioStore();
const chapterCreating = ref(false);
const searchedTextForChapter = ref('');
const audioPlayerElement = ref(null as any);
const volumeLabel = (val: number) => `${Math.round(10 * val)}`;

const addNewChapter = async (val: string) => {
  chapterCreating.value = true;
  // console.log('includes? ' + searchedTextForChapter.value);
  console.log(chapterStore.chapterList.includes(searchedTextForChapter.value));
  // TODO: condition of checking unique value
  await chapterStore.addNewChapter(val);
  chapterCreating.value = false;
  setStoryChapter(val);
};

const setStoryChapter = (val: string | undefined) => {
  if (store.story) {
    store.story.chapter_name = val;
  }
};

const playBGMusic = (url: string): void => {
  if (audioPlayerElement.value.isPlaying) {
    // stop
    audioPlayerElement.value.stop();
  } else {
    audioPlayerElement.value.init(url, store.story?.background_volume || 0.2);
    audioPlayerElement.value.play();
  }
};

const stopBGMusic = () => {
  if (audioPlayerElement.value.isPlaying) {
    // stop
    audioPlayerElement.value.stop();
  }
};

const setVolume = (level: number | null) => {
  if (store.story) {
    audioPlayerElement.value.setVolume(level);
    store.story.background_volume = level;
  }
};

onMounted(() => {
  chapterStore.loadDummyChapters();
});
('');
</script>

<style lang="scss" scoped>
.file-upload-area {
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
  padding: 16px;
  user-select: none;
  transition: background-color 150ms ease 0s;
  position: relative;
  cursor: pointer;
}

.selected-file-display-area:hover .clear-button {
  background-color: white;
  // border: 1px solid rgba(255, 0, 0, 0.238);
}
</style>
