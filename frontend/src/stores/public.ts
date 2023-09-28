import { defineStore } from 'pinia';
import { Card, Story, PublicStory, Reaction } from '../components/models';
// import { validateThisObj, storyValidator } from '../components/validators';
import { api } from '../boot/axios';
import { useAuthStore } from './auth';
// import { Notify } from 'quasar';

const authStore = useAuthStore();

export const usePublicStore = defineStore('public', {
  state: () => ({
    story: null as null | PublicStory,
    loading: false,
    commentLoading: false,
    sampleAudio: 'http://localhost:9000/helloo1234.mp3',
    pw: '',
    userReactions: {} as any,
    homePageStory: {
      cards: [
        {
          type: 'image',
          data: {
            caption: 'Affiliate Marketing',
            image:
              'https://images.unsplash.com/photo-1587614313085-5da51cebd8ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjMxMDF8MHwxfHNlYXJjaHw5fHxtYXJrZXRpbmd8ZW58MHx8fHwxNjc2NzAxNzA3&ixlib=rb-4.0.3&q=80&w=1080',
          },
          word: { word: 'affiliate', start: 1.1 },
        },
        {
          type: 'image',
          data: {
            caption: 'Smart and Interactive Storytelling Made Easy',
            image:
              'https://gc.storify.work/storage/uploads/images/I_63f0704137365.png',
          },
          word: { word: 'storify,', start: 2 },
        },
        {
          type: 'image',
          data: {
            caption: 'review products',
            image:
              'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjMxMDF8MHwxfHNlYXJjaHwyfHxyZXZpZXclMjBwcm9kdWN0c3xlbnwwfHx8fDE2NzY3MDE4NTU&ixlib=rb-4.0.3&q=80&w=1080',
          },
          word: { word: 'review', start: 6.2 },
        },
        {
          type: 'quote',
          data: { quote: 'share the reviews with your audience', author: null },
          word: { word: 'share', start: 7.2 },
        },
        {
          type: 'highlight',
          data: { text: 'to go a step further' },
          word: { word: 'the', start: 9.5 },
        },
        {
          type: 'url',
          data: {
            url: 'bitly.com',
            title: 'You Affiliate Link Here',
            source: 'Boost Sales',
            image: null,
          },
          word: { word: 'even', start: 10.6 },
        },
        {
          type: 'image',
          data: {
            caption: 'boost affiliate commissions',
            image:
              'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjMxMDF8MHwxfHNlYXJjaHw0fHxzYWxlc3xlbnwwfHx8fDE2NzY3MDIwMjY&ixlib=rb-4.0.3&q=80&w=1080',
          },
          word: { word: 'boost', start: 14 },
        },
      ],
      title: 'Storify For Affiliate Marketers',
      pw: null,
      audio_id: 14,
      chapter_id: 0,
      user_id: 7,
      thumbnail:
        'https://images.unsplash.com/photo-1533750516457-a7f992034fec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjMxMDF8MHwxfHNlYXJjaHw3fHxhZmZpbGlhdGUlMjBtYXJrZXRpbmd8ZW58MHx8fHwxNjc2NzAyMDcy&ixlib=rb-4.0.3&q=80&w=1080',
      total_view: 22,
      like: 0,
      dislike: 0,
      heart: 0,
      satisfied: 0,
      sad: 0,
      angry: 0,
      uuid: '63f0719b5eb93',
      background_audio: '/inspired-ambient.mp3',
      status: 'draft',
      created_at: '2023-02-18T06:35:07.000000Z',
      updated_at: '2023-02-18T11:52:48.000000Z',
      user_name: 'max',
      audio_url:
        'https://gc.storify.work/storage/uploads/audios/A_63eeaca10d99e.wav',
    } as any,
    comments: [] as any[],
  }),
  getters: {
    cardsOrderByTime(): Card[] {
      return (
        this.story?.cards.sort((a, b) => a.word.start - b.word.start) || []
      );
    },
    cardsIds(): any[] {
      return this.cardsOrderByTime.map((c, index) => ({
        t: c.word.start,
        id: 'card_' + index,
        index: index,
      }));
    },
    currentUserReaction(): null | Reaction {
      // return this.story && this.userReactionsToStory[this.story.id]
      //   ? this.userReactionsToStory[this.story.id]
      //   : null;
      return null;
    },
  },
  actions: {
    reset() {
      this.story = null;
      this.loading = false;
      this.sampleAudio = 'http://localhost:9000/helloo1234.mp3';

      this.userReactions = {};
      this.homePageStory = {
        cards: [
          {
            type: 'image',
            data: {
              caption: 'Affiliate Marketing',
              image:
                'https://images.unsplash.com/photo-1587614313085-5da51cebd8ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjMxMDF8MHwxfHNlYXJjaHw5fHxtYXJrZXRpbmd8ZW58MHx8fHwxNjc2NzAxNzA3&ixlib=rb-4.0.3&q=80&w=1080',
            },
            word: { word: 'affiliate', start: 1.1 },
          },
          {
            type: 'image',
            data: {
              caption: 'Smart and Interactive Storytelling Made Easy',
              image:
                'https://gc.storify.work/storage/uploads/images/I_63f0704137365.png',
            },
            word: { word: 'storify,', start: 2 },
          },
          {
            type: 'image',
            data: {
              caption: 'review products',
              image:
                'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjMxMDF8MHwxfHNlYXJjaHwyfHxyZXZpZXclMjBwcm9kdWN0c3xlbnwwfHx8fDE2NzY3MDE4NTU&ixlib=rb-4.0.3&q=80&w=1080',
            },
            word: { word: 'review', start: 6.2 },
          },
          {
            type: 'quote',
            data: {
              quote: 'share the reviews with your audience',
              author: null,
            },
            word: { word: 'share', start: 7.2 },
          },
          {
            type: 'highlight',
            data: { text: 'to go a step further' },
            word: { word: 'the', start: 9.5 },
          },
          {
            type: 'url',
            data: {
              url: 'bitly.com',
              title: 'You Affiliate Link Here',
              source: 'Boost Sales',
              image: null,
            },
            word: { word: 'even', start: 10.6 },
          },
          {
            type: 'image',
            data: {
              caption: 'boost affiliate commissions',
              image:
                'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjMxMDF8MHwxfHNlYXJjaHw0fHxzYWxlc3xlbnwwfHx8fDE2NzY3MDIwMjY&ixlib=rb-4.0.3&q=80&w=1080',
            },
            word: { word: 'boost', start: 14 },
          },
        ],
        title: 'Storify For Affiliate Marketers',
        pw: null,
        audio_id: 14,
        chapter_id: 0,
        user_id: 7,
        thumbnail:
          'https://images.unsplash.com/photo-1533750516457-a7f992034fec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjMxMDF8MHwxfHNlYXJjaHw3fHxhZmZpbGlhdGUlMjBtYXJrZXRpbmd8ZW58MHx8fHwxNjc2NzAyMDcy&ixlib=rb-4.0.3&q=80&w=1080',
        total_view: 22,
        like: 0,
        dislike: 0,
        heart: 0,
        satisfied: 0,
        sad: 0,
        angry: 0,
        uuid: '63f0719b5eb93',
        background_audio: null,
        status: 'draft',
        created_at: '2023-02-18T06:35:07.000000Z',
        updated_at: '2023-02-18T11:52:48.000000Z',
        user_name: 'max',
        audio_url:
          'https://gc.storify.work/storage/uploads/audios/A_63eeaca10d99e.wav',
      };
      this.comments = [];
      this.commentLoading = false;
    },
    async getStoryById(id: string) {
      try {
        this.loading = true;
        const res = await api.get('/p/story/' + id);
        if (res.data.success && res.data.data.story) {
          const dataSet = res.data.data.story;
          dataSet.cards = dataSet.cards;
          this.story = dataSet;
          this.loadComment();
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      } finally {
        this.loading = false;
      }
    },
    async storeComment(message: string) {
      if (this.story) {
        const payload = {
          story_id: this.story.id,
          name: 'Anonymous',
          email: '',
          comment: message,
        };
        const res = await api.post('/p/story/comment/new', payload);
        console.log('comment', res);
      } else {
        return false;
      }
    },
    setPw(pw: string) {
      this.pw = pw;
    },
    clearStory() {
      this.story = null;
    },
    confirmSecretCode() {
      if (this.story?.pw && this.story.user_id !== authStore.id) {
        console.log('uuid' + this.story.uuid);
        const pw = prompt('Please enter secret code:', '');
        if (pw === this.story.pw) {
          // pw confirmed > allowed
          this.setPw(pw);
        } else {
          // not allowed
          this.clearStory();
        }
      }
    },
    async storeReaction(reaction: Reaction) {
      if (this.story) {
        // this.userReactionsToStory[this.story.id] = reaction;
        // && this.userReactions[this.story.id]
        const payload = {
          reaction: reaction,
        };
        try {
          const res = await api.post(
            '/p/story/' + this.story.uuid + '/reaction',
            payload
          );
          if (res.data.success) {
            this.userReactions[this.story.id] = reaction;
            return true;
          } else {
            return false;
          }
        } catch (error) {
          return false;
        }
      }
    },
    loadHomePageStory() {
      this.story = this.homePageStory;
    },
    async loadComment() {
      console.log('called loadComment');
      this.comments = [];
      if (this.story) {
        try {
          this.commentLoading = true;

          const payload = {
            story_id: this.story.id,
          };
          const res = await api.post('/p/story/comments', payload);
          if (res.data.success && res.data.data.comments) {
            console.log(res.data.data.comments);
            this.comments = res.data.data.comments;
            return true;
          } else {
            return false;
          }
        } catch (error) {
          return false;
        } finally {
          this.commentLoading = false;
        }
      }
    },
  },
});
