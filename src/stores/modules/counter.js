import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCountStore = defineStore(
  'big-counter',
  () => {
    const count = ref(100)
    const addCount = (n) => {
      count.value += n
    }

    return {
      count,
      addCount
    }
  }
  /* {
    persist: true
  } */
)
