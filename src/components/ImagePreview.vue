<script>
export default {
    props: {
        image: String,
        link: String,
        id: String,
        active: Boolean,
    }
}
</script>

<template>
    <div class="image-preview">
        <img :src="image">
        <div v-if="active" class="active-image-preview">
            active
        </div>
    </div>

</template>

<style lang="scss">
.image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        max-width: 100%;
        max-height: 100%;
        box-shadow: 0px 0px 4px 1px var(--color-shadow-inactive);
        transition: box-shadow 0.3s;

        &:active {
            box-shadow: 0px 0px 4px 1px var(--color-shadow);
        }
    }

    .active-image-preview {
        position: absolute;
        height: 300px;
        width: 100%;

        * {
            color: var(--color-active-preview-text);
        }
    }
}
</style>