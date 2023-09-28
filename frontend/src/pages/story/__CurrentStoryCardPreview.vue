<template>
  <div
    class="story-card-preview-area bg-nwhite shadow-1 rounded-1"
    :class="{ 'max-content-height': $q.screen.gt.sm }"
  >
    <div class="text-h3">Story Cards</div>
    <!-- {{ newStory }} -->
    <div v-if="store.story && !isLoading">
      <div class="thumbnailCard">
        <ThumbnailCard
          v-if="store.story.title && store.story.title !== ''"
          :title="store.story.title"
          :thumbnail="store.story.thumbnail"
        ></ThumbnailCard>
      </div>
      <div v-for="(card, index) in store.story.cards" :key="index">
        <!-- {{ card.data.quote }} -->

        <DefinitionCard
          v-if="card.type === 'definition'"
          :definition="card.data.definition"
          :term="card.data.term"
          :editable="true"
          @delete="store.removeCardFromCurrentStoryByTimestamp(card.word.start)"
          @edit="$emit('editCard', card)"
        ></DefinitionCard>

        <HighlightCard
          v-else-if="card.type === 'highlight'"
          :text="card.data.text"
          :editable="true"
          @delete="store.removeCardFromCurrentStoryByTimestamp(card.word.start)"
          @edit="$emit('editCard', card)"
        ></HighlightCard>

        <ImageCard
          v-else-if="card.type === 'image'"
          :image-obj="card.data"
          :editable="true"
          @delete="store.removeCardFromCurrentStoryByTimestamp(card.word.start)"
          @edit="$emit('editCard', card)"
        ></ImageCard>

        <ListCard
          v-else-if="card.type === 'list'"
          :list-obj="card.data"
          :editable="true"
          @delete="store.removeCardFromCurrentStoryByTimestamp(card.word.start)"
          @edit="$emit('editCard', card)"
        ></ListCard>

        <ProfileCard
          v-else-if="card.type === 'profile'"
          :profileObj="card.data"
          :editable="true"
          @delete="store.removeCardFromCurrentStoryByTimestamp(card.word.start)"
          @edit="$emit('editCard', card)"
        ></ProfileCard>

        <QuoteCard
          v-else-if="card.type === 'quote'"
          :quote="card.data.quote"
          :author="card.data.author"
          :editable="true"
          @delete="store.removeCardFromCurrentStoryByTimestamp(card.word.start)"
          @edit="$emit('editCard', card)"
        ></QuoteCard>

        <UrlCard
          v-else-if="card.type === 'url'"
          :url-obj="card.data"
          :editable="true"
          @delete="store.removeCardFromCurrentStoryByTimestamp(card.word.start)"
          @edit="$emit('editCard', card)"
        ></UrlCard>

        <CTAButton
          v-else-if="card.type === 'cta'"
          :text="card.data.text"
          :link="card.data.link"
          :editable="true"
          @delete="store.removeCardFromCurrentStoryByTimestamp(card.word.start)"
          @edit="$emit('editCard', card)"
        ></CTAButton>
      </div>
      <div
        v-if="!store.story.cards || !store.story.cards.length"
        class="text-center text-ndark-2"
      >
        -- no cards added yet --
      </div>
    </div>

    <div v-else class="text-center">
      <q-spinner></q-spinner>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoryStore } from 'src/stores/story';
import ThumbnailCard from '../../components/story-card/ThumbnailCard.vue';
import DefinitionCard from '../../components/story-card/DefinitionCard.vue';
import HighlightCard from '../../components/story-card/HighlightCard.vue';
import ImageCard from '../../components/story-card/ImageCard.vue';
import ListCard from '../../components/story-card/ListCard.vue';
import ProfileCard from '../../components/story-card/ProfileCard.vue';
import QuoteCard from '../../components/story-card/QuoteCard.vue';
import UrlCard from '../../components/story-card/UrlCard.vue';
import CTAButton from '../../components/story-card/CTAButton.vue';

const store = useStoryStore();
const props = defineProps({
  isLoading: {
    default: true,
  },
});
</script>

<style lang="scss" scoped></style>
