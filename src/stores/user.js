import { defineStore } from 'pinia';
import { login } from '@/network';

const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    name: '',
    avatar: '',
    isAdmin: false,
    hasPermission: false,
  }),
  getters: {
  },
  actions: {
    async login() {
      const res = await login();
      if (Number(res.state) !== 0) {
        return Promise.reject(res);
      }
      this.name = res.name;
      this.avatar = res.avatar;
      this.isAdmin = res.isAdmin || false;
      this.hasPermission = true;
    },
  },
});

export default useUserStore;
