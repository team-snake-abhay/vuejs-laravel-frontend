<template>
  <q-card class="story-card list-card">
    <q-card-section>
      <div></div>
      <div class="title text-bold">{{ props.listObj.title }}</div>
      <div>
        <ol
          v-if="props.listObj.list"
          :class="props.listObj.listType !== 'list' ? 'bullet-list' : ''"
        >
          <li v-for="(i, index) in props.listObj.list" :key="index">{{ i }}</li>
        </ol>

        <div
          v-if="!props.listObj.list || !props.listObj.list.length"
          class="text-ndark-2 q-pl-md"
        >
          -- empty list --
        </div>
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
import { onMounted, PropType } from 'vue';
import { List } from '../models';

const props = defineProps({
  listObj: {
    required: false,
    type: Object as PropType<List>,
    default: () => {
      return {
        title: '',
        listType: '',
        list: [],
      };
    },
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  console.log('onMounted ListCard');
});
</script>

<style lang="scss" scoped>
.bullet-list {
  list-style: disc;
}
</style>
