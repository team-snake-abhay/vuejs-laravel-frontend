<template>
  <div class="row q-col-gutter-lg">
    <div class="col">
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col"></div>
            <div class="col-auto lt-md">
              <q-btn
                outline
                color="primary"
                label="Preview"
                @click="$emit('preview')"
                no-caps
              ></q-btn>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div
            class="q-pa-md shadow-1 rounded-1"
            :class="{ 'max-content-height': $q.screen.gt.sm }"
            style=""
          >
            <!-- <div class="text-h3">Audio Transcript</div>
            <div class="subtitle text-ndark-2 q-mb-sm">
              *Select the word where you want to add story card
            </div> -->
            <div class="form-area">
              <StoryPublishForm></StoryPublishForm>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-auto gt-sm">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref, computed } from 'vue';
import { useStoryStore } from '../../stores/story';
// import QouteCard from '../';
import StoryPublishForm from '../../components/forms/PublishStoryForm.vue';
import { AudioTextRefPoint } from '../../components/models';
import type { Ref } from 'vue';
const $emit = defineEmits(['preview']);
</script>

<style lang="scss" scoped>
.textarea-box {
  border: 1px solid #dee2e6;
  width: 100%;
  min-height: 350px;
  font-size: 1.2rem;
}

.selectable-text {
  cursor: pointer;
}
.selectable-text:hover {
  background-color: $secondary-lite;
}
.selectable-text:active,
.selectable-text.active {
  background-color: $secondary;
}

.card-option-dialog {
  max-width: 620px;
}

.card-option-item-button .q-btn {
  color: $primary-dark;
  background: $secondary-lite-2;
  padding: 2rem;
  margin: 12px 16px;
}
.card-option-item-button .q-btn:hover {
  background: $secondary-lite;
}

.form-area {
  width: 350px;
  max-width: 100%;
  // max-height: calc(100vh - 296px);
  overflow-y: auto;
}
</style>
