<template>
  <q-input
    outlined
    dense
    placeholder="Search Photos"
    v-model="imageSearchedText"
    :debounce="600"
    @update:model-value="getUnsplashImagesByText(imageSearchedText)"
    :loading="loading"
  ></q-input>
  <div class="row q-mt-sm q-col-gutter-x-sm">
    <div class="col-6">
      <div class="row q-col-gutter-y-sm">
        <div
          v-for="(unsplashImg, index) in oddImages"
          :key="index"
          class="col-12"
        >
          <q-img
            class="rounded-borders"
            :src="unsplashImg?.urls?.regular || ''"
            @click="handleOnSelect(unsplashImg?.urls?.regular || '')"
          >
          </q-img>
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="row q-col-gutter-y-sm">
        <div
          v-for="(unsplashImg, index) in evenImages"
          :key="index"
          class="col-12"
        >
          <q-img
            class="rounded-borders"
            :src="unsplashImg?.urls?.regular || ''"
            @click="handleOnSelect(unsplashImg?.urls?.regular || '')"
          >
          </q-img>
        </div>
      </div>
    </div>

    <div class="col-12 q-gutter-sm q-py-md text-center">
      <q-btn
        color="primary"
        outline
        v-show="totalPages > 1"
        :loading="loadingPrevious"
        v-if="currentPage !== 1"
        label="Prev"
        @click="prevousPage"
        no-caps
      ></q-btn>
      <q-btn
        color="primary"
        outline
        v-show="totalPages > 1"
        :loading="loadingPrevious"
        :disable="currentPage >= totalPages"
        label="Load Next"
        @click="nextPage"
        no-caps
      ></q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useQuasar, LocalStorage } from 'quasar';

import { ref, defineEmits, onMounted, PropType } from 'vue';
import { ImgOrientation } from './models';
import { computed } from 'vue';

const props = defineProps({
  orientation: {
    type: String as PropType<ImgOrientation>,
    default: () => null,
  },
});
const emit = defineEmits(['onSelect']);
const imageSearchedText = ref('');
const loading = ref(false);

const images = ref([] as any[]);

const currentPage = ref(0);
const totalPages = ref(0);
const loadingNext = ref(false);
const loadingPrevious = ref(false);

const nextPage = async () => {
  loadingNext.value = true;
  if (currentPage.value < totalPages.value) {
    await getUnsplashImagesByText(
      imageSearchedText.value,
      currentPage.value + 1
    );
  }
  loadingNext.value = false;
};
const prevousPage = async () => {
  loadingPrevious.value = true;
  if (currentPage.value > 1) {
    await getUnsplashImagesByText(
      imageSearchedText.value,
      currentPage.value - 1
    );
  }
  loadingPrevious.value = false;
};

const getUnsplashImagesByText = async (val: string, p = 1) => {
  currentPage.value = p;
  // console.log('getUnsplashImagesByText > "' + val + '"');
  let extraOptions = 'page=' + p;
  extraOptions += props.orientation ? '&orientation=' + props.orientation : '';
  loading.value = true;
  let url = '';
  if (val !== '') {
    url =
      'https://api.unsplash.com/search/photos?' +
      extraOptions +
      '&per_page=10&client_id=J-I7215sRCEP4zj-lHRcvp5ASMWAx9LbkqItcsijo7g&query=' +
      val +
      '&q=50';
  } else {
    url =
      'https://api.unsplash.com/photos?page=' +
      extraOptions +
      '&q=50&per_page=10&client_id=J-I7215sRCEP4zj-lHRcvp5ASMWAx9LbkqItcsijo7g';
  }
  const res = await fetch(url);
  const data = await res.json();
  images.value = data?.results || [];
  totalPages.value = data?.total_pages || 0;
  loading.value = false;
};

const handleOnSelect = (v: string) => {
  emit('onSelect', v);
};

onMounted(() => {
  console.log('mounted');
  // TODO: open images on page load
  // getUnsplashImagesByText('');
});
const evenImages = computed(() => {
  return images.value.filter((item, index) => index % 2 == 0);
});
const oddImages = computed(() => {
  return images.value.filter((item, index) => index % 2 !== 0);
});
</script>

<style lang="scss" scoped></style>
