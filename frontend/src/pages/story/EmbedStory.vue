<template>
  <q-page
    class="row items-center justify-evenly story-bg"
    :style="
      publicStore.story?.background_image
        ? 'background-image:url(' + publicStore.story?.background_image + ')'
        : 'background-image:none;'
    "
  >
    <StoryPlayer
      :interaction="!!route.query.interaction"
      :loading="storyLoading"
    ></StoryPlayer>
  </q-page>
</template>

<script setup lang="ts">
import StoryPlayer from 'src/components/StoryPlayer.vue';
import { usePublicStore } from '../../stores/public';

import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const publicStore = usePublicStore();
const route = useRoute();
const storyLoading = ref(false);

// cosnt story = computed(()=>{})

onMounted(async () => {
  console.log('onMounted StoryPage');
  storyLoading.value = true;
  const res = await publicStore.getStoryById(route.params.id as string);
  storyLoading.value = false;
  publicStore.confirmSecretCode();
  console.log('public on mounted', { res });
});
</script>
