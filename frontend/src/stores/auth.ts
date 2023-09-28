import { defineStore } from 'pinia';
import { LoginRequestObj, User, Subscription } from 'components/models';
import { api } from 'boot/axios';
import { LocalStorage, Notify } from 'quasar';
import { useStoryStore } from './story';
import { useChapterStore } from './chapter';
import { PermissionList, StoryCount } from 'components/models';

const storyStore = useStoryStore();
const chapterStore = useChapterStore();
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    id: null as null | number,
    name: null as null | string,
    email: null as null | string,
    subscription: 'basic' as Subscription,
    storyCount: {} as StoryCount,
  }),
  getters: {
    permission: (state): PermissionList => {
      if (state.subscription === 'recurring') {
        return {
          // recurring pkg
          pass: true,
          embPlayer: true,
          chapter: true,
          stryCmnt: true,
          dailyStoryLimit: 15,
          monthlyStoryLimit: 45,
          storyLength: 300,
          imageSearch: true,
          backgroundMusic: true,
          cta: true,
        };
      } else if (state.subscription === 'proplus') {
        return {
          // proplus pkg
          pass: true,
          embPlayer: true,
          chapter: true,
          stryCmnt: true,
          dailyStoryLimit: 5,
          monthlyStoryLimit: 30,
          storyLength: 180,
          imageSearch: true,
          backgroundMusic: true,
          cta: true,
        };
      } else if (state.subscription === 'pro') {
        return {
          // pro pkg
          pass: false,
          embPlayer: false,
          chapter: true,
          stryCmnt: true,
          dailyStoryLimit: 5,
          monthlyStoryLimit: 30,
          storyLength: 180,
          imageSearch: true,
          backgroundMusic: true,
          cta: true,
        };
      } else if (state.subscription === 'basic') {
        // basic pkg
        return {
          pass: false,
          embPlayer: false,
          chapter: false,
          stryCmnt: false,
          dailyStoryLimit: 5,
          monthlyStoryLimit: 30,
          storyLength: 90,
          imageSearch: false,
          backgroundMusic: false,
          cta: false,
        };
      } else {
        return {
          pass: false,
          embPlayer: false,
          chapter: false,
          stryCmnt: false,
          dailyStoryLimit: 5,
          monthlyStoryLimit: 30,
          storyLength: 0,
          imageSearch: false,
          backgroundMusic: false,
          cta: false,
        };
      }
    },
  },
  actions: {
    async login(form: LoginRequestObj): Promise<boolean> {
      return api
        .post('/login', form)
        .then((res) => {
          console.log(res);
          // set Bearer token to api header
          const token = 'Bearer ' + res.data.access_token;
          console.log('packg', res);
          const user = {
            id: res.data.user.id,
            name: res.data.user.name,
            email: res.data.user.email,
            subscription: res.data.user.subscription || 'basic',
          };

          console.log('packg user', user);
          api.defaults.headers.common['Authorization'] = token;
          LocalStorage.set('token', token);
          // TODO: get user from db with token instead of saving it on the app
          LocalStorage.set('user', user);

          // update user data in
          this.setUserData(res.data.user);

          Notify.create({
            type: 'positive',
            message: 'Athentication successfull.',
          });

          return true;
        })
        .catch((err) => {
          console.log('err', err);
          Notify.create({
            type: 'negative',
            message: 'Unsuccessful attempt!',
          });
          return false;
        });
    },

    async syncUserFromDB(): Promise<boolean> {
      return api
        .post('/user', { id: this.id })
        .then((res) => {
          console.log('syncUserFromDB', res);
          if (res.data.data.story_limit) {
            console.log('res.data.data.story_limit');
            this.storyCount = res.data.data.story_limit;
          } else if (res.data.data.story_count) {
            console.log('res.data.data.story_count');
            this.storyCount = res.data.data.story_count;
          }
          if (res.data.data.user) {
            this.user = res.data.data.user;
            this.subscription = this.user.subscription || 'basic';
          }
          return true;
        })
        .catch((err) => {
          console.log('err response', err.response);
          if (err.response && err.response.data.message == 'Unauthenticated.') {
            console.log('log out the user');
            this.logout();
            Notify.create({
              type: 'info',
              message: 'Authentication failed. Please try login again',
            });
          } else {
            console.log('err', err);
            Notify.create({
              type: 'negative',
              message: 'Unsuccessful attempt!',
            });
          }
          return false;
        });
    },

    async changePassword(password: string): Promise<boolean> {
      const payload = {
        password,
      };
      return api
        .post('/user/change-password', payload)
        .then((res) => {
          if (res.data.success) {
            this.logout();
            Notify.create({
              type: 'positive',
              message: 'Password Changed successfully.',
            });
            return true;
          } else {
            return false;
          }
        })
        .catch((err) => {
          console.log('err', err);
          Notify.create({
            type: 'negative',
            message: 'Unsuccessful attempt!',
          });
          return false;
        });
    },

    reset() {
      this.user = null;
      this.id = null;
      this.name = '';
      this.email = '';
      this.subscription = 'basic';
      this.storyCount = {} as StoryCount;
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.reset();
      storyStore.reset();
      chapterStore.reset();
      this.router.push({ name: 'login' });
    },

    setUserData(user: User) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.subscription = user.subscription || 'basic';
      this.user = user;
      this.syncUserFromDB();
    },

    initData() {
      chapterStore.loadData();
    },
  },
});
