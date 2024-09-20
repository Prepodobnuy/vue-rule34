<script>
import MainSearchBar from '@/components/MainSearchBar.vue';
import { RouterLink } from 'vue-router';

export default {
    name: 'MainHeader',
    components: {
        MainSearchBar
    },
    data() {
        return {

        }
    }
}
</script>

<template>
    <header>
        <div class="contaiment">
            <RouterLink class="link" to="/">
                <svg xmlns="http://www.w3.org/2000/svg" class="vue-logo" viewBox="0 0 261.76 226.69">
                    <path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z"
                        fill="#41b883" />
                    <path d="M161.096.001l-30.225 52.351L100.647.001H52.346l78.526 136.01L209.398.001z"
                        fill="#34495e" />
                </svg>
                <h2 class="roboto-regular">
                    Rule34
                </h2>
            </RouterLink>
            <img class="blured-bg" src="https://rule34.xxx/images/topb.png">
            <MainSearchBar class="center" />
        </div>


    </header>

</template>

<style lang="scss" scoped>
.link {
    display: flex;
    flex-direction: row;
    text-decoration: none;
    color: var(--color-text);
}

header {
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
    width: 100vw;
    background-color: var(--color-fg);
    z-index: 1000;
    box-shadow: 0px 0px 4px 1px var(--color-shadow-inactive);

    .contaiment {
        height: 100%;
        display: flex;
        flex-direction: row;
        max-width: 1200px;
        margin: 0 auto;
        align-items: center;
        gap: 5px;

        .vue-logo {
            width: 20px;
        }

        .blured-bg {
            filter: blur(3px);
            opacity: 0.7;
            user-select: none;
            pointer-events: none;
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