<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-auto">
      <h3>Sign in to your Storify Account</h3>
      <!-- forget  -->
      <q-card>
        <q-card-section class="q-pa-xl">
          <form @submit.prevent.stop="onSubmit" class="q-gutter-md">
            <div class="row">
              <div class="col-12 q-mb-md">
                <label class="text-bold"
                  >Email <span class="text-negative">*</span></label
                >
                <q-input
                  outlined
                  placeholder="you@gmail.com"
                  :rules="['email']"
                  v-model="email"
                  type="email"
                  dense
                  name="email"
                >
                </q-input>
              </div>
              <div class="col-12 q-mb-md">
                <label class="text-bold"
                  >Password <span class="text-negative">*</span></label
                >

                <q-input
                  v-model="password"
                  outlined
                  dense
                  placeholder="Your password"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[(val) => !!val || 'Field is required']"
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

              <div class="col-12 q-mb-md row justify-between">
                <q-btn
                  :loading="loading"
                  label="Submit"
                  type="submit"
                  no-caps
                  color="primary"
                />

                <q-btn
                  label="Forget Password"
                  flat
                  no-caps
                  color="primary"
                  :to="{ name: 'reset_account' }"
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
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useAuthStore();
const email = ref('');
const password = ref('');
const isPwd = ref(true);
const loading = ref(false);
const passwordResetForm = ref(true);

const onSubmit = async () => {
  const form = {
    email: email.value,
    password: password.value,
    // send login request
  };
  console.log('submitted');
  loading.value = true;
  try {
    const res = await store.login(form);
    console.log(res);
    if (res) {
      console.log('login success');
      router.push('dashboard');
    } else {
      console.log('login failed');
    }
    loading.value = false;
  } catch (error) {
    console.log('login error');
    loading.value = false;
  }
};
onMounted(() => {
  console.log('this is login page');
});
</script>
