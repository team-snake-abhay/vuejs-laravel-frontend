<template>
  <div
    v-if="modelValue && modelValue !== ''"
    class="selected-file-display-area relative-position uplod-file-drop-area q-pa-sm"
  >
    <q-img
      class="rounded-borders"
      height="200px"
      fit="contain"
      :src="modelValue"
    />
    <q-btn
      color="negative"
      class="absolute-top-right clear-button q-ma-md"
      size="sm"
      flat
      no-caps
      round
      icon="close"
      @click="updateModelValue('')"
    >
      <q-tooltip class="bg-ndark" :offset="[10, 10]"> Change image </q-tooltip>
    </q-btn>
  </div>

  <q-uploader
    v-else
    :url="url"
    accept=".jpg, image/*"
    @rejected="onRejected"
    :bordered="true"
    auto-upload
    color="grey-2"
    class="text-dark uplod-file-drop-area"
    max-file-size="10000000"
    square
    @uploaded="handleUploaded"
    field-name="image"
    :headers="headers"
    @removed="updateModelValue('')"
  >
    <template v-slot:header="scope">
      <!-- buttons -->
      <div
        class="row no-wrap items-center q-pa-sm q-gutter-xs text-dark"
        style="display: none"
      >
        <!-- button Remove uploaded files -->
        <q-btn
          v-if="scope.uploadedFiles.length > 0"
          icon="done_all"
          @click="scope.removeUploadedFiles"
          round
          dense
          outline
        >
          <q-tooltip>Remove Uploaded Files</q-tooltip>
        </q-btn>
        <!-- Spinner on loading -->
        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />

        <!-- title & progress info -->
        <div class="col">
          <div class="q-uploader__subtitle" v-if="scope.isUploading">
            {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
          </div>
        </div>
        <!-- pick files button -->
        <q-btn
          v-if="scope.canAddFiles"
          type="a"
          icon="add"
          @click="scope.pickFiles"
          round
          dense
          outline
        >
          <q-uploader-add-trigger />
          <q-tooltip>Pick Files</q-tooltip>
        </q-btn>

        <q-btn
          v-if="scope.canUpload"
          icon="cloud_upload"
          @click="scope.upload"
          round
          dense
          flat
        >
          <q-tooltip>Upload Files</q-tooltip>
        </q-btn>

        <q-btn
          v-if="scope.isUploading"
          icon="clear"
          @click="scope.abort"
          round
          dense
          flat
        >
          <q-tooltip>Abort Upload</q-tooltip>
        </q-btn>
      </div>
    </template>

    <template v-slot:list="scope">
      <div v-if="scope.files.length > 0" class="q-uploader__list scroll">
        <div
          v-for="file in scope.files"
          :key="file.__key"
          class="q-uploader__file relative-position q-uploader__file--img q-uploader__file--failed"
          :class="file.__status"
          :style="'background-image: url(' + file.__img.src + ');'"
        >
          <div class="q-uploader__file-header row flex-center no-wrap">
            <div class="q-uploader__file-header-content col">
              <div class="q-uploader__title">
                {{ file.name }}
              </div>
              <div class="q-uploader__subtitle row items-center no-wrap">
                {{ file.__status }}
              </div>
            </div>

            <q-btn
              class="gt-xs"
              size="12px"
              flat
              dense
              round
              icon="clear"
              @click="scope.removeFile(file)"
            />
          </div>
          <!-- <q-spinner v-if="scope.isUploading" class="q-uploader__spinner absolute" /> -->
          <div class="absolute-center text-center" v-if="scope.isUploading">
            <q-spinner color="primary" size="xl" class="q-uploader__spinner" />
          </div>
          <div
            class="absolute-center text-center"
            v-if="file.__status === 'failed'"
          >
            <q-icon name="warning" size="lg" color="negative" />
          </div>
        </div>
      </div>

      <!-- no files selected -->

      <div
        v-else
        @click="scope.pickFiles"
        class="file-upload-area text-center q-my-none"
      >
        <div
          class="mantine-Group-root mantine-it8j5t"
          style="min-height: 200px; pointer-events: none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mantine-gnzaph mantine-Group-child q-my-md text-dark"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <line x1="15" y1="8" x2="15.01" y2="8"></line>
            <rect x="4" y="4" width="16" height="16" rx="3"></rect>
            <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5"></path>
            <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2"></path>
          </svg>
          <div class="">
            <div class="text-dark text-h6">
              Drag image here or click to select files
            </div>
            <div class="text-ndark">
              Attach 1 file with a maximum file size of 10mb
            </div>
          </div>
        </div>
      </div>
    </template>
  </q-uploader>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { useQuasar, LocalStorage } from 'quasar';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const $q = useQuasar();

const onRejected = (rejectedEntries: Array<any>) => {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
  });
};

const handleUploaded = (res: any) => {
  // console.log({ res });

  const rootRes = JSON.parse(res.xhr.response);
  if (rootRes.success && rootRes.data?.mediaObject?.local_path) {
    updateModelValue(rootRes.data.mediaObject.local_path);
  } else {
    // console.log('problem in response data', res);
    $q.notify({
      type: 'negative',
      message: 'File did not upload properly',
    });
  }
};

const updateModelValue = (val: string) => {
  emit('update:modelValue', val);
};

const headers = () => [
  { name: 'Authorization', value: LocalStorage.getItem('token') + '' },
];

const url = process.env.API_URL + '/image/save';
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
