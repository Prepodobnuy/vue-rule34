<script>
import { getParsedActivePic } from '../fetch'
import SimpleTag from './SimpleTag.vue';

export default {
    components: {
        SimpleTag,
    },
    props: {
        id: String
    },
    data() {
        return {
            image: null,
            tags: {}
        }
    },
    computed: {
        getId() {
            return this.id
        }
    },
    watch: {
        id(newId, oldId) {
            console.log(`ID changed from ${oldId} to ${newId}`);
            this.fetchData();
        }
    },
    methods: {
        async fetchData() {
            let data = await getParsedActivePic(String(this.id))
            console.log(data)
            if (data.video.poster) {
                this.image = data.video.poster
            } else {
                this.image = data.image
            }
            this.tags = data.tags
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>

<template>

    <div class="active-image">
        <div class="side">
            <div class="taglist">
                <SimpleTag leftVal="id" :rightVal="id" />
                <h3 v-if="JSON.stringify(tags.artist) !== JSON.stringify([])">Artist</h3>
                <SimpleTag v-for="tag in tags.artist" :key="tag" :leftVal="tag.display" :rightVal="tag.count"
                    :value="tag.name" />
                <h3 v-if="JSON.stringify(tags.character) !== JSON.stringify([])">character</h3>
                <SimpleTag v-for="tag in tags.character" :key="tag" :leftVal="tag.display" :rightVal="tag.count"
                    :value="tag.name" />
                <h3 v-if="JSON.stringify(tags.general) !== JSON.stringify([])">general</h3>
                <SimpleTag v-for="tag in tags.general" :key="tag" :leftVal="tag.display" :rightVal="tag.count"
                    :value="tag.name" />
                <h3 v-if="JSON.stringify(tags.metadata) !== JSON.stringify([])">metadata</h3>
                <SimpleTag v-for="tag in tags.metadata" :key="tag" :leftVal="tag.display" :rightVal="tag.count"
                    :value="tag.name" />
            </div>
        </div>
        <img :src="image" alt="">
        <div class="image-placeholder">
        </div>
    </div>

</template>

<style lang="scss" scoped>
.active-image {
    position: fixed;
    border-radius: 4px;
    overflow: hidden;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-fg);
    z-index: 2000;
    height: 600px;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    color: var(--color-text);
    box-shadow: 0px 0px 4px 1px var(--color-shadow-inactive);


    .side {
        padding: 8px 8px;
        min-width: 300px;
        height: 100%;
        overflow-y: auto;
        flex-shrink: 1;
    }

    img {
        flex-shrink: 1;
        position: relative;
        display: flex;
        overflow: scroll;
        height: 100%
    }
}
</style>