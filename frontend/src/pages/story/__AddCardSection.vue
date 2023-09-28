<template>
  <div class="row q-col-gutter-lg">
    <div class="col">
      <div class="row">
        <div class="col-12">
          <div class="q-pa-md shadow-1 rounded-1" style="">
            <div class="row">
              <div class="col-auto">
                <div class="text-h3">Audio Transcript</div>
              </div>
              <div class="col"></div>
              <div class="col-auto lt-md">
                <q-btn
                  outline
                  color="primary"
                  label="Preview"
                  @click="$emit('preview')"
                  no-caps
                ></q-btn>
              </div>
            </div>
            <div class="row">
              <div class="subtitle text-ndark-2 q-mb-sm col">
                *Select the word where you want to add story card
              </div>
              <div class="auto" v-if="editingTranscription">
                <q-btn
                  label="Save"
                  color="primary"
                  no-caps
                  outline
                  size="sm"
                  class="q-ml-sm"
                  @click="saveTranscription"
                  :loading="transcriptChangesSaveLoading"
                >
                  <q-tooltip anchor="top middle" self="bottom middle"
                    >Save Changes</q-tooltip
                  >
                </q-btn>

                <q-btn
                  color="negative"
                  label="Cancel"
                  outline
                  size="sm"
                  class="q-ml-sm"
                  no-caps
                  @click="discardTranscriptionChanges"
                >
                  <q-tooltip anchor="top middle" self="bottom middle"
                    >Cancel Change</q-tooltip
                  >
                </q-btn>
              </div>
              <div class="auto" v-else>
                <q-btn
                  label="Edit"
                  size="sm"
                  class="q-ml-sm"
                  outline
                  no-caps
                  @click="editTranscription"
                >
                  <q-tooltip anchor="top middle" self="bottom middle"
                    >Edit Transcription</q-tooltip
                  >
                </q-btn>
              </div>
            </div>

            <div
              v-if="editingTranscription"
              class="textarea-box rounded-1 bg-nwhite max-content-element-height editing"
            >
              <span
                class="q-px-xs q-ml-none rounded-borders selectable-text"
                v-for="(w, k) in transcriptionChanges"
                :key="w.start"
                :class="{ active: usedTimePoint.indexOf(w.start) !== -1 }"
                >{{ w.word }}
                <q-popup-edit
                  color="green"
                  v-model="transcriptionChanges[k].word"
                  v-slot="scope"
                  class="dense-q-popup"
                  auto-save
                >
                  <q-input
                    class="text-center input-text-center"
                    v-model="scope.value"
                    dense
                    autofocus
                    outlined
                    rounded
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </span>
            </div>
            <div
              v-else
              class="textarea-box rounded-1 bg-nwhite max-content-element-height"
            >
              <span
                class="q-px-xs q-ml-none rounded-borders selectable-text"
                v-for="w in transcriptWords"
                :key="w.start"
                :class="{ active: usedTimePoint.indexOf(w.start) !== -1 }"
                @click="addCardHere(w)"
                >{{ w.word }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-auto gm-sm">
      <slot></slot>
    </div>
  </div>
  <q-dialog
    v-model="cardOptionsDialog"
    @hide="resetCardForm"
    :position="$q.screen.lt.md ? 'bottom' : 'standard'"
  >
    <q-card
      v-if="currentCard === 'cardOptionsDialog'"
      class="rounded-borders card-option-dialog"
    >
      <q-card-section
        class="bg-primary text-center text-white relative-position"
      >
        <div class="text-h6">
          Add Feeds

          <q-btn
            class="absolute-top-right rounded-borders q-ma-sm"
            dense
            flat
            color="white"
            icon="close"
            v-close-popup
          />
        </div>
        <div></div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center">
        <div class="row q-my-md">
          <!-- 1st button -->
          <div class="card-option-item-button">
            <q-btn
              flat
              size="xl"
              round
              class=""
              @click="currentCard = 'urlForm'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"
                ></path>
                <path
                  d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"
                ></path>
              </svg>
            </q-btn>
            <div class="text-primary text-bold">URL</div>
          </div>

          <!-- 2nd button -->
          <div class="card-option-item-button">
            <q-btn
              flat
              size="xl"
              round
              class=""
              @click="currentCard = 'quoteForm'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mantine-1f4mv1i"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M6 15h15"></path>
                <path d="M21 19h-15"></path>
                <path d="M15 11h6"></path>
                <path d="M21 7h-6"></path>
                <path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2"></path>
                <path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2"></path>
              </svg>
            </q-btn>
            <div class="text-primary text-bold">Quote</div>
          </div>

          <!-- 3rd button -->
          <div class="card-option-item-button">
            <q-btn
              flat
              size="xl"
              round
              class=""
              @click="currentCard = 'highlightForm'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mantine-1f4mv1i"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M3 19h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"
                ></path>
                <path d="M12.5 5.5l4 4"></path>
                <path d="M4.5 13.5l4 4"></path>
                <path d="M21 15v4h-8l4 -4z"></path>
              </svg>
            </q-btn>
            <div class="text-primary text-bold">Highlight</div>
          </div>

          <!-- 4th button -->
          <div class="card-option-item-button">
            <q-btn
              flat
              size="xl"
              round
              class=""
              @click="currentCard = 'definitionForm'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mantine-1f4mv1i"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M16 5h-8v10h8m-1 -5h-7"></path>
                <line x1="6" y1="20" x2="6" y2="20.01"></line>
                <line x1="10" y1="20" x2="10" y2="20.01"></line>
                <line x1="14" y1="20" x2="14" y2="20.01"></line>
                <line x1="18" y1="20" x2="18" y2="20.01"></line>
              </svg>
            </q-btn>
            <div class="text-primary text-bold">Definition</div>
          </div>

          <!-- 5th button -->
          <div class="card-option-item-button">
            <q-btn
              flat
              size="xl"
              round
              class=""
              @click="currentCard = 'imageForm'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mantine-1f4mv1i"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="15" y1="8" x2="15.01" y2="8"></line>
                <rect x="4" y="4" width="16" height="16" rx="3"></rect>
                <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5"></path>
                <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2"></path>
              </svg>
            </q-btn>
            <div class="text-primary text-bold">Image</div>
          </div>

          <!-- 6th button -->
          <div class="card-option-item-button">
            <q-btn
              flat
              size="xl"
              round
              class=""
              @click="currentCard = 'profileForm'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mantine-1f4mv1i"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <circle cx="12" cy="12" r="9"></circle>
                <circle cx="12" cy="10" r="3"></circle>
                <path
                  d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"
                ></path>
              </svg>
            </q-btn>
            <div class="text-primary text-bold">Profile</div>
          </div>

          <!-- 7th button -->
          <div class="card-option-item-button">
            <q-btn
              flat
              size="xl"
              round
              class=""
              @click="currentCard = 'listForm'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mantine-1f4mv1i"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="9" y1="6" x2="20" y2="6"></line>
                <line x1="9" y1="12" x2="20" y2="12"></line>
                <line x1="9" y1="18" x2="20" y2="18"></line>
                <line x1="5" y1="6" x2="5" y2="6.01"></line>
                <line x1="5" y1="12" x2="5" y2="12.01"></line>
                <line x1="5" y1="18" x2="5" y2="18.01"></line>
              </svg>
            </q-btn>
            <div class="text-primary text-bold">List</div>
          </div>

          <!-- 8th button -->
          <div class="card-option-item-button">
            <q-tooltip
              v-if="!authStore.permission.cta"
              anchor="top middle"
              self="top middle"
              transition-show="scale"
              transition-hide="scale"
            >
              Need upgraded package
            </q-tooltip>
            <q-btn
              flat
              size="xl"
              round
              class=""
              :disable="!authStore.permission.cta"
              @click="currentCard = 'ctaForm'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-external-link"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                ></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </q-btn>
            <div class="text-primary text-bold">CTA Button</div>
          </div>
        </div>
      </q-card-section>

      <div class=""></div>
    </q-card>

    <DefinitionCardForm
      v-if="currentCard === 'definitionForm'"
      @prev="currentCard = 'cardOptionsDialog'"
      @finished="closePopup"
    ></DefinitionCardForm>

    <HighlightCardForm
      v-if="currentCard === 'highlightForm'"
      @prev="currentCard = 'cardOptionsDialog'"
      @finished="closePopup"
    ></HighlightCardForm>

    <ImageCardForm
      v-if="currentCard === 'imageForm'"
      @prev="currentCard = 'cardOptionsDialog'"
      @finished="closePopup"
    ></ImageCardForm>

    <ListCardForm
      v-if="currentCard === 'listForm'"
      @prev="currentCard = 'cardOptionsDialog'"
      @finished="closePopup"
    ></ListCardForm>

    <ProfileCardForm
      v-if="currentCard === 'profileForm'"
      @prev="currentCard = 'cardOptionsDialog'"
      @finished="closePopup"
    ></ProfileCardForm>

    <QuoteCardForm
      v-if="currentCard === 'quoteForm'"
      @prev="currentCard = 'cardOptionsDialog'"
      @finished="closePopup"
    ></QuoteCardForm>

    <UrlCardForm
      v-if="currentCard === 'urlForm'"
      @prev="currentCard = 'cardOptionsDialog'"
      @finished="closePopup"
    ></UrlCardForm>
    <CTAButtonForm
      v-if="currentCard === 'ctaForm'"
      @prev="currentCard = 'cardOptionsDialog'"
      @finished="closePopup"
    ></CTAButtonForm>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStoryStore } from '../../stores/story';
