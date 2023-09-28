<template>
  <CardFormLayout title="Definition Card">
    <template #form-area>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold"
          >Term <span class="text-negative">*</span></label
        >
        <q-input
          dense
          outlined
          v-model="term"
          placeholder="A word from Ancient Egypt"
          :rules="[(v) => isValueProvided(v) || '* Field is required']"
        />
      </div>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold"
          >Description <span class="text-negative">*</span></label
        >
        <q-input
          outlined
          type="textarea"
          placeholder="Pyramids are man-made mountain"
          v-model="definition"
          :rules="[(v) => isValueProvided(v) || '* Field is required']"
        />
      </div>
    </template>

    <template #card-view-area>
      <DefinitionCard :definition="definition" :term="term"></DefinitionCard>
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
import DefinitionCard from '../story-card/DefinitionCard.vue';
import { Card, Definition } from '../models';
import { useStoryStore } from '../../stores/story';
import { isValueProvided } from '../validators';

const definition = ref('');
const term = ref('');

const loadingSubmit = ref(false);

const store = useStoryStore();

// const step = ref(1);
const emit = defineEmits<{
  (e: 'finished'): void;
}>();

const isAllInputValid = computed(() => {
  return validateAllInput();
});

const validateAllInput = () => isValueProvided(definition.value);

const onSubmit = async () => {
  loadingSubmit.value = true;
  if (validateAllInput()) {
    const c: Card = {
      type: cardType,
      data: {
        definition: definition.value,
        term: term.value,
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
const cardType = 'definition';
onMounted(() => {
  console;
  isNew.value = !store.card;
  if (!isNew.value && store.card?.type === cardType) {
    definition.value = store.card.data.definition || '';
    term.value = store.card.data.term || '';
  }
});
</script>

<style lang="scss" scoped></style>
