<template>
  <q-page class="row justify-evenly">
    <div class="col-12 q-px-lg">
      <!-- <q-btn label="Download" no-caps @click="downloadFile"> </q-btn> -->
    </div>
    <div class="col-audo" style="width: 650px">
      <h1>Upgrades</h1>
      <h2 class="q-mb-xl">Want to upgrade to make even more out of Storify?</h2>
      <q-card
        v-for="item in updrades"
        :key="item.name"
        style="width: 650px"
        class="q-mb-md"
        :class="{ hidden: !item.isShow(store.subscription) }"
      >
        <q-card-section class="">
          <div class="text-h3">{{ item.name }}</div>
          <div class="col-12 text-right">
            <q-btn
              :label="item.btnLabel || 'Upgrade Now'"
              no-caps
              target="_blank"
              :href="item.link"
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
import { api } from '../boot/axios';
import { Subscription } from 'src/components/models';

const router = useRouter();
const store = useAuthStore();
const newPassword = ref('');
const confirmPassword = ref('');
const isPwd = ref(true);
const loading = ref(false);
const isPWChngLocked = ref(false);
const passVal = (val: string) => /(?=.*[!#$%&?^*@~() "])(?=.{6,})/.test(val);

const updrades = [
  {
    // pro
    name: 'Supercharge Your Storify Account & Get 10x More Audience Hooked',
    link: 'https://get.storify.work/pro/?fbclid=IwAR0ZMc2OCdswH0ucCdXeGYGgHmA15wLf02iRuhfH8Vsi2hY9Dj5fBWVPHOg',
    btnLabel: 'Upgrade To Storify Pro',
    isShow: (currentSubscription: Subscription) => {
      return currentSubscription == 'basic';
    },
  },
  {
    // monthly
    name: 'Get Unlimited Benefits With The Storify Premium Upgrade',
    btnLabel: 'Get Access Now!',
    link: 'https://get.storify.work/monthly-upgrade/?fbclid=IwAR3OBaJSsC3ax7kC5pe6XktpjZ6Dqq3ReIKfRN_taqZwHeBZkpUH0v_f4ng',
    isShow: (currentSubscription: Subscription) =>
      currentSubscription !== 'recurring',
  },
  {
    // Reseller
    name: 'Sell Storify To Hungry Clients Around the Globe Keeping 100% Commissions in Your Pocket',
    btnLabel: 'Get The Reseller Rights Now!',
    link: 'https://get.storify.work/reseller-license/?fbclid=IwAR0qGer0cVNqrsEsgtSpbX5VJXFTY_e1BH39AtmwO8jXgr2tDspidwT01pM',
    isShow: () => true,
  },
  {
    // whitelabel
    name: 'Rebrand and Sell Storify As Your Own',
    btnLabel: 'Get Whitelabel Rights Now!',
    link: 'https://get.storify.work/whitelabel/?fbclid=IwAR04T1Ut_wTr3poqKRo5VDspK9WxwId5bNGEZBH26SYrQG742vcpPwfYsvY',
    isShow: () => true,
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
