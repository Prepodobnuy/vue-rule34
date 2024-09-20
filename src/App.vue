<script setup>
import MainHeader from './components/MainHeader.vue';
import { RouterLink, RouterView } from 'vue-router';
import { useMainStore } from './store';
const store = useMainStore();
</script>

<template>
  <MainHeader />
  <RouterView />
</template>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  width: 100vw;
  background-color: var(--color-fg);

  .contaiment {
    height: 100%;
    display: flex;
    flex-direction: row;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
    gap: 5px;

    .blured-bg {
      filter: blur(3px);
      opacity: 0.7;
    }


    .center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .w100 {
      width: 100%;
    }
  }
}
</style>
