<template>
  <CardFormLayout title="Image Card">
    <template #form-area>
      <div class="col-auto q-mb-md limited-max-width" v-if="store.story">
        <label class="text-bold">Image</label>
        <UnsplashImageSelector
          @on-select="(v:string) => (image = v)"
        ></UnsplashImageSelector>
        <div class="col-12 q-mb-md limited-max-width">
          <label class="text-bold q-pl-xs text-ndark-3">or upload </label>
          <SingleImageFileUploader
            v-model="image"
            class="q-mt-xs limited-max-width"
          ></SingleImageFileUploader>
        </div>
      </div>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">Caption (Optional)</label>
        <q-input dense outlined v-model="caption" placeholder="Image" />
      </div>
    </template>

    <template #card-view-area>
      <ImageCard :image-obj="imageObj"></ImageCard>
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
import ImageCard from '../story-card/ImageCard.vue';
import { Card, Image } from '../models';
import { useStoryStore } from '../../stores/story';
import SingleImageFileUploader from '../SingleImageFileUploader.vue';
import UnsplashImageSelector from '../UnsplashImageSelector.vue';
import { isValueProvided } from '../validators';

const caption = ref('');
const image = ref('');
const loadingSubmit = ref(false);

const store = useStoryStore();

const imageObj = computed(() => {
  let u: Image = {
    caption: caption.value,
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
const validateAllInput = () => isValueProvided(image.value);

const onSubmit = async () => {
  loadingSubmit.value = true;
  const c: Card = {
    type: cardType,
    data: imageObj,
    word: store.word,
  };
  // if update remove previuosone
  store.removeCardFromCurrentStoryByTimestamp(store.word.start);
  await store.addCardToAStory(c);
  emit('finished');

  loadingSubmit.value = false;
};

const isNew = ref(true);
const cardType = 'image';
onMounted(() => {
  isNew.value = !store.card;
  if (!isNew.value && store.card?.type === cardType) {
    caption.value = store.card.data.caption || '';
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
