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
              <div class="step-text text-semi-bold">Create Content</div>
            </div>

            <div
              :class="{ active: step === 2 }"
              class="step-button text-center cursor-pointer q-mt-md q-mb-sm q-pt-sm"
              @click="step = 2"
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
                filled
                color="nwhite-2"
                text-color="ndark"
                size="32px"
                label="2"
                round
                dense
                class="q-mt-md q-mb-sm"
              />
              <div class="step-text text-semi-bold">Publish</div>
            </div>
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
                  <AddCardSection ref="addCardSectionElement">
                    <div class="gt-sm" style="min-width: 373px">
                      <CurrentStoryCardPreview
                        @edit-card="editCard"
                        :isLoading="loadingStory"
                      ></CurrentStoryCardPreview>
                    </div>
                  </AddCardSection>
                  <q-stepper-navigation class="row q-pt-md">
                    <div class="col-auto"></div>
                    <div class="col"></div>
                    <div class="col-auto">
                      <q-btn
                        class="q-ml-md"
                        color="primary"
                        label="Update"
                        no-caps
                        @click="handleUpdateStory()"
                        :loading="updatingStory"
                        outline
                      />
                      <q-btn
                        class="q-ml-md"
                        @click="
                          () => {
                            step = 2;
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

              <q-tab-panel :name="2" class="col-12" style="height: 100%">
                <div :class="$q.screen.gt.sm ? 'q-pa-md' : ''">
                  <SaveStorySection>
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
                        @click="step = 1"
                        color="primary"
                        label="Back"
                        class="q-ml-sm"
                        no-caps
                      />
                    </div>
                    <div class="col"></div>

                    <div class="col-auto">
                      <q-btn
                        v-if="store.story?.status !== 'published'"
                        class="q-ml-md"
                        :disable="!store.story?.title"
                        color="primary"
                        @click="handleUpdateStory()"
                        label="Save Draft"
                        no-caps
                        outline
                        :loading="updatingStory"
                      />
                      <q-btn
                        v-if="store.story?.status !== 'published'"
                        class="q-ml-md"
                        :disable="!store.story?.title"
                        color="primary"
                        @click="confirmPublish"
                        label="Publish"
                        no-caps
                        :loading="storySubmitting"
                      />
                      <q-btn
                        v-else
                        class="q-ml-md"
                        :disable="!store.story?.title"
                        color="primary"
                        @click="handleUpdateStory()"
                        label="Update"
                        no-caps
                        :loading="storySubmitting"
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
    <q-dialog v-model="updatingStory" persistent>
      <q-spinner-pie size="6em" color="primary" />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import AddCardSection from './__AddCardSection.vue';
import SaveStorySection from './__SaveStorySection.vue';
import CurrentStoryCardPreview from './__CurrentStoryCardPreview.vue';
import { useStoryStore } from '../../stores/story';
import { useRouter, useRoute } from 'vue-router';
import { Card } from 'components/models';
import { useQuasar } from 'quasar';
import { useAudioStore } from 'src/stores/audio';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const store = useStoryStore();
const audioStore = useAudioStore();
const addCardSectionElement = ref(null as any);
// const done3 = ref(false);
const storySubmitting = ref(false);
const step = ref(1);
const loadingStory = ref(true);
const updatingStory = ref(false);

const cards = computed(() => {
  return store.story?.cards || [];
});

// const story = computed(() => store.currentStory);

onMounted(async () => {
  init();
});

const init = async () => {
  if (route.params.id) {
    await store.selectStoryForUpdateByUID(route.params.id);
    if (store.story) {
      handlePublishedStory();
      if (store.story.audio_id) {
        await audioStore.selectAudioById(store.story.audio_id);
        if (!audioStore.audio) {
          actionStoryNotFound('This story audio not found.');
        }
      } else {
        actionStoryNotFound('This story is corrupted.');
      }
    } else {
      actionStoryNotFound();
    }
  } else {
    actionStoryNotFound();
  }
  loadingStory.value = false;
};
const actionStoryNotFound = (msg?: string) => {
  $q.notify({
    type: 'info',
    message: msg || 'Sorry! Story not found',
  });
  router.go(-1);
};

const publishAndUpdateStory = async () => {
  if (store.story) {
    store.publishCurrentStory();
    await updateStory();
  }
};

const updateStory = async () => {
  updatingStory.value = true;
  if (store.story) {
    const res = await store.updateStory(store.story);
    if (res) {
      $q.notify({
        type: 'positive',
        message: 'Story updated successfully.',
      });
      if (store.story?.status === 'published') {
        router.push({ name: 'viewStory', params: { id: store.story?.uuid } });
      }
    } else {
      $q.notify({
        type: 'negative',
        message: 'ops! Something went wrong while updating Story.',
      });
    }
  }
  updatingStory.value = false;
};

const editCard = (c: Card) => {
  addCardSectionElement.value?.editCard(c);
};

const handleUpdateStory = async () => {
  updatingStory.value = true;
  const res = await store.updateStory(store.story);
  if (res) {
    $q.notify({
      type: 'positive',
      message: 'Story updated successfully.',
    });
  } else {
    $q.notify({
      type: 'negative',
      message: 'ops! Something went wrong while updating Story.',
    });
  }
  updatingStory.value = false;
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

const handlePublishedStory = async () => {
  console.log('status ', store.story?.status);
  if (store.story && store.story.status === 'published') {
    router.push({ name: 'dashboard' });
    $q.notify({
      type: 'info',
      message: "Published story can't be updated.",
    });
  }
};
</script>
