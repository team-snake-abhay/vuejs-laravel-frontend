<template>
  <CardFormLayout title="Highlight Card" v-if="authStore.permission.cta">
    <template #form-area>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold"
          >Button Text <span class="text-negative">*</span></label
        >
        <q-input
          outlined
          placeholder="Button Text Here"
          v-model="text"
          :rules="[(v) => isValueProvided(v) || '* Field is required']"
        />
      </div>

      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold"
          >Link <span class="text-negative">*</span></label
        >
        <q-input
          dense
          outlined
          placeholder="http://"
          :rules="[(val) => isValidUrl(val) || 'Invalid Url']"
          v-model="link"
        >
        </q-input>
      </div>
    </template>

    <template #card-view-area>
      <CTAButton :text="text" :link="link"></CTAButton>
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
import CTAButton from '../story-card/CTAButton.vue';
import { Card } from '../models';
import { useStoryStore } from '../../stores/story';
import { isValidUrl, isValueProvided } from '../validators';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();

const text = ref('');
const link_ref = ref('');

const link = computed({
  get: () => {
    return link_ref.value;
  },
  set: (val) => {
    link_ref.value = val.replace('https://', '').replace('http://', '');
  },
});

const loadingSubmit = ref(false);

const store = useStoryStore();

// const step = ref(1);
const emit = defineEmits<{
  (e: 'finished'): void;
}>();

const isAllInputValid = computed(() => {
  return validateAllInput();
});

const validateAllInput = () =>
  isValueProvided(text.value) && isValidUrl(link.value);

const onSubmit = async () => {
  loadingSubmit.value = true;
  if (validateAllInput()) {
    const c: Card = {
      type: cardType,
      data: {
        text: text.value,
        link: link.value,
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
const cardType = 'cta';
onMounted(() => {
  isNew.value = !store.card;
  if (!isNew.value && store.card?.type === cardType) {
    text.value = store.card.data.text;
    link.value = store.card.data.link;
  }
});
</script>

<style lang="scss" scoped></style>