import { useAudioStore } from '../../stores/audio';
import { useAuthStore } from '../../stores/auth';
// import QouteCard from '../';
import DefinitionCardForm from '../../components/forms/DefinitionCardForm.vue';
import HighlightCardForm from '../../components/forms/HighlightCardForm.vue';
import ImageCardForm from '../../components/forms/ImageCardForm.vue';
import ListCardForm from '../../components/forms/ListCardForm.vue';
import ProfileCardForm from '../../components/forms/ProfileCardForm.vue';
import QuoteCardForm from '../../components/forms/QuoteCardForm.vue';
import UrlCardForm from '../../components/forms/UrlCardForm.vue';
import CTAButtonForm from '../../components/forms/CTAButtonForm.vue';
import { Card, AudioTextRefPoint } from 'components/models';
import type { Ref } from 'vue';

const store = useStoryStore();
const audioStore = useAudioStore();
const authStore = useAuthStore();
const $emit = defineEmits(['preview']);

const transcriptWords = computed(() => {
  return audioStore.audio?.transcript || [];
});

const transcriptionChanges = ref<AudioTextRefPoint[]>([]);

const currentCard = ref('cardOptionsDialog');
// const currentCard = ref('urlForm');
const cardOptionsDialog = ref(false);
const editingTranscription = ref(false);
const transcriptChangesSaveLoading = ref(false);

