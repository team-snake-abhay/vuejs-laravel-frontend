<template>
  <q-card
    class="story-card thumbnail-card"
    :style="thumbnail ? `background-image: url(` + thumbnail + `)` : ''"
  >
    <q-card-section class="title absolute-top q-pa-lg">
      <div class="text-h3 q-pt-md q-pb-xl">{{ title }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps({
  title: {
    required: true,
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
});

onMounted(() => {
  console.log('onMounted ThumbnailCard');
});
</script>

<style lang="scss" scoped>
.action-items {
  display: none;
}
.highlight-card:hover .action-items {
  display: none;
}

.thumbnail-card {
  height: 440px;
  padding: 24px;
  color: white;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('/default-thumbnail.jpeg');
  box-shadow: 0px 340px 200px -100px #000000a1 inset;
}
</style>
