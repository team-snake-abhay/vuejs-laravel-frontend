<template>
  <q-page
    class="row items-center justify-center bg-ndark"
    style="background-image: url('ty_bg.jpg')"
  >
    <q-card
      class="q-pa-xl"
      style="
        width: 600px;
        max-width: 80%;
        background-image: url('text_bg.jpg');
        background-size: auto 121%;
        background-position-y: 52%;
      "
    >
      <div class="column items-center text-center">
        <q-img
          src="logo.png"
          fit="contain"
          width="200px"
          class="q-mb-lg"
        ></q-img>
        <div class="" style="font-size: 1.4rem">
          Need Help? Please Contact Us At
        </div>
        <q-btn
          href="mailto:max@maxgerstenmeyer.com"
          label="max@maxgerstenmeyer.com"
          no-caps
          color="primary"
          size="lg"
          class="q-ma-md q-px-lg"
        ></q-btn>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
onMounted(() => {
  console.log('onMounted Support page');
});
</script>
