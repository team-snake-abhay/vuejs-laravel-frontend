<template>
  <q-page class="row bg-primary">
    <div class="container">
      <q-card style="height: auto" :class="{ 'horizontal ': $q.screen.lt.md }">
        <div class="row">
          <div
            class="col-12 col-md-2 items-center"
            :style="$q.screen.gt.sm ? 'height: 100%' : ''"
            :class="{ 'row justify-evenly': $q.screen.lt.md }"
          >
            <div
              :class="{ active: step === 1 }"
              class="step-button text-center cursor-pointer q-mt-md q-mb-sm q-pt-sm"
              @click="step = 1"
            >
              <q-btn
                v-if="step > 1"
                filled
                color="nwhite-2"
                text-color="primary"
                size="32px"
                round
                dense
                class="q-mt-md q-mb-sm"
              >
                <q-icon size="32px" name="done" />
              </q-btn>

              <q-btn
                v-else
                filled
                color="nwhite-2"
                text-color="ndark"
                size="32px"
                label="1"
                round
                dense
                class="q-mt-md q-mb-sm"
              />
              <div class="step-text text-semi-bold">Select Audio</div>
            </div>

            <div
              :class="{ active: step === 2 }"
              class="step-button text-center cursor-pointer q-mt-md q-mb-sm q-pt-sm"
              @click="
                async () => {
                  if (store.story && audioStore.seleectedAudioIdForNewStory) {
                    step = 2;
                    await audioStore.selectAudioById(
                      audioStore.seleectedAudioIdForNewStory
                    );
                    if (audioStore.audio) {
                      store.story.audio_id =
                        audioStore.seleectedAudioIdForNewStory;
                    } else {
                      step = 1;
                    }
                  }
                }
              "
            >
              <q-btn
                v-if="step > 2"
                filled
                color="nwhite-2"
                text-color="primary"
                size="32px"
                round
                dense
                class="q-mt-md q-mb-sm"
              >
                <q-icon size="32px" name="done" />
              </q-btn>
              <q-btn
                v-else
                :disable="!audioStore.seleectedAudioIdForNewStory"
                filled
                color="nwhite-2"
                text-color="ndark"
                size="32px"
                label="2"
                round
                dense
                class="q-mt-md q-mb-sm"
              />
              <div class="step-text text-semi-bold">Create Content</div>
            </div>

            <div
              :class="{ active: step === 3 }"
              class="step-button text-center cursor-pointer q-mt-md q-mb-sm q-pt-sm"
              @click="
                () => {
                  if (!!store.story?.cards.length) {
                    step = 3;
                  }
                }
              "
            >
              <q-btn
                v-if="step > 3"
                filled
                color="nwhite-2"
                text-color="primary"
                size="32px"
                round
                dense
                class="q-mt-md q-mb-sm"
              >
                <q-icon size="32px" name="done" />
              </q-btn>
              <q-btn
                v-else
                :disable="!store.story?.cards.length"
                filled
                color="nwhite-2"
                text-color="ndark"
                size="32px"
                label="3"
                round
                dense
                class="q-mt-md q-mb-sm"
              />
              <div class="step-text text-semi-bold">Publish</div>
            </div>

            <!-- <q-tabs v-model="tab" vertical class="text-teal">
              <q-tab name="mails" no-caps color="ndark"> </q-tab>
              <q-tab name="alarms" icon="alarm" label="Alarms" />
              <q-tab name="movies" icon="movie" label="Movies" />
            </q-tabs> -->
          </div>
          <div class="col-12 col-md">
            <q-tab-panels
              v-model="step"
              animated
              swipeable
              :vertical="$q.screen.gt.sm"
              transition-prev="jump-down"
              transition-next="jump-up"
            >
              <q-tab-panel :name="1" class="col-12" style="height: 100%">
                <div :class="$q.screen.gt.sm ? 'q-pa-md' : ''">
                  <AddAudioSection></AddAudioSection>
                  <q-stepper-navigation class="row q-pt-md">
                    <div class="col"></div>
                    <div class="col-auto">
                      <q-btn
                        :disable="!audioStore.seleectedAudioIdForNewStory"
                        @click="
                          async () => {
                            if (
                              store.story &&
                              audioStore.seleectedAudioIdForNewStory
                            ) {
                              step = 2;
                              await audioStore.selectAudioById(
                                audioStore.seleectedAudioIdForNewStory
                              );
                              if (audioStore.audio) {
                                store.story.audio_id =
                                  audioStore.seleectedAudioIdForNewStory;
                              } else {
                                step = 1;
                              }
                            }
                          }
                        "
                        color="primary"
                        label="Next Step"
                        no-caps
                      />
                    </div>
                  </q-stepper-navigation>
                </div>
              </q-tab-panel>

              <q-tab-panel :name="2" class="col-12" style="height: 100%">
                <div :class="$q.screen.gt.sm ? 'q-pa-md' : ''">
                  <AddCardSection
                    ref="addCardSectionElement"
                    @preview="cardsPreviewDialog = true"
                  >
                    <div
                      class="gt-sm"
                      v-show="step > 1"
                      style="min-width: 373px"
                    >
                      <CurrentStoryCardPreview
                        @edit-card="editCard"
                        :isLoading="loadingStory"
                      ></CurrentStoryCardPreview>
                    </div>
                  </AddCardSection>
                  <q-stepper-navigation class="row q-pt-md">
                    <div class="col-auto">
                      <q-btn
                        outline
                        @click="step = 1"
                        color="primary"
                        label="Back"
                        class="q-ml-sm"
                        no-caps
                      />
                    </div>
                    <div class="col"></div>
                    <div class="col-auto">
                      <!-- <q-btn
                            class="q-ml-md"
                            color="primary"
                            outline
                            label="Preview"
                            no-caps
                          /> -->
                      <q-btn
                        :disable="!store.story?.cards.length"
                        class="q-ml-md"
                        @click="
                          () => {
                            step = 3;
                          }
                        "
                        color="primary"
                        label="Next"
                        no-caps
                      />
                    </div>
                  </q-stepper-navigation>
                </div>
              </q-tab-panel>

              <q-tab-panel :name="3" class="col-12" style="height: 100%">
                <div :class="$q.screen.gt.sm ? 'q-pa-md' : ''">
                  <SaveStorySection @preview="cardsPreviewDialog = true">
                    <div
                      class="gt-sm"
                      v-show="step > 1"
                      style="min-width: 373px"
                    >
                      <CurrentStoryCardPreview
                        @edit-card="editCard"
                        :isLoading="loadingStory"
                      ></CurrentStoryCardPreview>
                    </div>
                  </SaveStorySection>
                  <q-stepper-navigation class="row q-pt-md">
                    <div class="col-auto">
                      <q-btn
                        outline
                        @click="step = 2"
                        color="primary"
                        label="Back"
                        class="q-ml-sm"
                        no-caps
                      />
                    </div>
                    <div class="col"></div>

                    <div class="col-auto">
                      <q-btn
                        class="q-ml-md"
                        :disable="!store.story?.title"
                        color="primary"
                        @click="saveDraft"
                        label="Save Draft"
                        no-caps
                        outline
                        :loading="creatingDraftStory"
                      />
                      <q-btn
                        class="q-ml-md"
                        :disable="!store.story?.title"
                        color="primary"
                        @click="confirmPublish"
                        label="Publish"
                        no-caps
                        :loading="creatingPublicStory"
                      />
                    </div>
                  </q-stepper-navigation>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card>
    </div>

    <q-dialog position="bottom" v-model="cardsPreviewDialog">
      <CurrentStoryCardPreview
        @edit-card="editCard"
        :isLoading="loadingStory"
      ></CurrentStoryCardPreview>
    </q-dialog>

    <q-dialog
      :model-value="creatingPublicStory || creatingDraftStory"
      persistent
    >
      <q-spinner-pie size="6em" color="primary" />
    </q-dialog>
    <!-- <q-dialog :v-model="creatingPublicStory" persistent>
      <q-spinner-pie size="6em" color="primary" />
    </q-dialog> -->
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AddAudioSection from './__AddAudioSection.vue';
import AddCardSection from './__AddCardSection.vue';
import SaveStorySection from './__SaveStorySection.vue';
import CurrentStoryCardPreview from './__CurrentStoryCardPreview.vue';
import { useStoryStore } from '../../stores/story';
import { useAudioStore } from '../../stores/audio';
import { useRouter } from 'vue-router';
import { Card } from 'components/models';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const store = useStoryStore();
const audioStore = useAudioStore();
const addCardSectionElement = ref(null as any);
// const done3 = ref(false);
const creatingDraftStory = ref(false);
const creatingPublicStory = ref(false);
const step = ref(1);
const loadingStory = ref(true);
const cardsPreviewDialog = ref(false);

