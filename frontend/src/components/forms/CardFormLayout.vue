<template>
  <q-card class="rounded-borders add-card-form row card-form-layout">
    <q-card-section
      class="bg-primary text-center text-white relative-position col-12"
    >
      <div class="text-h6">
        {{ props.title }}
        <q-btn
          class="absolute-top-left rounded-borders q-ma-sm"
          dense
          flat
          color="white"
          icon="arrow_back_ios"
          @click="$emit('prev')"
        />

        <q-btn
          class="absolute-top-right rounded-borders q-ma-sm"
          dense
          flat
          color="white"
          icon="close"
          @click="$emit('finished')"
          v-close-popup
        />
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none text-ndark col-12 card-limited-max-height">
      <div class="row q-my-md" style="height: 100%">
        <div
          class="col-12 col-sm form-area q-pb-md q-px-md"
          style="overflow-y: auto; max-height: 100%"
        >
          <div class="column">
            <slot name="form-area"></slot>

            <div class="col"></div>

            <slot name="action"></slot>
          </div>
        </div>
        <div
          class="col-12 col-sm-auto"
          :class="{ 'q-mb-md': $q.screen.gt.sm }"
          style="overflow-x: auto"
        >
          <div class="story-card-preview-area rounded-borders q-pb-md">
            <slot name="card-view-area"></slot>
          </div>
        </div>
      </div>
    </q-card-section>

    <div class=""></div>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
