<script>
import { useMainStore } from '../store';
import ImagePreview from '@/components/ImagePreview.vue';
import ActiveImagePreview from '@/components/ActiveImagePreview.vue';
import { getPictures, getParsedPictures } from '../fetch'
import BlackScreen from '@/components/BlackScreen.vue';

export default {
  components: {
    ImagePreview,
    ActiveImagePreview,
    BlackScreen,
  },
  setup() {
    const store = useMainStore();
    return { searchPrompt: store.getSearchPrompt };
  },
  data() {
    return {
      parsedQuery: this.parseQuery(),
      pid: 0,
      activeImage: null,
      previews: [],
      viewActiveImage: false,
      isAtBottom: false,
    }
  },
  mounted() {
    this.fetchPictures()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  computed: {
    searchQuery() {
      return this.$route.query.q;
    }
  },
  watch: {
    '$route.query.q': {
      handler(newValue, oldValue) {
        console.log(`Search query changed from "${oldValue}" to "${newValue}"`);
        if (newValue !== undefined) {
          this.parsedQuery = this.parseQuery()
        } else {
          this.parsedQuery = this.parseQuery()
        }
        this.pid = 0
        this.fetchPictures()
      },
      immediate: true
    }
  },
  methods: {
    parseQuery() {
      const rawQuery = this.$route.query.q
      if (rawQuery === '') {
        return 'all'
      }
      return rawQuery
    },
    async fetchPictures() {
      console.log(this.parsedQuery, this.pid)
      this.previews = await getParsedPictures(this.parsedQuery, this.pid)
      console.log(this.previews)
    },
    async addPictures() {
      this.pid = this.previews.length
      let requestData = await getParsedPictures(this.parsedQuery, this.pid)
      this.previews = this.previews.concat(requestData)
      console.log(this.previews)
      console.log(this.previews.length)
    },
    activateImage(index, active) {
      console.log(index)
      if (active) {
        this.activeImage = null
        this.viewActiveImage = false
      } else {
        this.activeImage = index
        this.viewActiveImage = true
      }
    },
    handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.isAtBottom = true;
        this.addPictures();
      } else {
        this.isAtBottom = false;
      }
    },
  }
}
</script>

<template>
  <main>
    <transition name="fade">
      <ActiveImagePreview v-if="viewActiveImage" :id="previews[activeImage].id" />
    </transition>
    <transition name="fade">
      <BlackScreen v-on:click="activateImage(0, true)" v-if="viewActiveImage" />
    </transition>
    <div class="preview-grid">
      <ImagePreview class="preview" v-for="(preview, index) in previews" :key="preview" :image="preview.image"
        :id="preview.id" v-on:click="activateImage(index, activeImage === index)" :link="preview.href" />
    </div>
  </main>

</template>

<style lang="scss">
.preview-grid {
  padding: 8px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 5px;
  justify-items: center;
  align-items: baseline;

  .preview {
    text-align: center;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, filter 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  filter: blur(10px);
}
</style>