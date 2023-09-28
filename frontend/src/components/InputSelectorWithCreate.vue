<template>
  <div v-if="modelValue" class="inputSelectedValueView row items-center">
    <div class="col">
      {{ modelValue }}
    </div>
    <div class="col-auto">
      <q-btn
        icon="close"
        flat
        dense
        round
        @click="handleModelValue(undefined)"
      ></q-btn>
    </div>
  </div>
  <div v-else>
    <q-input
      outlined
      dense
      placeholder="Chapter"
      v-model="searchedTextForChapter"
      @update:model-value="menu = true"
      :loading="loading"
      autocomplete="nope"
      name="chapter"
    >
    </q-input>
    <q-menu v-model="menu" no-focus fit>
      <q-list style="min-width: 100px">
        <q-item
          clickable
          v-for="opt in filteredOptions"
          :key="opt"
          @click="handleModelValue(opt)"
        >
          <q-item-section>{{ opt }}</q-item-section>
        </q-item>
        <q-separator />

        <q-item
          clickable
          v-if="
            searchedTextForChapter !== '' &&
            !options.includes(searchedTextForChapter)
          "
          :disable="loading"
        >
          <q-item-section @click="handleAddNew(searchedTextForChapter)">
            + Create {{ searchedTextForChapter }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType, defineEmits, computed } from 'vue';
const searchedTextForChapter = ref('');
const menu = ref(false);
const emit = defineEmits(['update:modelValue', 'addNew']);
const handleModelValue = (val: any) => {
  emit('update:modelValue', val);
};
const handleAddNew = (val: any) => {
  emit('addNew', val);
};
const props = defineProps({
  modelValue: {
    required: true,
  },
  options: {
    type: Array as PropType<string[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const filteredOptions = computed(() => {
  const needle = searchedTextForChapter.value.toLowerCase();
  return props.options.filter((v) => v && v.toLowerCase().indexOf(needle) > -1);
});
</script>

<style lang="scss" scoped>
.inputSelectedValueView {
  background: $nwhite;
  padding: 2px 8px;
  border-radius: 3px;
  min-height: 40px;
}
</style>

<!-- uses example -->
<!-- <div class="col-12 q-mb-md limited-max-width">
  <label class="text-bold">Add or choose chapter </label>
  <InputSelectorWithCreate
    v-model="store.story.chapter_name"
    :options="chapterStore.chapterList"
    @add-new="addNewChapter"
    :loading="chapterCreating"
  ></InputSelectorWithCreate>
</div> -->
