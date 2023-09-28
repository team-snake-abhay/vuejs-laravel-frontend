<template>
  <q-item
    class="q-my-sm rounded-borders bg-grey-2"
    :class="{ selected: id === audioStore.seleectedAudioIdForNewStory }"
    :active="id === audioStore.seleectedAudioIdForNewStory"
    active-class="text-primrary"
    dense
  >
    <q-item-section side>
      <q-radio
        v-model="audioStore.seleectedAudioIdForNewStory"
        :val="id"
        @click="$emit('select')"
        :disable="!isTranscribed || needUpgrade"
        :dense="$q.screen.lt.md"
      />
    </q-item-section>
    <q-item-section side>
      <q-btn
        round
        :icon="playingAudioId === id ? 'stop' : 'play_arrow'"
        flat
        @click="$emit('play')"
        :dense="$q.screen.lt.md"
      ></q-btn>
    </q-item-section>
    <q-item-section>{{ title }}</q-item-section>
    <q-item-section side>
      <q-btn
        v-if="!isTranscribed"
        color="black"
        round
        flat
        icon="loop"
        :loading="loadingTranscription"
        @click="transcribe"
      ></q-btn>
      <q-btn
        v-if="isTranscribed && needUpgrade"
        color="black"
        size="sm"
        dense
        outline
        label="Upgrade"
        class="bg-warning"
        no-caps
        :to="{ name: 'upgrades' }"
      >
        <q-tooltip anchor="top middle" self="bottom middle"
          >Upgrade to use it</q-tooltip
        >
      </q-btn>

      <q-btn
        v-if="isTranscribed && !hasWords"
        color="black"
        size="sm"
        dense
        outline
        label="Not Useable"
        class="bg-gray"
        no-caps
      >
      </q-btn>
    </q-item-section>

    <q-item-section side>
      <div>
        {{ durationText }}
        <q-btn round size="md" dense flat color="ndark" icon="more_vert">
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 100px" dense>
              <q-item
                clickable
                v-close-popup
                class="text-negative"
                @click="confirmDeleteAudio"
              >
                <q-item-section class="col-auto">
                  <q-icon name="delete"></q-icon>
                </q-item-section>
                <q-item-section>Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useAudioStore } from 'src/stores/audio';
import { useAuthStore } from 'src/stores/auth';
import { onMounted, PropType, ref, watch, computed } from 'vue';

const $q = useQuasar();
const props = defineProps({
  id: {
    require: true,
    type: Number,
  },
  localPath: {
    require: true,
    type: String,
  },
  title: {
    type: String,
    default: '-unknown',
  },
  playingAudioId: {
    type: Number,
    default: null,
  },
  isTranscribed: {
    type: Boolean,
    required: true,
    default: true,
  },
  audioLength: {
    type: Number as PropType<number | null>,
    required: true,
    default: null,
  },
  fileSize: {
    type: Number as PropType<number | null>,
    required: false,
    default: null,
  },
  hasWords: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const $emit = defineEmits(['play', 'select']);
const authStore = useAuthStore();
const audioStore = useAudioStore();
const loading = ref(false);
const loadingTranscription = ref(false);
const needUpgrade = ref(false);

const confirmDeleteAudio = async () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to delete this audio?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    // console.log('>>>> OK')
    loading.value = true;
    if (props.id) await audioStore.delete(props.id);
    audioStore.seleectedAudioIdForNewStory = null;
    loading.value = false;
  });
};

const transcribe = async () => {
  loadingTranscription.value = true;
  // await audioStore.transcribeByAudioId(props.id || null);
  if (props.id)
    audioStore.addToTranscriptionList(props.id, props.fileSize || 840000);
  loadingTranscription.value = false;
};

const durationText = computed(() => {
  return props.audioLength ? Math.round(props.audioLength / 60) + 'm' : '...';
});

const checkPermission = () => {
  if (props.isTranscribed && props.audioLength) {
    needUpgrade.value = authStore.permission.storyLength < props.audioLength;
  }
};

watch(
  () => props.isTranscribed,
  () => {
    checkPermission();
  }
);

onMounted(() => {
  checkPermission();
});
</script>
