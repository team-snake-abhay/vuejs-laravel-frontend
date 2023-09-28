<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-12">
      <!-- hero section starts  -->
      <div class="hero">
        <div class="container">
          <div class="row items-center">
            <div class="col-xs-12 col-sm-6">
              <h1>The smart solution for content marketers.</h1>
              <p>
                Your voice combined with an interactive feed. Create & share
                Stories in a matter of minutes and measure audience engagement
                with ease.
              </p>
            </div>
            <div class="col-xs-12 col-sm-6">
              <div class="row justify-center">
                <div class="col-auto text-center">
                  <!-- https://demo.storify.work/story/63ed342ee79f2 -->
                  <!-- <q-img src="/trainer.PNG" /> -->
                  <StoryPlayer :interaction="false"></StoryPlayer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- hero section end  -->

      <!-- main content section starts  -->
      <div class="container content-container">
        <div class="row content-heading">
          <div class="text-center">
            <h2>Share content on a personal level..</h2>
            <h1>All in one smart content creation.</h1>
          </div>
        </div>
        <div class="row sub-section items-center q-col-gutter-xl">
          <div class="col-12 col-sm-6">
            <h1>Create content that grabs the attention of your audience.</h1>
            <p>
              No need for any advanced skills or your own production team
              anymore. Storify’s smart interactive setup combines human voice
              with a visual feed. Add links, social profiles, images, quotes and
              much more. Make YOUR story NOW!
            </p>
          </div>
          <div class="col-12 col-sm-6">
            <q-img src="/1.png" />
          </div>
        </div>

        <div class="row sub-section items-center q-col-gutter-xl">
          <div class="content col-xs-12 col-sm-6">
            <q-img src="/2.png" />
          </div>
          <div class="content col-xs-12 col-sm-6">
            <h1>Be consistent - Never stop creating content.</h1>
            <p>
              Storify’s easy to use interface enables you to create high-quality
              smart content in minutes. You come up with the idea, and Storify
              makes sure your content looks amazing so you can focus on your
              business.
            </p>
          </div>
        </div>

        <div class="row sub-section items-center q-col-gutter-xl">
          <div class="content col-xs-12 col-sm-6">
            <h1>Measure how your audience interacts with your Stories.</h1>
            <p>
              Measure audience interaction with performance analytics and boost
              it.
            </p>
          </div>
          <div class="content col-xs-12 col-sm-6">
            <q-img src="/3.png" />
          </div>
        </div>

        <div class="row sub-section items-center q-col-gutter-xl">
          <div class="content col-xs-12 col-sm-6">
            <q-img src="/4.png" />
          </div>
          <div class="content col-xs-12 col-sm-6">
            <h1>Make content easy and interesting.</h1>
            <p>
              Storify’s audio+visual setup enables you to bring complex subjects
              to life. Gone are the days when you needed to create a long
              article, training video, or case study.
            </p>
          </div>
        </div>
      </div>
      <!-- main content section end  -->

      <footer>
        <div class="text-center">
          <div class="line"></div>
          <q-img fit="contain" src="/logo.6e466c62.png" />
        </div>
      </footer>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// import { Todo, Meta } from 'components/models';
// import { ref } from 'vue';
// import UnsplashImageSelector from 'components/UnsplashImageSelector.vue';

import { onMounted } from 'vue';
import StoryPlayer from 'components/StoryPlayer.vue';
import { usePublicStore } from '../stores/public';

const publicStore = usePublicStore();
onMounted(() => {
  console.log('onMounted home page');
  publicStore.loadHomePageStory();
});
</script>
