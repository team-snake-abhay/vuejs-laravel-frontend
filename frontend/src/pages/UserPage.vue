<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-audo">
      <h3>Change Password</h3>
      <q-card style="max-width: 650px">
        <q-card-section v-if="isPWChngLocked">
          Password change blocked for demo accounts
        </q-card-section>
        <q-card-section v-else class="q-pa-xl">
          <form @submit.prevent.stop="onSubmit" class="q-gutter-md">
            <div class="row">
              <!-- new pass -->
              <div class="col-12 q-mb-md">
                <label class="text-bold"
                  >New Password <span class="text-negative">*</span></label
                >

                <q-input
                  v-model="newPassword"
                  outlined
                  dense
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) =>
                      passVal(val) ||
                      'Minimum six char and must have a special character',
                  ]"
                  name="new password"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>

              <!-- confirm pass -->
              <div class="col-12 q-mb-md">
                <label class="text-bold"
                  >Confirm Password <span class="text-negative">*</span></label
                >

                <q-input
                  v-model="confirmPassword"
                  outlined
                  dense
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) => !!val || 'Field is required',
                    (val) =>
                      newPassword === confirmPassword ||
                      'Password didn\'t matched',
                  ]"
                  name="password"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>

              <div class="col-12 q-mb-md">
                <q-btn
                  :disable="!isValid"
                  :loading="loading"
                  label="Submit"
                  type="submit"
                  no-caps
                  color="primary"
                />
              </div>
            </div>
          </form>
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
