<template>
  <q-card class="story-card definition-card bg-ndark-3">
    <q-card-section>
      <div class="term">{{ props.term }}</div>
      <div class="text-white q-pl-sm">
        {{ props.definition }}
      </div>
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
  definition: {
    type: String,
    default: '',
  },
  term: {
    type: String,
    default: '',
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  console.log('onMounted Definition Card');
});
</script>

<style lang="scss" scoped>
.term {
  color: white;
  font-weight: bold;
  padding: 5px 0;
  font-size: 1.3rem;
}
</style>
