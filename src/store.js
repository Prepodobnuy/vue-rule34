import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    searchPrompt: ''
  }),
  getters: {
    getSearchPrompt: (state) => state.searchPrompt
  }
})
