import { storyUpdateable } from 'components/updateable';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { api } from '../boot/axios';
import { AudioTextRefPoint, Card, Story, newStory } from '../components/models';
import { storyValidator, validateThisObj } from '../components/validators';

export const useStoryStore = defineStore('story', {
  state: () => ({
    stories: [] as Story[],
    notSavedStories: [] as newStory[],
    story: null as null | Story,
    newStory: {} as newStory,
    card: null as null | Card,
    word: {} as AudioTextRefPoint,
    dashboardSelectedChapter: null as any,
    backgroundImageList: [
      { id: 1, thumbnail: '/bg/bg1-sm.jpg', xl: '/bg/bg1.jpg' },
      { id: 1, thumbnail: '/bg/bg2-sm.jpg', xl: '/bg/bg2.jpg' },
      { id: 1, thumbnail: '/bg/bg3-sm.jpeg', xl: '/bg/bg3.jpeg' },
      { id: 1, thumbnail: '/bg/bg4-sm.jpeg', xl: '/bg/bg4.jpeg' },
      { id: 1, thumbnail: '/bg/bg5-sm.jpeg', xl: '/bg/bg5.jpeg' },
      { id: 1, thumbnail: '/bg/bg6-sm.jpeg', xl: '/bg/bg6.jpeg' },
      { id: 1, thumbnail: '/bg/bg7-sm.jpeg', xl: '/bg/bg7.jpeg' },
      { id: 1, thumbnail: '/bg/bg8-sm.jpeg', xl: '/bg/bg8.jpeg' },
      { id: 1, thumbnail: '/bg/bg9-sm.jpg', xl: '/bg/bg9.jpg' },
      { id: 1, thumbnail: '/bg/bg10-sm.jpg', xl: '/bg/bg10.jpg' },
    ],
  }),
  getters: {
    currentStory: (state) => {
      return state.story || null;
    },
    currentCard: (state) => {
      return state.card || null;
    },
    activeRefPoints: (state) => {
      return state.story?.cards.map((c) => c.word.start) || [];
    },
    getCardByTimestamp: (state) => (timestamp: number) => {
      if (state.story) {
        return state.story.cards.find((c) => c.word.start === timestamp);
      }
      return null;
    },
    storiesFilteredByChapter: (state) => {
      return state.dashboardSelectedChapter
        ? state.stories.filter(
            (s) => s.chapter_id === state.dashboardSelectedChapter.id
          )
        : state.stories;
    },
    getStoryIndexById: (state) => (id: number) => {
      return state.stories.findIndex((obj) => {
        return obj.id === id;
      });
    },
  },
  actions: {
    reset() {
      this.stories = [] as Story[];
      this.notSavedStories = [] as newStory[];
      this.story = {
        cards: [] as Card[],
        title: '',
        thumbnail: '',
      } as Story;
      this.newStory = {} as newStory;
      this.card = null;
      this.word = {} as AudioTextRefPoint;
      this.dashboardSelectedChapter = null as any;
      this.backgroundImageList = [
        { id: 1, thumbnail: '/bg/bg1-sm.jpg', xl: '/bg/bg1.jpg' },
        { id: 2, thumbnail: '/bg/bg2-sm.jpg', xl: '/bg/bg2.jpg' },
        { id: 3, thumbnail: '/bg/bg3-sm.jpeg', xl: '/bg/bg3.jpeg' },
        { id: 4, thumbnail: '/bg/bg4-sm.jpeg', xl: '/bg/bg4.jpeg' },
        { id: 5, thumbnail: '/bg/bg5-sm.jpeg', xl: '/bg/bg5.jpeg' },
        { id: 6, thumbnail: '/bg/bg6-sm.jpeg', xl: '/bg/bg6.jpeg' },
        { id: 7, thumbnail: '/bg/bg7-sm.jpeg', xl: '/bg/bg7.jpeg' },
        { id: 8, thumbnail: '/bg/bg8-sm.jpeg', xl: '/bg/bg8.jpeg' },
        { id: 9, thumbnail: '/bg/bg9-sm.jpg', xl: '/bg/bg9.jpg' },
        { id: 10, thumbnail: '/bg/bg10-sm.jpg', xl: '/bg/bg10.jpg' },
      ];
    },

    loadDummyNewStory() {
      this.story = {
        audio_id: 1,
        cards: [
          {
            type: 'url',
            data: {
              url: 'abc.com',
              title: 'Awesome news',
              source: 'abc news',
              image: '',
            },
            word: { start: 1.2, word: 'hello' },
          },
          {
            type: 'quote',
            data: { quote: 'Sample Quote', author: 'aa' },
            word: { start: 6.4, word: '4' },
          },
          {
            type: 'highlight',
            data: { word: 'highlighted text' },
            word: { start: 8.6, word: 'hellow' },
          },
          {
            type: 'quote',
            data: { quote: 'asdsda', author: 'aa' },
            word: { start: 2.5, word: '2' },
          },
        ] as Card[],

        title: '',
        thumbnail: '',
      } as Story;
    },
    loadNewStory() {
      this.story = {
        cards: [] as Card[],
        title: '',
        thumbnail: '',
        background_volume: 0.2,
      } as Story;
    },

    addCardToAStory(card: Card) {
      if (this.story && this.story.cards) {
        this.story.cards.push(card);
      } else {
        // TODO: do things right
        console.log('no story');
        console.log(this.story);
      }
    },

    async addNewStory() {
      // post request to API
      try {
        const validationResult = validateThisObj(this.story, storyValidator);
        if (validationResult.length === 0) {
          // post request to backend API
          // stringify the json
          // const payload = Object.assign({}, this.story as any);
          // payload.cards = JSON.stringify(payload.cards);
          // payload.thumbnail = JSON.stringify(payload.thumbnail);
          // console.log({ payload });

          console.log('story in store', this.story);
          const payload = Object.assign({}, this.story) as any;
          payload.cards = payload.cards;
          console.log('payload', payload);

          const res = await api.post('/story/new', payload);
          console.log({ res });
          if (res.data.success) {
            return { success: true };
          } else {
            console.log(res);
            return { error: true, message: res.data.message };
          }
        } else {
          return false;
        }

        // tmp save story locally
        // newStory.tmpId = 'tid' + new Date().getTime();
        // await this.notSavedStories.push(newStory);
      } catch (error) {
        console.log(error);
        Notify.create({
          type: 'negative',
          message: 'Something went wrong. Story has not been created yet.',
        });
        return { success: false, savedLocally: false, error };
      }
    },

    async getStories() {
      console.log('getStories');
      try {
        const res = await api.get('/story/user');
        if (res.data.success && res.data.data.stories) {
          // this.stories = [];
          // TODO: no need of loop
          this.stories = res.data.data.stories;
          console.log('res stories', res.data.data.stories);
          console.log('this. stories', this.stories);
          // res.data.data.stories.forEach((story: any) => {
          //   this.stories.push(story);
          // });
          // console.log('getStories', res);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },

    async delete(id: number) {
      try {
        if (id || id === 0) {
        }
        const payload = {
          data: {
            id: id,
          },
        };
        const res = await api.delete('/story/delete', payload);
        if (res.data.success) {
          await this.getStories();
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    removeCardFromCurrentStoryByTimestamp(timestamp: number) {
      if (this.story) {
        this.story.cards = this.story?.cards.filter(
          (c) => c.word.start !== timestamp
        );
      }
    },

    async selectStoryForUpdateByUID(uuid: any) {
      if (!uuid) {
        return false;
      }
      console.log('selectStoryForUpdateByUID uuid > ', uuid);
      this.story = null;
      this.story = this.stories?.find((s) => s.uuid === uuid) || null;
      // TODO: pagenation prov > if story not found serach story on backend
      // it is necessery when there is lots of story and my stories page has pagenation
      console.log('selectStoryForUpdateByUID this.story > ', this.story);
    },

    async updateStory(obj: any) {
      console.log('pinia updateStory ', obj);
      const payload = {} as any;
      if (!obj.id) return false;
      storyUpdateable.forEach((key) => {
        if (obj[key]) {
          payload[key] = obj[key];
        }
      });
      try {
        if (Object.keys(payload).length > 0) {
          payload.id = obj.id;
          const res = await api.post('/story/new', payload);
          return res.data?.success;
        }
      } catch (error) {
        return false;
      }
    },

    async publishCurrentStory() {
      if (this.story) {
        this.story['status'] = 'published';
      }
    },
    async changeBg(id: number, bg_url: string) {
      try {
        const storyIndex = this.getStoryIndexById(id);
        if (storyIndex !== -1) {
          const updates = Object.assign(this.stories[storyIndex], {
            background_image: bg_url,
          });
          const res = await this.updateStory(updates);

          if (res) {
            this.stories[storyIndex].background_image = bg_url;
            return true;
          } else {
            return false;
          }
        }
      } catch (error) {
        return false;
      }
    },
  },
});
