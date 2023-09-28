<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-auto">
      <h3>Reset your account</h3>
      <!-- forget  -->
      <q-card>
        <q-card-section class="q-pa-xl">
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

            <div class="col-12 q-mb-md row justify-between">
              <q-btn
                label="Back to Login"
                flat
                no-caps
                color="primary"
                icon="arrow_back"
                :to="{ name: 'login' }"
              />

              <q-btn
                :loading="loading"
                label="Submit"
                @click="resetThisAccount"
                no-caps
                color="primary"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-xl">
          <p v-if="errMessage !== ''" class="text-negative">{{ errMessage }}</p>
          <p v-if="successMessage !== ''" class="text-positive">
            {{ successMessage }}
          </p>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { isValueProvided } from 'components/validators';

const email = ref('');
const loading = ref(false);
const errMessage = ref('');
const successMessage = ref('');

const validatePassResetRequest = () => isValueProvided(email.value);

const resetThisAccount = async () => {
  if (validatePassResetRequest()) {
    loading.value = true;
    try {
      const res = await api.post('/forgot-password', { email: email.value });
      console.log('forgot password', res);
      errMessage.value = '';
      successMessage.value = '';
      if (res.data.error) {
        errMessage.value = res.data.message ?? 'Unsuccessful attempt';

        Notify.create({
          type: 'negative',
          message: errMessage.value,
        });
        console.log('forget pass failed ');
      } else if (res.data.success) {
        successMessage.value = res.data.message ?? 'Unsuccessful attempt';

        Notify.create({
          type: 'positive',
          message: successMessage.value,
        });
        console.log('forget pass failed ');
      } else {
        errMessage.value =
          'Something unusual happend! try again after sometime';
        Notify.create({
          type: 'positive',
          message: errMessage.value,
        });
      }
      loading.value = false;
    } catch (error) {
      console.log('forget pass error error');
      loading.value = false;
    }
  }
};
</script>
