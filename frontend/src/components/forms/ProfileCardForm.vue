<template>
  <CardFormLayout title="Profile Card">
    <template #form-area>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">Profile Image (optional)</label>
        <SingleImageFileUploader
          class="q-mt-xs"
          v-model="profileImage"
        ></SingleImageFileUploader>
        <label class="text-bold text-ndark-3 q-pl-xs">Or Search Avatar</label>
        <UnsplashImageSelector
          @on-select="(v:string) => (profileImage = v)"
          orientation="squarish"
        ></UnsplashImageSelector>
      </div>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold"
          >First Name <span class="text-negative">*</span></label
        >
        <q-input
          dense
          outlined
          placeholder="John"
          v-model="firstName"
          :rules="[(v) => isValueProvided(v) || '* Field is required']"
        />
      </div>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold"
          >Last Name <span class="text-negative">*</span></label
        >
        <q-input
          dense
          outlined
          placeholder="Doe"
          v-model="lastName"
          :rules="[(v) => isValueProvided(v) || '* Field is required']"
        />
      </div>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold"
          >Enterprise or Title <span class="text-negative">*</span></label
        >
        <q-input
          dense
          outlined
          placeholder="CEO"
          v-model="enterpriseTitle"
          :rules="[(v) => isValueProvided(v) || '* Field is required']"
        />
      </div>
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">Twitter Profile URL (Optional)</label>
        <q-input
          dense
          outlined
          placeholder="http://"
          v-model="twitter"
          :rules="[(val) => val === '' || isValidUrl(val) || 'Invalid Url']"
        />
      </div>
      <!-- Linkedin -->
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">LinkedIn Profile URL (Optional)</label>
        <q-input
          dense
          outlined
          placeholder="http://"
          :rules="[(val) => val === '' || isValidUrl(val) || 'Invalid Url']"
          v-model="linkedin"
        >
        </q-input>
      </div>

      <!-- Facebook -->
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">Facebook Profile URL (Optional)</label>
        <q-input
          dense
          outlined
          placeholder="http://"
          :rules="[(val) => val === '' || isValidUrl(val) || 'Invalid Url']"
          v-model="facebook"
        >
        </q-input>
      </div>

      <!-- Instagram -->
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">Instagram Profile URL (Optional)</label>
        <q-input
          dense
          outlined
          placeholder="http://"
          :rules="[(val) => val === '' || isValidUrl(val) || 'Invalid Url']"
          v-model="instagram"
        >
        </q-input>
      </div>

      <!-- Youtube -->
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">Youtube Profile URL (Optional)</label>
        <q-input
          dense
          outlined
          placeholder="http://"
          :rules="[(val) => val === '' || isValidUrl(val) || 'Invalid Url']"
          v-model="youtube"
        >
        </q-input>
      </div>
      <!-- website -->
      <div class="col-auto q-mb-md limited-max-width">
        <label class="text-bold">Website URL (Optional)</label>
        <q-input
          dense
          outlined
          placeholder="http://"
          :rules="[(val) => val === '' || isValidUrl(val) || 'Invalid Url']"
          v-model="website"
        >
        </q-input>
      </div>
    </template>

    <template #card-view-area>
      <ProfileCard :profileObj="profileObj"></ProfileCard>
    </template>
    <template #action>
      <q-btn
        :label="isNew ? 'Submit' : 'Update'"
        :class="isNew ? 'bg-primary text-white' : 'bg-warning text-black'"
        style="width: 100%"
        no-caps
        @click="onSubmit"
        :loading="loadingSubmit"
        :disable="!isAllInputValid"
      ></q-btn>
    </template>
  </CardFormLayout>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed, onMounted } from 'vue';
import CardFormLayout from './CardFormLayout.vue';
import ProfileCard from '../story-card/ProfileCard.vue';
import { Card, Profile } from '../models';
import { useStoryStore } from '../../stores/story';
import { isValidUrl, isValueProvided } from '../validators';
import SingleImageFileUploader from '../SingleImageFileUploader.vue';
import UnsplashImageSelector from '../UnsplashImageSelector.vue';

const profileImage = ref('');
const firstName = ref('');
const lastName = ref('');
const enterpriseTitle = ref('');
const twitter_ref = ref('');
const linkedin_ref = ref('');
const facebook_ref = ref('');
const instagram_ref = ref('');
const youtube_ref = ref('');
const website_ref = ref('');

const twitter = computed({
  get: () => {
    return twitter_ref.value;
  },
  set: (val) => {
    twitter_ref.value = val.replace('https://', '').replace('http://', '');
  },
});

const linkedin = computed({
  get: () => {
    return linkedin_ref.value;
  },
  set: (val) => {
    linkedin_ref.value = val.replace('https://', '').replace('http://', '');
  },
});

const facebook = computed({
  get: () => {
    return facebook_ref.value;
  },
  set: (val) => {
    facebook_ref.value = val.replace('https://', '').replace('http://', '');
  },
});

const instagram = computed({
  get: () => {
    return instagram_ref.value;
  },
  set: (val) => {
    instagram_ref.value = val.replace('https://', '').replace('http://', '');
  },
});

const youtube = computed({
  get: () => {
    return youtube_ref.value;
  },
  set: (val) => {
    youtube_ref.value = val.replace('https://', '').replace('http://', '');
  },
});
const website = computed({
  get: () => {
    return website_ref.value;
  },
  set: (val) => {
    website_ref.value = val.replace('https://', '').replace('http://', '');
  },
});

const loadingSubmit = ref(false);

const store = useStoryStore();

// const step = ref(1);
const emit = defineEmits<{
  (e: 'finished'): void;
}>();

const isAllInputValid = computed(() => {
  return validateAllInput();
});

const validateAllInput = () =>
  isValueProvided(firstName.value) &&
  isValueProvided(lastName.value) &&
  isValueProvided(enterpriseTitle.value);

const profileObj = computed(() => {
  let p: Profile = {
    profileImage: profileImage.value,
    firstName: firstName.value,
    lastName: lastName.value,
    enterpriseTitle: enterpriseTitle.value,
    twitter: twitter.value,
    linkedin: linkedin.value,
    facebook: facebook.value,
    instagram: instagram.value,
    youtube: youtube.value,
    website: website.value,
  };
  return p;
});

const onSubmit = async () => {
  loadingSubmit.value = true;
  if (validateAllInput()) {
    const c: Card = {
      type: cardType,
      data: profileObj,
      word: store.word,
    };
    // if update remove previuosone
    store.removeCardFromCurrentStoryByTimestamp(store.word.start);
    await store.addCardToAStory(c);
    emit('finished');
  } else {
    console.log('not validated');
  }
  loadingSubmit.value = false;
};

const isNew = ref(true);
const cardType = 'profile';
onMounted(() => {
  isNew.value = !store.card;
  if (!isNew.value && store.card?.type === cardType) {
    profileImage.value = store.card.data.profileImage || '';
    firstName.value = store.card.data.firstName || '';
    lastName.value = store.card.data.lastName || '';
    enterpriseTitle.value = store.card.data.enterpriseTitle || '';
    twitter.value = store.card.data.twitter || '';
    linkedin.value = store.card.data.linkedin || '';
    facebook.value = store.card.data.facebook || '';
    instagram.value = store.card.data.instagram || '';
    youtube.value = store.card.data.youtube || '';
    website.value = store.card.data.website || '';
  }
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
</style>
