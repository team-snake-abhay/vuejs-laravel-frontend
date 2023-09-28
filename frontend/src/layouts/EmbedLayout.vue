<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import TranscriptionProgressMessage from 'components/TranscriptionProgressMessage.vue';

import { useAuthStore } from 'src/stores/auth';
import { useAudioStore } from 'src/stores/audio';

const authStore = useAuthStore();
const audioStore = useAudioStore();
const router = useRouter();
const essentialLinks: EssentialLinkProps[] = [];
const leftDrawerOpen = ref(false);
const transDialog = ref(false);

const transcriptionDialog = computed(() => {
  return !!audioStore.transcribingAudio.length;
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onBeforeMount(() => {
  const routes = router.getRoutes();
  // console.log('routes', routes);
  routes.forEach((route, index) => {
    if (routes.length > index + 1) {
      // console.log({ route });
      essentialLinks.push({
        title: route.name as string,
        caption: route.path,
        icon: 'school',
        link: route.path,
        appLink: true,
      });
    }
  });
});
</script>
