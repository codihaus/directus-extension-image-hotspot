<template>
    <div class="hotspot-point" :style="coordinate">
        <img v-if="marker?.id" class="hotspot-point-image" :style="{width: `${marker?.width}px`, height: `${marker?.height}px`}" :src="`/assets/${marker?.id}`" />
        <div v-else class="hotspot-point-dot" :style="{width: `${marker?.width}px`, height: `${marker?.height}px`}"></div>
        <div v-if="point?.title || point?.description" class="hotspot-point-content">
            <div v-if="point?.title" class="hotspot-point-title">{{ point?.title }}</div>
            <div v-if="point?.description" class="hotspot-point-description">{{ point?.description }}</div>
            <div class="hotspot-point-remove" @click.stop.prevent="$emit('remove')">
                <v-icon name="close" />
            </div>
        </div>
        <div v-if="!point?.title && !point?.description" class="hotspot-point-remove" @click.stop.prevent="$emit('remove')">
            <v-icon name="close" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
	point: Object;
    marker: String
}>(),  {
	point: null,
    marker: null
});

const emit = defineEmits(['remove'])

const coordinate = computed(() => ({
    top: `calc(${props.point.y}% - ${(props.marker?.height)}px)`,
    left: `calc(${props.point.x}% - ${(props.marker?.width)/2}px)`,
}))
</script>
<style scoped>
.hotspot-point {
    position: absolute;
    z-index: 9;
    cursor: pointer;
}
.hotspot-point:hover {
    filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.35));
}
.hotspot-point-image {
    object-fit: contain;
    display: block
}

.hotspot-point-dot {
    border-radius: 50%;
    background: var(--theme--primary);
}

.hotspot-point-content {
    position: absolute;
    bottom: 100%;
    margin-bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--theme--primary);
    border-radius: 12px;
    color: #fff;
    padding: 4px 10px;
    text-align: center;
    font-size: 16px;
}

.hotspot-point-title {
    min-width: 100px;
    white-space: nowrap;
}

.hotspot-point-description {
    min-width: 100px;
}

.hotspot-point-remove {
    position: absolute;
    background: #545454;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    bottom: 100%;
    --v-icon-size: 16px;
    right: -16px;
}
</style>