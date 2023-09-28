<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-12">
      <!-- hero section starts  -->
      <section class="container">
        <h1 class="q-px-md">Training</h1>
      </section>

      <section class="container q-py-none q-px-md q-mt-xl">
        <!-- welcome -->
        <div class="training-sub-section">
          <h3>Welcome to Storify</h3>
          <div class="video">
            <!-- <iframe
              class="full-width"
              width="1108"
              height="623"
              src=""
              title="Welcome To Storify"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe> -->

            <VideoPlaceholder></VideoPlaceholder>
          </div>
        </div>

        <!-- 3 story in 5 minutes video -->
        <div class="training-sub-section q-mt-xl q-pt-md">
          <h3>3 Stories in 5 Minutes</h3>
          <div class="video">
            <!-- <iframe
              class="full-width"
              width="1108"
              height="623"
              src="https://www.youtube.com/embed/2mEbdNplNhk"
              title="3 Stories in 5 Minutes"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe> -->

            <VideoPlaceholder></VideoPlaceholder>
          </div>
        </div>

        <!-- 3 story -->
        <div
          class="training-sub-section bg-nwhite-2 q-pa-lg rounded-borders"
          style="margin: 100px auto"
        >
          <div class="row q-col-gutter-md justify-center">
            <div class="col-auto">
              <iframe
                width="373"
                height="624"
                src="https://www.storify.work/story/644fa82aaadbf"
                title="Storify Story"
                frameborder="0"
                style="border-radius: 4px"
              ></iframe>
            </div>
            <div class="col-auto">
              <iframe
                width="373"
                height="624"
                src="https://www.storify.work/story/644fa50060ed0"
                title="Storify Story"
                frameborder="0"
                style="border-radius: 4px"
              ></iframe>
            </div>
            <div class="col-auto">
              <iframe
                width="373"
                height="624"
                src="https://www.storify.work/story/644f82d30d76e"
                title="Storify Story"
                frameborder="0"
                style="border-radius: 4px"
              ></iframe>
            </div>
          </div>
        </div>

        <!-- basic video -->
        <div class="training-sub-section q-mt-xl q-pt-md">
          <h3>Basic Version Walkthrough</h3>
          <div class="video">
            <!-- <iframe
              class="full-width"
              width="1108"
              height="623"
              src="https://www.youtube.com/embed/nZCgIqaUv1E"
              title="Storify Basic Walkthrough"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe> -->

            <VideoPlaceholder></VideoPlaceholder>
          </div>
        </div>

        <!-- pro video -->
        <div class="training-sub-section q-mt-xl q-pt-md">
          <h3>Pro Version Walkthrough</h3>
          <div class="video">
            <!-- <iframe
              class="full-width"
              width="1108"
              height="623"
              src="https://www.youtube.com/embed/vseMAAroeDA"
              title="Storify Pro Upgrade Walkthrough"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe> -->

            <VideoPlaceholder></VideoPlaceholder>
          </div>
        </div>

        <!-- recurring video -->
        <div class="training-sub-section q-mt-xl q-pt-md">
          <h3>Monthly Version Walkthrough</h3>
          <div class="video">
            <!-- <iframe
              class="full-width"
              width="1108"
              height="623"
              src="https://www.youtube.com/embed/LPhK2f4qjnM"
              title="Storify Monthly Upgrade Walkthrough"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe> -->

            <VideoPlaceholder></VideoPlaceholder>
          </div>
        </div>
      </section>

      <footer class="footer-line">
        <div class="containerr">
          <q-img src="/logo.6e466c62.png" fit="contain" />
        </div>
      </footer>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// import { Todo, Meta } from 'components/models';
import { ref } from 'vue';
import VideoPlaceholder from 'components/VideoPlaceholder.vue';

import { onMounted } from 'vue';

// const todos = ref<Todo[]>([
//   {
//     id: 1,
//     content: 'ct1',
//   },
//   {
//     id: 2,
//     content: 'ct2',
//   },
//   {
//     id: 3,
//     content: 'ct3',
//   },
//   {
//     id: 4,
//     content: 'ct4',
//   },
//   {
//     id: 5,
//     content: 'ct5',
//   },
// ]);
// const meta = ref<Meta>({
//   totalCount: 1200,
// });
onMounted(() => {
  console.log('onMounted home page');
});
</script>
