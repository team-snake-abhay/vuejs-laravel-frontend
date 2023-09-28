<template>
  <q-spinner color="primary" v-if="loading" class="q-uploader__spinner" />
  <div v-else-if="publicStore.story" class="story-player-area">
    <q-card class="player-card">
      <div class="row">
        <div class="col-12 cardArea" v-if="publicStore.loading">
          <q-spinner />
        </div>
        <div
          v-else
          class="col-12 bg-nwhite q-pa-lg cardArea"
          id="cardScrollArea"
        >
          <!-- {{ cardList }} -->
          <div id="cardStartPoint" class="thumbnailCard">
            <ThumbnailCard
              v-if="publicStore.story?.title && publicStore.story?.title !== ''"
              :title="publicStore.story?.title"
              :thumbnail="publicStore.story?.thumbnail"
            ></ThumbnailCard>
          </div>
          <div
            v-for="(card, index) in publicStore.cardsOrderByTime"
            :key="index"
            :id="'card_' + index"
          >
            <DefinitionCard
              v-if="card.type === 'definition'"
              :definition="card.data.definition"
              :term="card.data.term"
            ></DefinitionCard>

            <HighlightCard
              v-if="card.type === 'highlight'"
              :text="card.data.text"
            ></HighlightCard>

            <ImageCard
              v-if="card.type === 'image'"
              :image-obj="card.data"
            ></ImageCard>

            <ListCard
              v-if="card.type === 'list'"
              :list-obj="card.data"
            ></ListCard>

            <ProfileCard
              v-if="card.type === 'profile'"
              :profileObj="card.data"
            ></ProfileCard>

            <QuoteCard
              v-if="card.type === 'quote'"
              :quote="card.data.quote"
              :author="card.data.author"
            ></QuoteCard>

            <UrlCard v-if="card.type === 'url'" :url-obj="card.data"></UrlCard>
            <CTAButton
              v-if="card.type === 'cta'"
              :text="card.data.text"
              :link="card.data.link"
            ></CTAButton>
          </div>
        </div>
        <AudioPlayer
          v-if="publicStore.story.audio_url"
          v-model:playTime="playedTime"
          @onAudioEnd="reset"
          :audio="publicStore.story.audio_url"
          :totalDuration="publicStore.story.audio_meta_info?.audio_length || 0"
          :background_audio="publicStore.story.background_audio || ''"
          :background_volume="publicStore.story.background_volume || 0.2"
        ></AudioPlayer>
      </div>

      <a
        v-if="ownerSubscription === 'basic'"
        href="/"
        style="position: absolute; bottom: 0px; right: 4px"
        ><img
          src="~assets/watermark.jpeg"
          height="50"
          style="mix-blend-mode: multiply"
        />
      </a>
    </q-card>

    <div v-if="interaction" class="row">
      <div class="col-12 text-center q-py-md q-mt-md">
        <q-btn-group flat class="bg-nwhite">
          <q-btn
            :disable="publicStore.currentUserReaction === 'like'"
            flat
            rounded
            @click="publicStore.storeReaction('like')"
            dense
            size="md"
            >👍</q-btn
          >
          <q-btn
            :disable="publicStore.currentUserReaction === 'dislike'"
            flat
            rounded
            @click="publicStore.storeReaction('dislike')"
            dense
            size="md"
            >👎</q-btn
          >
          <q-btn
            :disable="publicStore.currentUserReaction === 'heart'"
            flat
            rounded
            @click="publicStore.storeReaction('heart')"
            dense
            size="md"
            >💖</q-btn
          >
          <q-btn
            :disable="publicStore.currentUserReaction === 'satisfied'"
            flat
            rounded
            @click="publicStore.storeReaction('satisfied')"
            dense
            size="md"
            >😊</q-btn
          >
          <q-btn
            :disable="publicStore.currentUserReaction === 'sad'"
            flat
            rounded
            @click="publicStore.storeReaction('sad')"
            dense
            size="md"
            >😟</q-btn
          >
          <q-btn
            :disable="publicStore.currentUserReaction === 'angry'"
            flat
            rounded
            @click="publicStore.storeReaction('angry')"
            dense
            size="md"
            >😡</q-btn
          >
        </q-btn-group>
      </div>
      <div class="col-12 q-px-sm q-py-md q-mb-md">
        <span class="text-ndark text-bold">Write a comment</span>
        <q-input
          outlined
          v-model="commentInput"
          placeholder="Awesome story"
          dense
          :disable="sendingComment"
          autogrow
          @keyup.enter.prevent="sendComment"
        >
          <template v-slot:append>
            <q-btn
              class="text-ndark-3"
              flat
              style="margin-right: -10px"
              @click="sendComment"
              :loading="sendingComment"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-send"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="10" y1="14" x2="21" y2="3"></line>
                <path
                  d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"
                ></path>
              </svg>
            </q-btn>
          </template>
        </q-input>
      </div>

      <div
        class="col-12 q-px-sm q-py-md q-mb-lg"
        v-if="isOwnStory && !!publicStore.comments.length"
      >
        <span class="text-ndark text-bold">Comments</span>
        <q-list class="bg-nwhite rounded-1">
          <q-item v-for="c in publicStore.comments" :key="c.id">
            <q-item-section>
              <q-item-label>{{ c.name }}</q-item-label>
              <q-item-label caption>{{ c.comment }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>{{
                date.formatDate(c.created_at, 'MMM Do  YY')
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
  <div v-else class="text-center">
    <div class="text-cent">
      Ops! Story not found Or you don't sufficient permission.
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePublicStore } from '../stores/public';
import ThumbnailCard from '../components/story-card/ThumbnailCard.vue';
import DefinitionCard from '../components/story-card/DefinitionCard.vue';
import HighlightCard from '../components/story-card/HighlightCard.vue';
import ImageCard from '../components/story-card/ImageCard.vue';
import ListCard from '../components/story-card/ListCard.vue';
import ProfileCard from '../components/story-card/ProfileCard.vue';
import QuoteCard from '../components/story-card/QuoteCard.vue';
import UrlCard from '../components/story-card/UrlCard.vue';
import CTAButton from '../components/story-card/CTAButton.vue';
import AudioPlayer from '../components/AudioPlayer.vue';
import { onMounted, ref, watch, computed } from 'vue';

import { date } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
const props = defineProps({
  loading: {
    type: Boolean,
    require: true,
  },
  interaction: {
    type: Boolean,
    default: true,
    require: false,
  },
});
// const store = useStoryStore();
const publicStore = usePublicStore();
const authStore = useAuthStore();
const scrollTo = (val: string) => {
  // console.log('called scrollTo' + val);
  const el = document.getElementById(val);
  const scrollArea = document.getElementById('cardScrollArea');
  // console.log(el);
  if (el && scrollArea) {
    // console.log(el.offsetTop + el.offsetHeight);
    scrollArea.scrollTo(0, el.offsetTop + el.offsetHeight - 470);
  }
};

const playedTime = ref(0);
const commentInput = ref('');
const sendingComment = ref(false);
const prevCardTime = ref(0);

const isOwnStory = computed(
  () => !!authStore.id && authStore.id === publicStore.story?.user_id
);
const ownerSubscription = computed(() =>
  isOwnStory.value
    ? authStore.subscription
    : publicStore.story?.ownerSubscription || 'basic'
);

const nextCard = computed(
  () => publicStore.cardsIds.find((c) => c.t > prevCardTime.value) || null
);

const reset = () => {
  prevCardTime.value = 0;
};

watch(playedTime, (newVal: number, oldVal: number) => {
  // console.count('watching n = ' + newVal + ' o = ' + oldVal);
  if (prevCardTime.value > newVal) {
    prevCardTime.value = newVal;
  }
  if (newVal < 0.4) {
    scrollTo('cardStartPoint');
  } else if (newVal > oldVal) {
    // console.count('increased');
    // increased 1 second
    if (
      nextCard.value &&
      (newVal == nextCard.value.t || newVal > nextCard.value.t)
    ) {
      while (
        nextCard.value &&
        (newVal == nextCard.value.t || newVal > nextCard.value.t)
      ) {
        scrollTo(nextCard.value.id);
        prevCardTime.value = nextCard.value.t;
      }
    }
    // search any card between lastCardScroll to new playedTime
    // // no cards activated || activated
    // // // one card or multiple card activated?
  } else if (oldVal > newVal) {
    // console.log(newVal + ' decreased ' + oldVal);
    // decreased
    if (nextCard.value) {
      prevCardTime.value = newVal;
      const currentCardIndex =
        nextCard.value.index > 0 ? nextCard.value.index - 1 : 0;
      scrollTo('card_' + currentCardIndex);
    }
  }
});

const sendComment = async () => {
  sendingComment.value = true;
  const res = await publicStore.storeComment(commentInput.value);
  if (res) {
    commentInput.value = '';
  }
  commentInput.value = '';
  sendingComment.value = false;
};

onMounted(() => {
  // console.log('story player onMounted');
});
</script>

<style lang="scss" scoped>
.story-player-area {
  width: 373px;
  height: auto;
}
.story-player-area .player-card {
  height: 624px;
  overflow: hidden;
}
.cardArea {
  height: 500px;
  overflow-y: auto;
}
.audioPlayerArea {
  height: 81px;
}

#cardScrollArea {
  scroll-behavior: smooth;
}
</style>
