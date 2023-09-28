import { boot } from 'quasar/wrappers';
import { LocalStorage, Notify } from 'quasar';
import { User } from '../components/models';
import { api } from './axios';
// import { root } from 'src/stores/auth';
import { useAuthStore } from 'src/stores/auth';
export default boot(({ router }) => {
  const storeAuth = useAuthStore();
  console.log('router-auth');
  // check for user info from
  const token = LocalStorage.getItem('token');
  api.defaults.headers.common['Authorization'] = token;
  if (token) {
    const user = LocalStorage.getItem('user');
    storeAuth.setUserData(user as User);
    console.log('calling init data');
    storeAuth.initData();
  }

  // console.log('this is for restoring token');
  // console.log({ token, user });

  // Routing guard
  router.beforeEach((to, from, next) => {
    const localStorageToken = LocalStorage.getItem('token');

    if (to.meta.requiresAuth && !(storeAuth.id && !!localStorageToken)) {
      Notify.create({
        type: 'info',
        message: 'Please login first',
      });
      window.location.href = '/login';

      // next({ name: 'login' });
    } else if (to.meta.onlyUnauthorized && storeAuth.id) {
      next({ name: 'dashboard' });
    } else if (to.name === 'dashboard') {
      // console.log('trying Dashboard page');
      if (storeAuth.id) {
        next();
      } else {
        window.location.href = '/login';
      }
    } else {
      console.log('going to next page');
      next();
    }
  });
});
