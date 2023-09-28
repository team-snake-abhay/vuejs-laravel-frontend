<template>
  <CardFormLayout title="List Card">
    <template #form-area>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">Title (optional)</label>
        <q-input dense outlined placeholder="Sample Title" v-model="title" />
      </div>
      <div class="col-auto q-mb-md limited-max-width">
        <q-btn-toggle
          v-model="listType"
          no-caps
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="[
            { label: 'List', value: 'list' },
            { label: 'Bullet', value: 'bullet' },
          ]"
        />
      </div>
      <div class="col-12">
        <span class="text-small text-ndark-2">*Max 10 items</span>
      </div>
      <div
        v-for="(i, index) in noOfInputsToShow"
        :key="index"
        class="col-12 q-mb-md"
      >
        <q-input
          :class="{ 'bg-nwhite': list[index] === '' }"
          dense
          outlined
          :placeholder="'-- empty item --'"
          v-model="list[index]"
        />
      </div>
      <!-- <div class="col-auto q-mb-md limited-max-width">
        <q-input
          dense
          outlined
          :placeholder="'List Item #' + (list.length + 1)"
          @keyup.enter="addToList"
          v-model="item1"
        />
      </div> -->
    </template>

    <template #card-view-area>
      <ListCard :list-obj="listObj"></ListCard>
    </template>
    <template #action>
      <q-btn
        :label="isNew ? 'Submit' : 'Update'"
        :class="isNew ? 'bg-primary text-white' : 'bg-warning text-black'"
        style="width: 100%"
        no-caps
        @click="onSubmit"
        :loading="loadingSubmit"
      ></q-btn>
    </template>
  </CardFormLayout>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted, computed } from 'vue';
import CardFormLayout from './CardFormLayout.vue';
import ListCard from '../story-card/ListCard.vue';
import { Card, List } from '../models';
import { useStoryStore } from '../../stores/story';

const listType = ref('list');
const title = ref('');
const item1 = ref('');

const listObj = computed<List>(() => {
  let l: List = {
    title: title.value,
    listType: listType.value,
    list: list.value.filter((i: any) => i !== ''),
  };
  return l;
});

const noOfInputsToShow = computed(() => {
  return Math.min(10, Math.max(3, listObj.value.list.length + 3));
});

const addToList = () => {
  list.value.push(item1.value);
  item1.value = '';
};

const loadingSubmit = ref(false);

const store = useStoryStore();

// const step = ref(1);
const emit = defineEmits<{
  (e: 'finished'): void;
}>();

const list = ref(['', '', '', '', '', '', '', '', '', ''] as any);
const onSubmit = async () => {
  loadingSubmit.value = true;

  const c: Card = {
    type: cardType,
    data: listObj.value,
    word: store.word,
  };
  // if update remove previuosone
  store.removeCardFromCurrentStoryByTimestamp(store.word.start);
  await store.addCardToAStory(c);
  emit('finished');

  loadingSubmit.value = false;
};

const isNew = ref(true);
const cardType = 'list';
onMounted(() => {
  isNew.value = !store.card;
  if (!isNew.value && store.card?.type === cardType) {
    listType.value = store.card.data.listType;
    title.value = store.card.data.title;
    console.log('loading previous list items');
    console.log({ list });
    console.log({ 'list from store': store.card.data.list });
    store.card.data.list.forEach((i: string, index: number) => {
      console.log('adding to local list');
      list.value[index] = i;
    });
    console.log({ list });
  }
});
</script>

<style lang="scss" scoped></style>
