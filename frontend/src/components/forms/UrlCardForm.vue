<template>
  <CardFormLayout title="Url Card">
    <template #form-area>
      <div class="col-auto limited-max-width">
        <label class="text-bold"
          >URL <span class="text-negative">*</span></label
        >
        <q-input
          outlined
          placeholder="xyz.com"
          v-model="url"
          :rules="[(val) => isValidUrl(val) || 'Invalid Url']"
          prefix="https:\\"
          dense
        >
        </q-input>
      </div>
      <div class="col-auto limited-max-width">
        <label class="text-bold"
          >Title <span class="text-negative">*</span></label
        >
        <q-input
          dense
          outlined
          placeholder="Awesome Title"
          v-model="title"
          :rules="[(val) => !!val || 'Field is required']"
        />
      </div>

      <div class="col-auto q-mb-lg limited-max-width">
        <label class="text-bold">Body</label>
        <q-input dense outlined v-model="source" placeholder="Body goes here" />
      </div>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">Image (optional)</label>

        <UnsplashImageSelector
          @on-select="(v:string) => (image = v)"
        ></UnsplashImageSelector>
        <label class="text-bold q-pl-xs text-ndark-3">or upload</label>
        <SingleImageFileUploader
          v-model="image"
          class="q-mt-xs limited-max-width"
        ></SingleImageFileUploader>
      </div>
    </template>

    <template #card-view-area>
      <UrlCard :url-obj="urlObj"></UrlCard>
    </template>
    <template #action>
      <q-btn
        :label="isNew ? 'Submit' : 'Update'"
        :class="isNew ? 'bg-primary text-white' : 'bg-warning text-black'"
        style="width: 100%"
        no-caps
        @click="onSubmit"
        :loading="loadingSubmit"
        :disable="!isAllInputValid"
      ></q-btn>
    </template>
  </CardFormLayout>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed, onMounted } from 'vue';
import CardFormLayout from './CardFormLayout.vue';
import UrlCard from '../story-card/UrlCard.vue';
import { Card, Url } from '../models';
import { useStoryStore } from '../../stores/story';
import { isValidUrl, isValueProvided } from '../validators';
import SingleImageFileUploader from '../SingleImageFileUploader.vue';
import UnsplashImageSelector from '../UnsplashImageSelector.vue';

const url = ref('');

const title = ref('');
const source = ref('');
const image = ref('');
const loadingSubmit = ref(false);

const store = useStoryStore();

const urlObj = computed(() => {
  let u: Url = {
    url: url.value
      .replace('https:\\', '')
      .replace('https://', '')
      .replace('http:\\', '')
      .replace('http://', ''),
    title: title.value,
    source: source.value,
    image: image.value,
  };
  return u;
});

// const step = ref(1);
const emit = defineEmits<{
  (e: 'finished'): void;
}>();

const isAllInputValid = computed(() => {
  return validateAllInput();
});

const validateAllInput = () =>
  isValidUrl(url.value) && isValueProvided(title.value);

const onSubmit = async () => {
  loadingSubmit.value = true;
  if (validateAllInput()) {
    const c: Card = {
      type: cardType,
      data: urlObj,
      word: store.$state.word,
    };
    // if update remove previuosone
    store.removeCardFromCurrentStoryByTimestamp(store.word.start);
    await store.addCardToAStory(c);
    emit('finished');
  } else {
    console.log('not validated');
  }
  loadingSubmit.value = false;
};

const isNew = ref(true);
const cardType = 'url';
onMounted(() => {
  isNew.value = !store.card;
  if (!isNew.value && store.card?.type === cardType) {
    url.value = store.card.data.url;
    title.value = store.card.data.title || '';
    source.value = store.card.data.source || '';
    image.value = store.card.data.image || '';
  }
});
</script>

<style lang="scss" scoped>
.file-upload-area {
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
  padding: 16px;
  user-select: none;
  transition: background-color 150ms ease 0s;
  position: relative;
  cursor: pointer;
}
</style>
