import { Notify } from 'quasar';

Notify.setDefaults({
  position: 'bottom-right',
  timeout: 4500,
  actions: [{ icon: 'close', color: 'white' }],
});
