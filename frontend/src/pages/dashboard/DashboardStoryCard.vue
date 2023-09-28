<template>
  <q-card class="story-card" v-if="story">
    <router-link :to="{ name: 'viewStory', params: { id: story?.uuid } }">
      <q-img
        v-if="thumbnailSrc"
        class="thumbnail-with-title"
        :src="thumbnailSrc"
        :ratio="6 / 4"
      >
        <div class="card-overlay"></div>
        <div class="absolute-bottom text-h6">{{ story?.title }}</div>
      </q-img>
      <div v-else styl="display:none;">
        img missing thumbnailSrc > {{ thumbnailSrc }}
      </div>
    </router-link>

    <q-card-section>
      <div class="row q-mb-md">
        <div v-if="isPublished" class="col-auto">
          <q-chip
            color="primary-lite"
            text-color="primary"
            label="Published"
            class="q-ml-none text-semi-bold"
          ></q-chip>
          <q-chip color="grey-3">
            <q-icon name="visibility" size="1.4rem" color="grey-5"></q-icon>
            <span class="text-black text-semi-bold q-mx-sm">
              {{ story.total_view }}
            </span>
          </q-chip>
        </div>
        <div class="col-auto" v-else>
          <q-chip
            color="warning-lite"
            text-color="warning-dark"
            label="Draft"
            class="q-ml-none text-semi-bold"
          ></q-chip>
        </div>
        <div class="col"></div>

        <div class="col-auto">
          <q-btn round size="md" dense flat color="ndark" icon="more_vert">
            <q-menu ref="cardMenuRef" anchor="bottom right" self="top right">
              <q-list style="min-width: 203px">
                <!-- analytics -->
                <q-item
                  v-if="isPublished"
                  clickable
                  v-close-popup
                  @click="$emit('showReactionReport')"
                >
                  <q-item-section class="col-auto">
                    <q-icon name="show_chart"></q-icon>
                  </q-item-section>
                  <q-item-section>Analytics</q-item-section>
                </q-item>

                <!-- edit -->
                <q-item
                  v-if="!isPublished"
                  clickable
                  v-close-popup
                  :to="{ name: 'updateStory', params: { id: story?.uuid } }"
                >
                  <q-item-section class="col-auto">
                    <q-icon name="o_edit"></q-icon>
                  </q-item-section>
                  <q-item-section>Edit</q-item-section>
                </q-item>

                <!-- publish -->
                <q-item v-if="!isPublished" clickable @click="confirmPublish">
                  <q-item-section class="col-auto">
                    <q-icon name="publish"></q-icon>
                  </q-item-section>
                  <q-item-section>Publish</q-item-section>
                  <q-item-section side v-show="publishingStory"
                    ><q-spinner></q-spinner
                  ></q-item-section>
                </q-item>

                <!-- Change Background -->
                <q-item clickable>
                  <q-item-section class="col-auto">
                    <q-icon name="o_image"></q-icon>
                  </q-item-section>
                  <q-item-section>Change Background</q-item-section>
                  <q-item-section class="col-auto">
                    <q-spinner v-if="changingBackground" />
                  </q-item-section>
                  <q-menu
                    ref="changeBgMenuRef"
                    anchor="top right"
                    self="top left"
                    class="q-pa-xs"
                  >
                    <div class="row" style="width: 220px">
                      <div
                        class="col-6"
                        v-for="(item, k) in storyStore.backgroundImageList"
                        :key="k"
                      >
                        <q-item
                          clickable
                          class="q-pa-xs cng-bg-item"
                          @click="changeBackground(item.xl)"
                          :class="{
                            checked: story.background_image === item.xl,
                          }"
                        >
                          <q-img
                            :src="item.thumbnail"
                            position="center"
                            style="height: 60px; max-width: 190px"
                          />
                          <q-icon
                            class="absolute-center"
                            v-if="story.background_image === item.xl"
                            name="o_check_circle"
                            size="32px"
                          />
                        </q-item>
                      </div>
                    </div>
                  </q-menu>
                </q-item>

                <!-- shareable url -->
                <q-item
                  v-if="isPublished && story?.uuid"
                  clickable
                  v-close-popup
                  @click="copyUrl()"
                >
                  <q-item-section class="col-auto">
                    <q-icon name="link"></q-icon>
                  </q-item-section>
                  <q-item-section>Get Share URL</q-item-section>
                </q-item>

                <q-item
                  v-if="isPublished && story?.uuid"
                  clickable
                  v-close-popup
                  @click="copyUrl(true)"
                >
                  <q-item-section class="col-auto">
                    <q-icon name="link"></q-icon>
                  </q-item-section>
                  <q-item-section>Get Share URL with Reaction</q-item-section>
                </q-item>

                <!-- facebook share -->
                <q-item
                  v-if="isPublished && story?.uuid"
                  clickable
                  v-close-popup
                  target="_blank"
                  :href="'https://www.facebook.com/sharer.php?u=' + storyUrl"
                >
                  <q-item-section class="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-facebook"
                    >
                      <path
                        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                      ></path>
                    </svg>
                  </q-item-section>
                  <q-item-section>Share it on Facebook</q-item-section>
                </q-item>

                <!-- embed -->
                <q-item
                  v-if="isPublished"
                  clickable
                  v-close-popup
                  :disable="!authStore.permission.embPlayer"
                  @click="story?.uuid ? copyEmbedUrl(story.uuid) : ''"
                >
                  <q-tooltip
                    v-if="!authStore.permission.embPlayer"
                    anchor="center middle"
                    self="center middle"
                    :offset="[10, 10]"
                  >
                    <strong>Need upgraded package </strong>
                  </q-tooltip>
                  <q-item-section class="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-code"
                    >
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </q-item-section>
                  <q-item-section>Get Embeddable link</q-item-section>
                </q-item>

                <!-- delete -->
                <q-item
                  clickable
                  v-close-popup
                  class="text-negative"
                  @click="confirmDelete(story?.id)"
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
      </div>
      <div class="row">
        <div class="col text-ndark">
          <q-icon class="q-mr-xs text-primary" name="watch_later" />
          <span>{{
            story ? date.formatDate(story.created_at, 'ddd h:mm a') : '--'
          }}</span>
        </div>
        <div class="col-auto text-ndark">
          <q-icon class="q-mr-xs text-primary" name="calendar_month" />
          <span>{{
            story ? date.formatDate(story.created_at, 'MMM DD  YYYY') : '--'
          }}</span>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-dialog v-model="loadingDelete" persistent>
    <q-spinner-pie size="6em" color="primary" />
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref, computed } from 'vue';
import { date, useQuasar } from 'quasar';
import { Story } from '../../components/models';
import { useStoryStore } from '../../stores/story';
import { useAuthStore } from 'src/stores/auth';

