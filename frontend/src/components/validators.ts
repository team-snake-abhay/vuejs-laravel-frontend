import { format } from 'quasar';
// destructuring to keep only what is needed
const { capitalize } = format;

export const isValidUrl = (v: string): boolean =>
  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(
    v
  );
export const isValueProvided = (v: any) => /.+/.test(v);
export const storyValidator = {
  cards: {
    required: true,
    validate: (v: any) => (Array.isArray(v) ? true : 'Incorrect Cards value'),
  },
  title: {
    required: true,
    validate: (v: any) => /.+/.test(v),
  },
  audio_id: {
    required: true,
    validate: (v: any) => (Number.isInteger(v) ? true : 'Invalid audio'),
  },
};

export const validateThisObj = (obj: any, validator: any) => {
  const keys = Object.keys(validator);
  const messages: string[] = [];
  keys.forEach((k) => {
    if (!obj[k]) {
      if (validator[k].required) messages.push(capitalize(k) + ' is required');
    } else {
      const result = validator[k].validate(obj[k]);
      if (result !== true) {
        messages.push(result);
      }
    }
  });

  return messages;
};
