<template>
  <div class="text-dark uplod-file-drop-area" @click="pickFiles">
    <!-- ..... -->
    <!-- ..... -->
    <span>{{ JSON.stringify(model) }}</span>
    <!-- ..... -->
    <!-- ..... -->
    <!-- <span>{{ JSON.stringify(filePicker.nativeEl) }}</span> -->
    <div class="file-upload-area text-center q-my-none">
      <div class="mantine-1wfnhna mantine-Dropzone-inner">
        <div
          class="mantine-Group-root mantine-it8j5t"
          style="min-height: 200px; pointer-events: none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mantine-gnzaph mantine-Group-child"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#000"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"
            ></path>
            <polyline points="9 15 12 12 15 15"></polyline>
            <line x1="12" y1="12" x2="12" y2="21"></line>
          </svg>
          <div class="">
            <div class="text-dark text-h6">Upload Recording</div>
            <div class="text-ndark">
              Drag'n'drop files here to upload. We can accept only<i>.mp3</i>
              files that are less than 30mb in size.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <q-file
    ref="filePicker"
    v-model="model"
    label="Pick MP3 File"
    accept=".mp3, .wav, .flac"
    @rejected="onRejected"
    color="grey-2"
    class=""
    max-file-size="30000000"
    square
    style="width: 100%"
  />
  <!-- <q-spinner class="q-uploader__spinner" /> -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps({
  modelValue: {
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
// const model = ref('' as any);

const filePicker = ref(null as any);

const model: any = computed({
  get() {
    return props.modelValue;
  },
  set(val: any) {
    emit('update:modelValue', val);
  },
});

const pickFiles = async () => {
  filePicker.value.pickFiles();
};
const $q = useQuasar();

function onRejected(rejectedEntries: Array<any>) {
  console.log({ rejectedEntries });
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
  });
}
</script>

<style lang="scss" scoped>
.file-upload-area {
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
  padding: 16px;
  user-select: none;
  transition: background-color 150ms ease 0s;
  position: relative;
  cursor: pointer;
}

.failed::before {
  content: ' ';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 1;
  background: #ffffffa3;
}
</style>