// const story = computed(() => store.currentStory);

onMounted(() => {
  // newStory.value.push(story);
  console.log('this is Create Story page');
  init();
});

const init = async () => {
  store.loadNewStory();
  loadingStory.value = false;
};

const editCard = (c: Card) => {
  addCardSectionElement.value?.editCard(c);
};

const publishAndUpdateStory = async () => {
  creatingPublicStory.value = true;
  if (store.story) {
    store.publishCurrentStory();
    await createNewStory();
  }
  creatingPublicStory.value = false;
};

const saveDraft = async () => {
  creatingDraftStory.value = true;
  await createNewStory();
  creatingDraftStory.value = false;
};

const createNewStory = async () => {
  if (store.story) {
    const res = await store.addNewStory();
    if (res && !res.error) {
      $q.notify({
        type: 'positive',
        message: 'Story created successfully.',
      });
      const nextRoute =
        store.story?.status === 'published' && store.story?.uuid
          ? { name: 'publicStory', params: { id: store.story?.uuid } }
          : { name: 'dashboard' };
      router.push(nextRoute);
    } else {
      const msg =
        res && res.message
          ? res.message
          : 'ops! Something went wrong while creating Story.';
      $q.notify({
        type: 'negative',
        message: msg,
      });
    }
  }
};

const confirmPublish = async () => {
  $q.dialog({
    title: 'Confirm',
    message:
      'Are you sure you want to continue? A published story can not be updated later.',
    cancel: true,
  })
    .onOk(async () => {
      // console.log('>>>> OK')
      await publishAndUpdateStory();
    })
    .onOk(() => {
      // console.log('>>>> second OK catcher')
    });
};
</script>

<style lang="scss"></style>
