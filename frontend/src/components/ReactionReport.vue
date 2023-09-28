<template>
  <q-dialog v-model="dialog" style="width: 500px; height: 350px">
    <q-card class="rounded-1">
      <div class="row q-pa-xl justify-between" style="width: 500px">
        <div class="col-12 q-mb-md">
          <div class="text-h3">Story Status</div>
          <span>Total views: {{ views }} View</span>
        </div>
        <div
          class="col-auto"
          v-for="k in Object.keys(reactions)as (Reaction[])"
          :key="k"
        >
          <div class="column">
            <div class="col-auto">
              <q-slider
                :model-value="reactionsPercent[k]"
                :min="0"
                :max="100"
                :label-value="reactions[k]"
                color="secondary"
                thumb-color="primary"
                label-color="grey"
                vertical
                reverse
                label-always
                readonly
              />
            </div>
            <div class="col-auto q-mt-md">{{ reactionIcons[k] }}</div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, PropType, computed } from 'vue';
type Reaction = 'like' | 'dislike' | 'heart' | 'satisfied' | 'sad' | 'angry';
const reactions = ref({
  like: 0,
  dislike: 0,
  heart: 0,
  satisfied: 0,
  sad: 0,
  angry: 0,
} as { [key in Reaction]: number });
const views = ref(0);
const dialog = ref(false);

const reactionIcons = {
  like: '👍',
  dislike: '👎',
  heart: '💖',
  satisfied: '😊',
  sad: '😟',
  angry: '😡',
} as any;

const reactionsPercent = computed(() => {
  return {
    like: reactions.value['like'] * point.value,
    dislike: reactions.value['dislike'] * point.value,
    heart: reactions.value['heart'] * point.value,
    satisfied: reactions.value['satisfied'] * point.value,
    sad: reactions.value['sad'] * point.value,
    angry: reactions.value['angry'] * point.value,
  } as { [key in Reaction]: number };
});

const point = computed(() => {
  const maxKey = (
    Object.keys(reactions.value) as (keyof typeof reactions.value)[]
  ).reduce((prev, current) =>
    reactions.value[prev] > reactions.value[current] ? prev : current
  ); //returns object
  console.log(maxKey);
  return 90 / reactions.value[maxKey];
  // return reactions.value[maxKey] > 90 ? 90 / reactions.value[maxKey] : 1;
});

const setData = (
  reactionsPayload: { [key in Reaction]: number },
  viewsPayload: number
) => {
  console.log({ reactions, views });
  reactions.value.like = reactionsPayload.like || 0;
  reactions.value.dislike = reactionsPayload.dislike || 0;
  reactions.value.heart = reactionsPayload.heart || 0;
  reactions.value.satisfied = reactionsPayload.satisfied || 0;
  reactions.value.sad = reactionsPayload.sad || 0;
  reactions.value.angry = reactionsPayload.angry || 0;
  views.value = viewsPayload || 0;
  dialog.value = true;
};

defineExpose({
  setData,
});
</script>
