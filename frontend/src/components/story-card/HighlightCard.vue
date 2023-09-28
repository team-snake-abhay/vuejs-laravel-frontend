<template>
  <q-card class="story-card highlight-card">
    <q-card-section>
      <div class="">
        <span class="text-highlited">{{ props.text }}</span>
      </div>
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
import { onMounted } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  console.log('onMounted HighlightCard');
});
</script>

<style lang="scss" scoped></style>
