<template>
  <q-card
    class="story-card url-card"
    :style="urlObj.image && urlObj.image !== '' ? 'margin-top: 100px' : ''"
  >
    <q-img
      class="urlcard-image rounded-border"
      v-if="urlObj.image && urlObj.image !== ''"
      :src="urlObj.image"
    ></q-img>
    <q-card-section class="q-py-xs">
      <div class="title text-black">
        {{ getTitle }}
      </div>
      <div class="card-body q-py-sm text-small-2">
        <span
          v-if="!!urlObj.source"
          class="bg-nwhite q-px-sm q-py-xs rounded-borders"
          >{{ urlObj.source }}</span
        >
      </div>
      <a :href="getUrl" class="text-primary text-small" target="_blank">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-link q-mr-sm"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          stroke-width="2"
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
        <span>View Link</span>
      </a>
      <!-- <div class="author">{{ props.author }}</div> -->
    </q-card-section>
    <div v-if="editable" class="action-items absolute-top-right">
      <q-btn
        flat
        round
        dense
        icon="o_delete"
        color="negative"
        @click="$emit('delete')"
      ></q-btn>
      <q-btn
        flat
        round
        dense
        icon="o_edit"
        color="primary"
        @click="$emit('edit')"
      ></q-btn>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, PropType, computed } from 'vue';
import { Url } from '../models';

const props = defineProps({
  urlObj: {
    type: Object as PropType<Url>,
    default: {
      url: '',
      title: 'Awesome Title',
      source: '',
      image: '',
    } as Url,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const getTitle = computed(() => {
  return props.urlObj.title !== '' ? props.urlObj.title : 'Awesome Title';
});
const getUrl = computed(() => {
  return props.urlObj.url !== '' ? 'https://' + props.urlObj.url : '#';
});

onMounted(() => {
  console.log('onMounted UrlCard');
});
</script>

<style lang="scss" scoped>
.author {
  text-align: right;
  font-style: italic;
  font-size: 0.8rem;
}
</style>
