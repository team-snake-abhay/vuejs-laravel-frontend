<template>
  <q-uploader
    url="http://localhost:4444/upload"
    accept=".mp3"
    @rejected="onRejected"
    :bordered="true"
    color="grey-2"
    class="text-dark uplod-file-drop-area"
    max-file-size="30000000"
    square
    style="width: 100%"
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
      <div v-if="scope.files.length > 0" class="">
        <div
          v-for="file in scope.files"
          :key="file.__key"
          class="text-dark"
          :class="file.__status"
        >
          <div class="row">
            <div class="col-12">
              {{ JSON.stringify(scope) }}
            </div>
          </div>
          <div class="row q-col-gutter-xs items-center">
            <div class="col-auto" v-if="file.__status === 'failed'">
              <q-icon name="warning" size="sm" color="negative" />
            </div>
            <div class="col">{{ file.name }}</div>
            <div class="col-auto">
              <span> {{ file.__status }}</span>
            </div>
            <div class="col-auto text-negative">
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
          </div>
        </div>
      </div>

      <!-- no files selected -->
      <div
        @click="pickFiles(scope)"
        class="file-upload-area text-center q-my-none"
      >
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

      <!-- <q-spinner v-if="scope.isUploading" class="q-uploader__spinner absolute" /> -->
      <div class="absolute-center text-center" v-if="scope.isUploading">
        <q-spinner color="primary" size="xl" class="q-uploader__spinner" />
      </div>
    </template>
  </q-uploader>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

// const props = defineProps({
//   example: {
//     type: String,
//     default: '',
//   },
// });

const pickFiles = async (scope: any) => {
  if (scope.files.length) {
    await scope.removeFile(scope.files[0]);
    pickFiles(scope);
  } else {
    scope.pickFiles();
  }
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
