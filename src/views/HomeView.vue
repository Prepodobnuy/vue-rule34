<script>
import r34tan from '../assets/r34tan.png'

export default {
  components: {
  },
  data() {
    return {
      r34tan: r34tan,
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<template>
  <main>
    <img ref="image" :src="r34tan" alt="">
    <div class="mantra">
      To find something, write in the field or just click on the button above.
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: unset;

  img {
    width: 250px;
    user-select: none;
    transition: transform 0.08s;

    &:active {
      transform: scale(0.95);
    }
  }

  .mantra {
    margin: 10px 0;
    font-size: large;
    font-weight: 500;
  }
}
</style>