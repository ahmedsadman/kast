import axios from 'axios';

import { User } from './types';

const BASE_URL = 'http://localhost:3005';

export const pollUserDetails = (userId: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const data = await axios.get(`${BASE_URL}/user/${userId}`).then((res) => res.data);

        if (data.user.id) {
          clearInterval(interval);
          resolve(data.user);
        }
      } catch (err) {
        console.log('error occured ', err);
        reject(err);
      }
    }, 1000);
  });
};
