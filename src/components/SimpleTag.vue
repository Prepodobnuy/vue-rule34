<script>
import { EventBus } from '../event'

export default {
    props: {
        leftVal: String,
        rightVal: String,
        value: String,
    },
    methods: {
        addTag(fchar) {
            if (this.value) {
                EventBus.emit('addTag', `${fchar}${this.value}`)
            }
        }
    }
}
</script>

<template>

    <div class="tag">
        <span class="action" v-on:click="addTag('-')" v-if="value">-</span>
        <span class="action" v-on:click="addTag('')" v-if="value">+</span>
        <span v-if="leftVal">{{ leftVal }}</span>
        <span v-if="rightVal" class="right">{{ rightVal }}</span>
    </div>

</template>

<style lang="scss" scoped>
.tag {
    display: flex;
    flex-direction: row;
    font-size: medium;

    .action {
        user-select: none;
        cursor: pointer;
        border: unset;
        border-radius: 4px;
        margin-right: 3px;
    }

    .right {
        margin-left: auto;
    }
}
</style>