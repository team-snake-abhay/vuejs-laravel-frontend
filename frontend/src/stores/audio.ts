import { defineStore } from 'pinia';
import {
  Audio,
  BackgroundAudio,
  AudioTextRefPoint,
} from '../components/models';
import { api } from '../boot/axios';
import { Notify } from 'quasar';

export const useAudioStore = defineStore('audio', {
  state: () => ({
    audios: [] as Audio[],
    audio: null as null | Audio,
    seleectedAudioIdForNewStory: null as null | number,
    transcribingAudio: [] as any[],
    backgroundAudios: [
      {
        title: 'Ambient Classical Guitar',
        path: '/audio/ambient-classical-guitar.mp3',
      },
      {
        title: 'Ambient Piano Ampamp Strings',
        path: '/audio/ambient-piano-ampamp-strings.mp3',
      },
      {
        title: 'Battle Of The Dragons',
        path: '/audio/battle-of-the-dragons.mp3',
      },
      { title: 'Floating Abstract', path: '/audio/floating-abstract.mp3' },
      { title: 'Jazzy Abstract Beat', path: '/audio/jazzy-abstract-beat.mp3' },
      { title: 'Let It Go', path: '/audio/let-it-go.mp3' },
      { title: 'Lifelike', path: '/audio/lifelike.mp3' },
      { title: 'Powerful Beat', path: '/audio/powerful-beat.mp3' },
      { title: 'Red Tape', path: '/audio/red-tape.mp3' },
      { title: 'Relaxing', path: '/audio/relaxing.mp3' },
      { title: 'Save As', path: '/audio/save-as.mp3' },
      { title: 'Smoke', path: '/audio/smoke.mp3' },
      { title: 'Spirit Blossom', path: '/audio/spirit-blossom.mp3' },
      {
        title: 'Tuesday Glitch Soft Hip Hop',
        path: '/audio/tuesday-glitch-soft-hip-hop.mp3',
      },
      { title: 'Waterfall', path: '/audio/waterfall.mp3' },
    ] as BackgroundAudio[],
  }),
  getters: {
    // getAudioUsabilityByid: (state) => (id:number) => {
    //   const audio = state.audios.find()
    //   return true
    // }

    getAudioIndexById: (state) => (id: number) => {
      const index = state.audios.findIndex((obj) => obj.id === id);
      return index !== -1 ? index : null;
    },
  },
  actions: {
    reset() {
      this.audios = [] as Audio[];
      this.audio = null;
      this.seleectedAudioIdForNewStory = null;
      this.backgroundAudios = [
        {
          title: 'Ambient Classical Guitar',
          path: '/audio/ambient-classical-guitar.mp3',
        },
        {
          title: 'Ambient Piano Ampamp Strings',
          path: '/audio/ambient-piano-ampamp-strings.mp3',
        },
        {
          title: 'Battle Of The Dragons',
          path: '/audio/battle-of-the-dragons.mp3',
        },
        { title: 'Floating Abstract', path: '/audio/floating-abstract.mp3' },
        {
          title: 'Jazzy Abstract Beat',
          path: '/audio/jazzy-abstract-beat.mp3',
        },
        { title: 'Let It Go', path: '/audio/let-it-go.mp3' },
        { title: 'Lifelike', path: '/audio/lifelike.mp3' },
        { title: 'Powerful Beat', path: '/audio/powerful-beat.mp3' },
        { title: 'Red Tape', path: '/audio/red-tape.mp3' },
        { title: 'Relaxing', path: '/audio/relaxing.mp3' },
        { title: 'Save As', path: '/audio/save-as.mp3' },
        { title: 'Smoke', path: '/audio/smoke.mp3' },
        { title: 'Spirit Blossom', path: '/audio/spirit-blossom.mp3' },
        {
          title: 'Tuesday Glitch Soft Hip Hop',
          path: '/audio/tuesday-glitch-soft-hip-hop.mp3',
        },
        { title: 'Waterfall', path: '/audio/waterfall.mp3' },
      ];
    },

    loadDummyAudios() {
      this.audios = [
        {
          title: 'hello 123 ',
          local_path: '',
          transcript: [
            { start: 1.2, word: 'hello' },
            { start: 1.9, word: '1' },
            { start: 2.5, word: '2' },
            { start: 3.7, word: '3' },
            { start: 6.4, word: '4' },
            { start: 6.9, word: '5' },
            { start: 8.0, word: '6' },
            { start: 8.6, word: 'hellow' },
            { start: 8.9, word: 'work' },
          ],
          id: 1,
        },
      ] as Audio[];
    },

    async loadData() {
      console.log('audio > loadData');
      const res = await api.get('/audio/user/all');
      console.log({ res });
      this.audios = res.data.data.mediaObject;
    },

    async selectAudioById(id: number) {
      this.audio = this.audios?.find((s) => s.id == id) || null;
      if (!this.audio) {
        this.audio = await this.getAudioByIDFromDB(id);
        return !!this.audio;
      } else {
        // found locally
        return true;
      }
    },

    async delete(id: number) {
      const payload = {
        data: {
          id: id,
        },
      };
      try {
        console.log('delete try', payload);
        const res = await api.delete('/audio/delete', payload);
        console.log('delete res');
        console.log({ res });
        if (res.data?.success) {
          Notify.create({
            type: 'positive',
            message: 'Audio deleted successfully',
          });
          this.removeAudioById(id);
          return true;
        } else {
          await this.loadData();
          const msg = res.data?.message || "Could't delete the audio";
          Notify.create({
            type: 'negative',
            message: msg,
          });
          return false;
        }
      } catch (error) {
        console.log({ error });
        return false;
      }
    },

    removeAudioById(id: number) {
      const index = this.audios.findIndex((el) => el.id === id);
      if (index > -1) {
        this.audios.splice(index, 1);
      }
    },

    async transcribeByAudioId(id: number | null) {
      console.log('transcribeByAudioId = ' + id);
      if (id) {
        const payload = {
          id: id,
        };
        try {
          const res = await api.post('/audio/transcribe', payload);
          // console.log('transcribe res');
          // console.log({ res });
          await this.loadData();
          if (res.data?.success) {
            Notify.create({
              type: 'positive',
              message: 'Audio Transcribted successfully',
            });
            return true;
          } else {
            const msg = res.data?.message || "Transcription Could't complete";
            Notify.create({
              type: 'negative',
              message: msg,
            });
            return false;
          }
        } catch (error) {
          console.log({ error });
          return false;
        }
      }
    },

    addToTranscriptionList(id: number, fileSize?: number) {
      // console.log('addToTranscriptionList');
      if (this.transcribingAudio.findIndex((obj) => obj.id === id) === -1) {
        // const estimate = fileSize ? fileSize * 0.01574 : 180000;
        const estimate = 180000;
        this.transcribingAudio.push({ id, estimate: estimate });
      } else {
        Notify.create({
          type: 'info',
          message: 'Transcription is on the way',
        });
      }
    },

    removeToTranscriptionList(id: number) {
      const index = this.transcribingAudio.findIndex((a) => a.id === id);
      this.transcribingAudio.splice(index, 1);
    },

    async updateTranscriptionById(
      id: number,
      newTranscript: Array<AudioTextRefPoint>
    ) {
      console.log('updateTranscriptionById = ' + id);
      if (id) {
        const payload = {
          id: id,
          transcript: newTranscript,
        };

        try {
          const res = await api.post('/audio/transcribe/edit', payload);
          if (res.data?.success) {
            const index = this.getAudioIndexById(id);
            if (index && this.audios[index]) {
              this.audios[index].transcript = newTranscript;
            } else {
              await this.loadData();
            }
            Notify.create({
              type: 'positive',
              message: 'Transcript updated successfully',
            });
            return true;
          } else {
            const msg = res.data?.message || "Could't update";
            Notify.create({
              type: 'negative',
              message: msg,
            });
            return false;
          }
        } catch (error) {
          console.log({ error });
          return false;
        }
      }
    },

    async getAudioByIDFromDB(id: number) {
      try {
        const res = await api.post('/audio/id', { id: id });
        if (res.data.success) {
          this.addAudioToLocalList(res.data.data.mediaObject);
          return res.data.data.mediaObject;
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    },

    addAudioToLocalList(audio: Audio) {
      const audioIndex = this.audios?.findIndex((s) => s.id == audio.id);
      if (audioIndex !== -1) {
        this.audios[audioIndex] = audio;
      } else {
        this.audios.push(audio);
      }
    },
  },
});