const closePopup = () => {
  cardOptionsDialog.value = false;
};

const selectedAudioRefWord: Ref<AudioTextRefPoint | null> = ref(null);

const addCardHere = (w: AudioTextRefPoint) => {
  if (usedTimePoint.value.indexOf(w.start) === -1) {
    openCardOptionDialog(w);
  } else {
    const c = store.getCardByTimestamp(w.start);
    if (c) {
      editCard(c);
    }
  }
};
const openCardOptionDialog = (audioRefWord: AudioTextRefPoint) => {
  selectedAudioRefWord.value = audioRefWord;
  store.word = audioRefWord;
  // currentCard.value = 'cardOptionsDialog';
  cardOptionsDialog.value = true;
};

const usedTimePoint = computed(() => store.activeRefPoints);
// const done3 = ref(false);
// const step = ref(1);

// onMounted(() => {
//   console.log('this is Create Story page');
// });

const editCard = (c: Card) => {
  store.card = c;
  store.word = c.word;
  currentCard.value = c.type + 'Form';
  cardOptionsDialog.value = true;
};

const resetCardForm = () => {
  currentCard.value = 'cardOptionsDialog';
  console.log('reset addcardsection card');
  if (store.card) {
    // TODO: make nullable card
    store.card = null;
  }
};

defineExpose({
  editCard,
});

const editTranscription = () => {
  editingTranscription.value = true;
  // let newData = Object.assign(audioStore.audio?.transcript||[], []);
  transcriptionChanges.value = JSON.parse(
    JSON.stringify(transcriptWords.value)
  );
};

const saveTranscription = async () => {
  transcriptChangesSaveLoading.value = true;
  if (audioStore.audio?.id) {
    await audioStore.updateTranscriptionById(
      audioStore.audio.id,
      transcriptionChanges.value
    );
    await audioStore.selectAudioById(audioStore.audio.id);
  }
  editingTranscription.value = false;
  transcriptChangesSaveLoading.value = false;
};

const discardTranscriptionChanges = () => {
  editingTranscription.value = false;
};
</script>

<style lang="scss" scoped>
.selectable-text {
  cursor: pointer;
  display: inline-block;
}
.selectable-text:hover {
  background-color: $secondary-lite;
}
.selectable-text:active,
.selectable-text.active {
  background-color: $secondary;
}

.card-option-dialog {
  max-width: 620px;
}

.card-option-item-button .q-btn {
  color: $primary-dark;
  background: $secondary-lite-2;
  padding: 2rem;
  margin: 12px 16px;
}
.card-option-item-button .q-btn:hover {
  background: $secondary-lite;
}
</style>
