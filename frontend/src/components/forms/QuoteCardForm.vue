<template>
  <CardFormLayout title="Quote Card">
    <template #form-area>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold"
          >Your Quote <span class="text-negative">*</span></label
        >
        <q-input
          outlined
          type="textarea"
          placeholder="Awesome label"
          v-model="quoteText"
          :rules="[(v) => isValueProvided(v) || '* Field is required']"
        />
      </div>

      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">Author (Optional) </label>
        <q-input
          dense
          outlined
          v-model="quoteAuthor"
          placeholder="Jane Spoonfighter"
        /></div
    ></template>

    <template #card-view-area>
      <QuoteCard :quote="quoteText" :author="quoteAuthor"></QuoteCard>
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
import { ref, defineEmits, computed, onMounted, watch, onUpdated } from 'vue';
import CardFormLayout from './CardFormLayout.vue';
import QuoteCard from '../story-card/QuoteCard.vue';
import { Card, Quote } from '../models';
import { useStoryStore } from '../../stores/story';
import { isValueProvided } from '../validators';

const quoteText = ref('');
const quoteAuthor = ref('');
const loadingSubmit = ref(false);
const store = useStoryStore();

// const step = ref(1);
const emit = defineEmits<{
  (e: 'finished'): void;
}>();

const isAllInputValid = computed(() => {
  return validateAllInput();
});

const validateAllInput = () => isValueProvided(quoteText.value);

const onSubmit = async () => {
  loadingSubmit.value = true;
  if (validateAllInput()) {
    const c: Card = {
      type: cardType,
      data: {
        quote: quoteText.value,
        author: quoteAuthor.value,
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
const cardType = 'quote';
onMounted(() => {
  isNew.value = !store.card;
  if (!isNew.value && store.card?.type === cardType) {
    quoteText.value = store.card.data.quote;
    quoteAuthor.value = store.card.data.author;
  }
});
</script>

<style lang="scss" scoped></style>
