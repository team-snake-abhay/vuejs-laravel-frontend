import { defineStore } from 'pinia';
import { Chapter } from '../components/models';
import { api } from '../boot/axios';

export const useChapterStore = defineStore('chapter', {
  state: () => ({
    chapters: [] as Chapter[],
    chapter: {} as Chapter,
  }),
  getters: {
    chapterList(): string[] {
      return this.chapters.map((c) => c.name);
    },
  },
  actions: {
    reset() {
      this.chapters = [] as Chapter[];
      this.chapter = {} as Chapter;
    },

    loadDummyChapters() {
      this.chapters = [] as Chapter[];
    },

    async loadData() {
      console.log('chapter > loadData');
      const res = await api.get('/chapter/user');
      console.log({ res });
      this.chapters = res.data.data.chapters;
    },

    // saveChapterData() {

    // },

    async addNewChapter(chapter_name: string) {
      console.log('add new chapter from store');
      console.log('hello you are not noticing me ', chapter_name);
      // post request to API
      // const bodyFormData = new FormData();
      // bodyFormData.append('name', name);
      const payload = { name: chapter_name };

      // tmp save chapter locally
      try {
        const res = await api.post('/chapter/new', payload);
        console.log('chapter added res ', res);
        this.chapters.push(res.data.data.chapter);
        return { success: true, savedLocally: true };
      } catch (error) {
        console.log(error);
        return { success: false, savedLocally: false, error };
      }
    },
  },
});
