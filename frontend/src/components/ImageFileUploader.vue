<template>
  <q-uploader
    url="http://localhost:4444/upload"
    accept=".jpg, image/*"
    @rejected="onRejected"
    :bordered="true"
    auto-upload
    color="grey-2"
    class="text-dark uplod-file-drop-area"
    max-file-size="10000000"
    square
  >
    <template v-slot:header="scope">
      <!-- buttons -->
      <div class="row no-wrap items-center q-pa-sm q-gutter-xs text-dark">
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
      <q-list separator v-if="scope.files.length > 1">
        <q-item v-for="file in scope.files" :key="file.__key">
          <q-item-section>
            <q-item-label class="full-width ellipsis">
              {{ file.name }}
            </q-item-label>

            <q-item-label caption> Status: {{ file.__status }} </q-item-label>

            <q-item-label caption>
              {{ file.__sizeLabel }} /
              {{
                file.__progressLabel !== '0.00%' ? file.__progressLabel : '- -'
              }}
              {{ file.__status }}
            </q-item-label>
          </q-item-section>

          <q-item-section v-if="file.__img" thumbnail class="gt-xs">
            <img :src="file.__img.src" />
          </q-item-section>

          <q-item-section top side>
            <q-btn
              class="gt-xs"
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click="scope.removeFile(file)"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <div v-if="scope.files.length === 1" class="q-uploader__list scroll">
        <div
          v-for="file in scope.files"
          :key="file.__key"
          class="q-uploader__file relative-position q-uploader__file--img q-uploader__file--failed"
          :style="'background-image: url(' + file.__img.src + ');'"
        >
          <div class="q-uploader__file-header row flex-center no-wrap">
            <i
              v-if="file.__status === 'failed'"
              class="q-icon text-negative notranslate material-icons q-uploader__file-status"
              aria-hidden="true"
              role="presentation"
              >warning</i
            >
            <!-- <div>{{ JSON.stringify(file) }}</div> -->

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
        </div>
      </div>

      <!-- no files selected -->
      <div
        v-if="scope.files.length < 1"
        class="file-upload-area text-center q-my-none"
        role="presentation"
        tabindex="0"
        data-idle="true"
      >
        <div class="mantine-1wfnhna mantine-Dropzone-inner">
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

const $q = useQuasar();

function onRejected(rejectedEntries: Array<any>) {
  // Notify plugin needs to be installed
  // https://quasar.dev/quasar-plugins/notify#Installation
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
</style>
