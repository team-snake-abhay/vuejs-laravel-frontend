<template>
  <q-page class="">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="text-h1 q-mt-lg">My Stories</div>
        </div>
        <div class="col-12 outline-border rounded-1 q-pa-md q-mt-md q-mb-xl">
          <div class="row items-center">
            <div
              class="col-auto q-pr-md text-ndark-2 text-weight-medium"
              v-if="authStore.permission.chapter"
            >
              Filter by
            </div>
            <q-select
              v-if="authStore.permission.chapter"
              class="text-ndark-2"
              v-model="storyStore.dashboardSelectedChapter"
              dense
              outlined
              :options="chapterOptions"
              :option-label="(i) => i.name"
              :option-value="(i) => i.id"
              :use-input="!storyStore.dashboardSelectedChapter"
              placeholder="Chapter"
              clearable
              @filter="filterFn"
            />
            <div class="col-auto q-px-md">
              {{ authStore.storyCount.monthly || '0' }}/{{
                authStore.permission.monthlyStoryLimit
              }}
              stories per month
            </div>
            <div class="col"></div>
            <q-btn
              color="primary"
              label="Create New Story"
              :to="{ name: 'newStory' }"
              no-caps
            ></q-btn>
          </div>
        </div>
        <div class="col-12">
          <div v-if="storiesAreLoading">
            <!-- loading -->
            <q-spinner></q-spinner>
          </div>
          <div
            v-else-if="!storyStore.storiesFilteredByChapter.length"
            class="row q-col-gutter-lg justify-center items-center q-my-xl"
          >
            <div class="text-center">
              <q-img src="no_data.svg" width="200px" /><br />
              <div class="q-my-md text-bold text-ndark-2">No Story Found</div>
            </div>
          </div>
          <div v-else class="row q-col-gutter-lg">
            <div
              class="col-12 col-sm-6 col-md-4"
              v-for="story in storyStore.storiesFilteredByChapter"
              :key="story.id"
            >
              <StoryCard
                :story="story"
                @show-reaction-report="openReactionReport(story)"
              >
                <template #index> {{ story.id }} </template>
              </StoryCard>
            </div>
          </div>
        </div>
      </div>

      <ReactionReport ref="reactionReportElement"></ReactionReport>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// import { Todo, Meta } from 'components/models';
// import { ref } from 'vue';

import { onBeforeMount, ref } from 'vue';
import StoryCard from './DashboardStoryCard.vue';
import { useStoryStore } from 'src/stores/story';
import { useChapterStore } from 'src/stores/chapter';
import { useAuthStore } from 'src/stores/auth';
import ReactionReport from 'components/ReactionReport.vue';
import { Chapter, Story } from 'src/components/models';

const storyStore = useStoryStore();
const chpaterStore = useChapterStore();
const authStore = useAuthStore();
const storiesAreLoading = ref(true);
const chapterOptions = ref([] as Chapter[]);
const reactionReportElement = ref(null as any);

const loadStories = async () => {
  storiesAreLoading.value = true;
  const res = await storyStore.getStories();
  authStore.syncUserFromDB();
  console.log('res in load story ', res);
  storiesAreLoading.value = false;
};

onBeforeMount(() => {
  loadStories();
  console.log('onMounted Dashboard');
});

const openReactionReport = (story: Story) => {
  console.log('openReactionReport');
  // reactionReportElement.value.setData();
  reactionReportElement.value.setData(
    {
      like: story.like,
      dislike: story.dislike,
      heart: story.heart,
      satisfied: story.satisfied,
      sad: story.sad,
      angry: story.angry,
    },
    story.total_view
  );
};

const filterFn = (val: string, update: any) => {
  if (val === '') {
    update(() => {
      chapterOptions.value = chpaterStore.chapters;

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    chapterOptions.value = chpaterStore.chapters.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>

<style scoped lang="scss">
.add-new-card {
  width: 250px;
}
.add-new-card .body {
  height: 367px;
}
</style>
