<template>
  <q-card class="story-card quote-card">
    <q-card-section>
      <div>
        {{ props.quote }}
      </div>
      <div class="author">{{ props.author }}</div>
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
  quote: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: '',
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  console.log('onMounted QuoteCard');
});
</script>

<style lang="scss" scoped>
.author {
  text-align: right;
  font-style: italic;
  font-size: 0.8rem;
}

.action-items {
  display: none;
}
.quote-card:hover .action-items {
  display: block;
}
</style>
