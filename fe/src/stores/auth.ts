import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useUser } from '@clerk/vue'

export const useAuthStore = defineStore('auth', () => {
  const { isSignedIn, user } = useUser();
  const token = ref(null)


  return {
    user,
    token,

    isSignedIn,
  }
})