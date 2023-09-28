<template>
  <q-uploader
    :url="url"
    accept=".wav, .mp3"
    :bordered="true"
    color="grey-2"
    class="text-dark uplod-file-drop-area"
    :class="{ dense: $q.screen.lt.sm }"
    max-file-size="16000000"
    :max-files="1"
    square
    @uploaded="handleUploaded"
    field-name="audio"
    :headers="headers"
    ref="uploaderElement"
    :form-fields="fields"
    @rejected="onRejected"
    @failed="onFailed"
    @added="onAudioAdded"
    @removed="$emit('removed')"
    @start="$emit('start')"
    @finish="$emit('finish')"
    style="max-width: 90%"
  >
    <template v-slot:header="scope">
      <!-- buttons -->
      <div
        class="row no-wrap items-center q-pa-sm q-gutter-xs text-dark"
        style=""
      >
        <!-- button Remove uploaded files -->
        <!-- <q-btn
          v-if="scope.uploadedFiles.length > 0"
          icon="done_all"
          @click="scope.removeUploadedFiles"
          round
          dense
          outline
        >
          <q-tooltip>Remove Uploaded Files</q-tooltip>
        </q-btn> -->
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
      <div
        v-if="scope.files.length > 0"
        class="q-uploader__list scroll q-mb-lg"
        style="min-height: 150px"
      >
        <div
          v-for="file in scope.files"
          :key="file.__key"
          class="q-uploader__file relative-position"
          :class="file.__status"
        >
          <div class="q-uploader__file-header row flex-center no-wrap">
            <div class="q-uploader__file-header-content col">
              <div class="q-uploader__title">
                {{ file.name }}
              </div>
              <div class="q-uploader__subtitle row items-center no-wrap">
                {{ file.__sizeLabel }} /
                {{
                  file.__progressLabel !== '0.00%'
                    ? file.__progressLabel
                    : '- -'
                }}
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
              :loading="scope.isUploading"
            />
            <q-icon
              v-if="file.__status === 'failed'"
              name="warning"
              size="lg"
              color="negative"
            />
          </div>
        </div>
      </div>
      <div
        v-else
        @click="scope.pickFiles"
        class="file-upload-area text-center q-my-none"
      >
        <div
          class="mantine-Group-root mantine-it8j5t"
          style="min-height: 150px"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mantine-gnzaph mantine-Group-child"
            width="40"
            height="40"
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
              Please select a <i>mp3</i> Or <i>.wav</i> file smaller than
              {{ maxAudioLengthMsg }} & 15mb<br />
            </div>
          </div>
        </div>
      </div>
    </template>
  </q-uploader>
</template>

<script setup lang="ts">
import { ref, PropType, onMounted } from 'vue';
import { useQuasar, LocalStorage } from 'quasar';
import { useAudioStore } from 'src/stores/audio';
import { useAuthStore } from 'src/stores/auth';
import { response } from 'express';

const $emit = defineEmits(['uploaded', 'added', 'removed', 'finish']);
const props = defineProps({
  fields: {
    type: Array as PropType<{ name: string; value: string }[]>,
    default: () => [],
  },
});
const uploaderElement = ref(null as any);
const audioStore = useAudioStore();
const authStore = useAuthStore();
const $q = useQuasar();

onMounted(() => {
  maxAudioLengthMsg.value =
    authStore.permission.storyLength < 60
      ? authStore.permission.storyLength + ' seconds'
      : authStore.permission.storyLength / 60 + ' minutes';
});

let maxAudioLengthMsg = ref('');

const onRejected = (rejectedEntries: Array<any>) => {
  console.log({ rejectedEntries });
  const reason = rejectedEntries[0]['failedPropValidation']
    ? rejectedEntries[0]['failedPropValidation']
    : '';
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints "${reason}"`,
  });
};
const onFailed = (info: any) => {
  // console.log(info);
  // console.log(info.xhr.response);
  console.log(JSON.parse(info.xhr.response));
  // console.log(JSON.parse(info.xhr.response).message.audio[0]);

  let errorMsg = '';
  if (info?.xhr?.response) {
    const errorObj = JSON.parse(info.xhr.response);

    errorMsg = errorObj.message
      ? errorObj.message.audio
        ? errorObj.message.audio[0]
        : errorObj.message
      : 'Something unusual happened. Try with another file';

    if (errorMsg === 'The audio duration must be less than 90 seconds.') {
      errorMsg = 'The audio duration must be less than 1.5 minutes.';
    } else if (
      errorMsg === 'The audio duration must be less than 180 seconds.'
    ) {
      errorMsg = 'The audio duration must be less than 3 minutes.';
    } else if (
      errorMsg === 'The audio duration must be less than 300 seconds.'
    ) {
      errorMsg = 'The audio duration must be less than 5 minutes.';
    } else if (authStore.subscription === 'recurring') {
      if (
        errorMsg == 'Sorry your limit of daily uploading audio exided' ||
        errorMsg == 'Sorry your limit of monthly uploading audio exided'
      ) {
        errorMsg =
          'Something unusual happened while uploading audio. Try with another file';
      } else if (
        errorMsg == 'Sorry your limit of daily story creation exided' ||
        errorMsg == 'Sorry your limit of monthly story creation exided'
      ) {
        errorMsg = 'Something unusual happened. Please Try later';
      }
    }
  } else {
    errorMsg = "Couldn't get server response";
  }

  $emit('removed');

  errorMsg = errorMsg.replace('exided', 'exceeded');

  $q.notify({
    type: 'negative',
    message: errorMsg,
  });
};

const handleUploaded = (res: any) => {
  const rootRes = JSON.parse(res.xhr.response);
  console.log({ res, rootRes });
  if (rootRes.success) {
    $emit('uploaded', true);

    console.log({
      resForeRecord: rootRes,
      id: rootRes.data.mediaStorageObj.id,
    });
    if (rootRes.data.mediaStorageObj.id)
      audioStore.addToTranscriptionList(
        rootRes.data.mediaStorageObj.id,
        rootRes.data.mediaStorageObj.meta_info.file_size || null
      );

    $q.notify({
      type: 'positive',
      message: 'File upload successfully',
    });
  } else {
    // console.log('problem in response data', res);
    $q.notify({
      type: 'negative',
      message: 'File did not upload properly',
    });
  }
};

const headers = () => [
  { name: 'Authorization', value: LocalStorage.getItem('token') + '' },
];

const upload = async () => {
  const res = await uploaderElement.value.upload();
  return res;
};

const onAudioAdded = (files: readonly any[]) => {
  console.log('onAudioAdded');
  console.log(files[0]);
  $emit('added');
};

const url = process.env.API_URL + '/audio/save';

defineExpose({
  upload,
  uploaderElement,
});
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
