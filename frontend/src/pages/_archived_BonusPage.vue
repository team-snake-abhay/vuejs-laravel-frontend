<template>
  <q-page class="row justify-evenly">
    <div class="col-audo">
      <h1>Bonuses</h1>
      <q-card
        v-for="app in bonusApps"
        :key="app.name"
        style="width: 650px"
        class="q-mb-md"
      >
        <q-card-section class="">
          <div class="text-h3">{{ app.name }}</div>
          <div class="col-12 text-right">
            <q-btn
              label="Download Here"
              no-caps
              target="_blank"
              :href="app.link"
              color="primary"
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useAuthStore();
const newPassword = ref('');
const confirmPassword = ref('');
const isPwd = ref(true);
const loading = ref(false);
const isPWChngLocked = ref(false);
const passVal = (val: string) => /(?=.*[!#$%&?^*@~() "])(?=.{6,})/.test(val);

const bonusApps = [
  {
    name: 'Visual Composer Autoresponder Addon',
    link: 'https://www.dropbox.com/s/fdl2b0z4r70p366/Visual%20Composer%20Autoresponder%20Addon.zip?dl=1',
  },
  {
    name: 'WooCommerce Referral Scheme',
    link: 'https://www.dropbox.com/s/8ibngxobwdbsg8l/WooCommerce%20Referral%20Scheme.zip?dl=1 ',
  },
  {
    name: 'Job Portal Mobile Application With Admin',
    link: 'https://www.dropbox.com/s/qxsplacsnvyrr9c/Job%20Portal.zip?dl=1 ',
  },
  {
    name: 'Exit Intent Popup',
    link: 'https://www.dropbox.com/s/ac8txdqyzf7t742/Exit%20Intent%20Popup.zip?dl=1 ',
  },
  {
    name: 'Caferia Mobile Application With Admin',
    link: 'https://www.dropbox.com/s/nzjntq0n6b2eer2/Caferia.zip?dl=1',
  },
];

const isValid = computed(() => {
  return (
    passVal(newPassword.value) && newPassword.value === confirmPassword.value
  );
});

const onSubmit = async () => {
  console.log('submitted');
  loading.value = true;
  try {
    const res = await store.changePassword(newPassword.value);

    if (res) {
      router.push('login');
    }
    loading.value = false;
  } catch (error) {
    console.log('login error');
    loading.value = false;
  }
};
const pwChngLocked4TheseUsers = ['demo@storify.com', 'demoRec@storify.com'];

onMounted(() => {
  // console.log('this is login page');
  if (store.email && pwChngLocked4TheseUsers.includes(store.email)) {
    isPWChngLocked.value = true;
    console.log('blocked');
  } else {
    console.log('not blocked');
  }
});
</script>
