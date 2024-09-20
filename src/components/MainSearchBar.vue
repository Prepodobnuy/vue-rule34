<script>
import { searchAutoComplete, SuggestionDebounce } from '../fetch';
import { useMainStore } from '../store';
import { useRouter } from 'vue-router';
import { EventBus } from '../event'

export default {
  data() {
    return {
      suggestions: [],
      showSuggestions: false,
      selectedIndex: -1,
      startIndex: 0,
      endIndex: 0,
      escPressed: 0,
    }
  },
  setup() {
    const store = useMainStore();
    return { searchPrompt: store.getSearchPrompt };
  },
  methods: {
    goToCatalogue() {
      this.$router.push(`/search/${this.$refs.input.value}`);
    },
    async fillSuggestions() {
      const fullValue = this.$refs.input.value;
      const cursorPosition = this.$refs.input.selectionStart;
      const words = fullValue.split(/\s+/);

      let closestWord = '';
      let currentPosition = 0;
      let closestStartIndex = -1;
      let closestEndIndex = -1;

      for (let word of words) {
        const adjustedWord = word.startsWith('-') ? word.slice(1) : word;

        currentPosition += word.length + 1;
        const wordLength = adjustedWord.length;

        if (cursorPosition <= currentPosition) {
          closestStartIndex = currentPosition - wordLength - 1;
          closestEndIndex = closestStartIndex + wordLength;
          break;
        }
      }
      this.startIndex = closestStartIndex
      this.endIndex = closestEndIndex

      closestWord = fullValue.slice(this.startIndex, this.endIndex);

      const value = closestWord
      if (value === '' || value === '-' || value === ' ') {
        this.hideSuggestions()
        return
      }
      let responceData = await searchAutoComplete(value);
      if (responceData.length !== 0) {
        this.viewSuggestions(responceData)
        return
      }
      this.showSuggestions = false
    },
    hideSuggestions() {
      this.suggestions = []
      this.showSuggestions = false
    },
    viewSuggestions(suggestions) {
      this.suggestions = suggestions
      this.showSuggestions = true
    },
    handleInput() {
      this.debouncedFillSuggestions()
    },
    selectItem() {
      let originalValue = this.$refs.input.value
      this.$refs.input.value = originalValue.slice(0, this.startIndex) + this.suggestions[this.selectedIndex].value + originalValue.slice(this.endIndex);
      this.suggestions = []
      this.showSuggestions = false
    },
    handleKeyDown(event) {
      let escPress = false
      if (this.showSuggestions) {
        switch (event.key) {
          case 'ArrowUp':
            if (this.selectedIndex === -1 || this.selectedIndex === 0) { this.selectedIndex = 9 }
            else { this.selectedIndex -= 1 }
            event.preventDefault();
            break;
          case 'ArrowDown':
            if (this.selectedIndex === -1) { this.selectedIndex = 0 }
            else if (this.selectedIndex === 9) { this.selectedIndex = 0 }
            else { this.selectedIndex += 1 }
            event.preventDefault();
            break;
          case 'Escape':
            this.selectedIndex = -1;
            event.preventDefault();
            escPress = true
            break;
          case 'Enter':
            this.selectItem();
            event.preventDefault();
            break;
        }
        if (escPress) {
          this.escPressed += 1
        } else {
          this.escPressed = 0
        }
        if (this.escPressed == 2) {
          this.suggestions = []
          this.showSuggestions = false
          this.escPressed = 0
        }
      } else {
        switch (event.key) {
          case 'Enter':
            this.goToCatalogue()
            break;
        }
      }
      this.searchPrompt = this.$refs.input.value
    },
    selectIndex(index) {
      this.selectedIndex = index
    },
    unselectIndex() {
      this.selectedIndex = -1
    },
    addTagToInput(tag) {
      if (this.$refs.input.value.length !== 0) {
        this.$refs.input.value += ' ' + tag
      } else {
        this.$refs.input.value += tag
      }
    }
  },
  mounted() {
    this.debouncedFillSuggestions = SuggestionDebounce(this.fillSuggestions, 200);
    window.addEventListener('keydown', this.handleKeyDown);
  },
  created() {
    EventBus.on('addTag', this.addTagToInput);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    EventBus.off('addTag', this.addTagToInput);
  },
}

</script>

<template>
  <div class="popup-wrapper">
    <div class="searchbar-bg">
      <input v-on:input="handleInput" ref="input" class="searchbar-input" type="text">
      <svg xmlns="http://www.w3.org/2000/svg" v-on:click="goToCatalogue" fill="none" viewBox="0 0 24 24"
        stroke-width="0.7" stroke="currentColor" class="svg">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>


    </div>
    <div v-if="showSuggestions" class="suggestions">
      <button v-for="(suggestion, index) in suggestions" v-on:click="selectItem" v-on:mouseleave="unselectIndex"
        v-on:mouseenter="selectIndex(index)" :class="{ selected: selectedIndex === index }" :key="index"> {{
          suggestion.label }} </button>
    </div>
  </div>

</template>

<style scoped lang="scss">
.popup-wrapper {
  position: relative;
  width: fit-content;
  height: fit-content;

  .searchbar-bg {
    position: relative;
    width: 400px;
    height: 40px;
    border-radius: 6px;
    overflow: hidden;
    background-color: var(--color-input);
    box-shadow: 0px 0px 4px 1px var(--color-shadow-inactive);
    display: flex;
    flex-direction: row;
    transition: box-shadow 0.3s;

    &:focus-within {
      box-shadow: 0px 0px 4px 1px var(--color-shadow);
    }

    .svg {
      top: 0;
      right: 0;
      height: 40px;
      width: 40px;
      padding: 5px;
      transition: transform 0.1s;

      &:hover {
        cursor: pointer;
      }

      &:active {
        transform: translateY(1px);
      }
    }

    .searchbar-input {
      outline: none;
      border: none;
      background-color: transparent;
      width: 100%;
      height: 100%;
      padding: 6px;
      font-size: large;
    }
  }

  .suggestions {
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    top: calc(100% + 6px);
    gap: 2px;
    background-color: var(--color-fg);
    box-shadow: 0px 0px 4px 1px var(--color-shadow);
    padding: 6px;
    border-radius: 6px;

    button {
      text-align: left;
      border: unset;
      padding: 2px;
      border-radius: 4px;

      &:hover {
        background-color: var(--color-accent);
      }

      &.selected {
        background-color: var(--color-accent);
      }
    }
  }
}
</style>