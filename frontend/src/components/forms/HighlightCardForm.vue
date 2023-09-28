<template>
  <CardFormLayout title="Highlight Card">
    <template #form-area>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold"
          >Text <span class="text-negative">*</span></label
        >
        <q-input
          outlined
          type="textarea"
          placeholder="Your Text Here"
          v-model="text"
          :rules="[(v) => isValueProvided(v) || '* Field is required']"
        />
      </div>
    </template>

    <template #card-view-area>
      <HighlightCard :text="text"></HighlightCard>
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
import HighlightCard from '../story-card/HighlightCard.vue';
import { Card } from '../models';
import { useStoryStore } from '../../stores/story';
import { isValueProvided } from '../validators';

const text = ref('');

const loadingSubmit = ref(false);

const store = useStoryStore();

// const step = ref(1);
const emit = defineEmits<{
  (e: 'finished'): void;
}>();

const isAllInputValid = computed(() => {
  return validateAllInput();
});

const validateAllInput = () => isValueProvided(text.value);

const onSubmit = async () => {
  loadingSubmit.value = true;
  if (validateAllInput()) {
    const c: Card = {
      type: cardType,
      data: {
        text: text.value,
      },
      word: store.word,
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
const cardType = 'highlight';
onMounted(() => {
  isNew.value = !store.card;
  if (!isNew.value && store.card?.type === cardType) {
    text.value = store.card.data.text;
  }
});
</script>

<style lang="scss" scoped></style>