const authStore = useAuthStore();
const $q = useQuasar();
const storyStore = useStoryStore();
const props = defineProps({
  story: {
    require: true,
    type: Object as PropType<Story>,
  },
});

const $emits = defineEmits(['showReactionReport']);

const changingBackground = ref(false);

const changeBgMenuRef = ref(null as any);
const cardMenuRef = ref(null as any);
const loadingDelete = ref(false);
const isPublished = computed(() => {
  return props.story?.status === 'published';
});
const publishingStory = ref(false);
const thumbnailSrc = computed(() => {
  if (props.story?.thumbnail) {
    return props.story.thumbnail;
  } else {
    return 'default-thumbnail.jpeg';
    // '/def-thum-' +
    // (props.story && props.story !== undefined && props.story.id !== undefined
    //   ? props.story.id % 5
    //   : 1) +
    // '.svg'
  }
});

const storyUrl = ref('');

const copyUrl = (reaction = false) => {
  const link = storyUrl.value + (reaction ? '/?interaction=true' : '');
  navigator.clipboard.writeText(link);
  $q.notify({
    type: 'info',
    message: ' Story Link copied',
  });
};

const copyEmbedUrl = (uuid: string) => {
  const embed =
    '<iframe width="373" height="624" src="' +
    storyUrl.value +
    '" title="Storify Story" frameborder="0" style="border-radius: 4px;"></iframe>';

  navigator.clipboard.writeText(embed);
  $q.notify({
    type: 'info',
    message: ' Story Embed Code copied',
  });
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
      await publishStory();
    })
    .onOk(() => {
      // console.log('>>>> second OK catcher')
    });
};

const publishStory = async () => {
  console.log('publishStory');
  publishingStory.value = true;

  if (props.story?.id) {
    const changes = Object.assign(props.story, { status: 'published' });

    const res = await storyStore.updateStory(changes);
    if (res) {
      storyStore.getStories();
      $q.notify({
        type: 'positive',
        message: 'Story published successfully.',
      });
    } else {
      storyStore.getStories();
      $q.notify({
        type: 'negative',
        message: 'ops! Something went wrong while updating Story.',
      });
    }
  }
  publishingStory.value = false;
};

const changeBackground = async (url: string) => {
  changingBackground.value = true;
  changeBgMenuRef.value.hide();
  if (props.story?.id) {
    const res = await storyStore.changeBg(props.story.id, url);
    if (res) {
      $q.notify({
        type: 'positive',
        message: 'Story background changed .',
      });
    } else {
      $q.notify({
        type: 'negative',
        message: "Couldn't change background .",
      });
    }
  }
  changingBackground.value = false;
  cardMenuRef.value.hide();
};

const confirmDelete = async (id: any) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to delete the story?',
    cancel: true,
    persistent: true,
    progress: loadingDelete.value,
  })
    .onOk(async () => {
      // console.log('>>>> OK')
      await deleteStory(id);
    })
    .onOk(() => {
      // console.log('>>>> second OK catcher')
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

const deleteStory = async (id: any) => {
  if (Number.isInteger(id)) {
    loadingDelete.value = true;
    await storyStore.delete(id);
    loadingDelete.value = false;
  } else {
    $q.notify('something went wrong');
  }
};

onMounted(() => {
  console.log('onMounted home page');
  storyUrl.value = props.story?.uuid
    ? window.location.origin + '/story/' + props.story.uuid
    : '';
});
</script>

<style lang="scss" scoped>
.story-card {
  width: 100%;
  max-width: 425px;
}
.q-img__content > div {
  background: transparent;
}
.q-img__content > div.card-overlay {
  width: 100%;
  height: 100%;
  background: linear-gradient(2deg, #000000b8, transparent);
}
</style>
