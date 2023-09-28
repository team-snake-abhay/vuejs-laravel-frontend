<template>
  <q-card class="story-card image-card rounded-border">
    <q-img
      loading="eager"
      class="imagecard-image"
      v-if="imageObj.image && imageObj.image !== ''"
      :src="imageObj.image"
    >
      <div v-if="getCaption" class="absolute-bottom text-subtitle1 text-center">
        {{ getCaption }}
      </div>
    </q-img>
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
import { onMounted, PropType, computed } from 'vue';
import { Image } from '../models';

const props = defineProps({
  imageObj: {
    type: Object as PropType<Image>,
    default: {
      caption: '',
      image: '',
    } as Image,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const getCaption = computed(() => {
  return props.imageObj.caption !== '' ? props.imageObj.caption : null;
});

onMounted(() => {
  console.log('onMounted ImageCard');
});
</script>

<style lang="scss" scoped></style>
