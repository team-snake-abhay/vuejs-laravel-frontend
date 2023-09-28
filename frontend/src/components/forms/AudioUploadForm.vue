<template>
  <div
    class="row justify-center audio-upload-form"
    :class="{ dense: $q.screen.lt.md }"
  >
    <div class="col-12 q-mb-sm">
      <label class="text-bold"
        >Title <span class="text-negative">*</span></label
      >
      <q-input
        outlined
        placeholder="Awesome recording"
        v-model="title"
        :rules="[
          (val) => isValueProvided(val) || 'Filed is required *',
          (val) => val.length > 2 || 'Minimum 2 charecter *',
        ]"
        dense
      >
      </q-input>
    </div>
    <div class="col-12 q-mb-md">
      <AudioFileUploader_2
        ref="audioFileUploaderElement"
        @uploaded="uploadFinish"
        style="margin: 0 auto"
        :fields="fieldsForFileUploder"
        @added="filesAdded++"
        @removed="filesAdded > 1 ? filesAdded-- : (filesAdded = 0)"
        @finish="loadingSubmit = false"
        @start="loadingSubmit = true"
      ></AudioFileUploader_2>
    </div>
    <div class="col-12 q-mb-md text-ndark">
      *In order to get the best result, we recommend to split longer audio
      tracks into multiple stories using this free
      <a href="https://products.aspose.app/audio/splitter" target="_blank"
        >Audio Splitter</a
      >
      tool.
      <br />
      **Only want to use a specific part of your audio? Trim your audio files on
      the fly using this free
      <a href="https://audiotrimmer.com/" target="_blank"> Audio Trimmer</a>.
    </div>
    <div class="col-auto q-mt-md q-mb-sm">
      <q-btn
        label="Upload"
        color="primary"
        :disable="!isAllInputValid"
        no-caps
        @click="onSubmit"
        :loading="loadingSubmit"
      ></q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { isValueProvided } from '../validators';
import AudioFileUploader_2 from '../AudioFileUploader_2.vue';
import { useQuasar } from 'quasar';

const emit = defineEmits(['uploaded']);
const $q = useQuasar();
const audioFileUploaderElement = ref(null as any);
const title = ref('');
const loadingSubmit = ref(false);
const filesAdded = ref(0);
const fieldsForFileUploder = computed((): { name: string; value: string }[] => {
  return title.value && title.value.length > 2
    ? [{ name: 'title', value: title.value }]
    : [];
});

const isAllInputValid = computed(() => {
  return validateAllInput();
});
const validateAllInput = () =>
  isValueProvided(title.value) && filesAdded.value === 1;

const onSubmit = async () => {
  if (validateAllInput()) {
    // console.log('trying upload');
    // console.log(audioFileUploaderElement.value.files);
    // console.log(audioFileUploaderElement.value);
    // console.log({ audioUploader: audioFileUploaderElement.value });
    await audioFileUploaderElement.value.upload();
    // console.log(res);
  } else {
    console.log('not validated');
  }
};

const reset = () => {
  title.value = '';
};

const uploadFinish = () => {
  reset();
  emit('uploaded', true);
};
</script>

<style lang="scss" scoped>
.audio-upload-form.dense {
  font-size: 0.8rem;
}
</style>
