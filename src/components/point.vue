<template>
    <div ref="dragRef" class="hotspot-point" :class="{'dragging': isDragging, active, 'has-content': point?.title || point?.description}" :style="coordinate" @pointerup="onSelect">
        <img v-if="marker?.id" class="hotspot-point-image" draggable="false" :style="{width: `${marker?.width}px`, height: `${marker?.height}px`}" :src="`/assets/${marker?.id}`" />
        <div v-else class="hotspot-point-dot" :style="{width: `${marker?.width}px`, height: `${marker?.height}px`}"></div>
        <div v-if="point?.title || point?.description" class="hotspot-point-content">
            <div v-if="point?.title" class="hotspot-point-title">{{ point?.title }}</div>
            <div v-if="point?.description" class="hotspot-point-description">{{ point?.description }}</div>
            <div class="hotspot-point-remove" @click.stop.prevent="$emit('remove')">
                <v-icon name="close" class="no-click" />
            </div>
        </div>
        <div v-if="active || (!point?.title && !point?.description)" class="hotspot-point-remove" @click.stop.prevent="$emit('remove')">
            <v-icon name="close" class="no-click" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, toRefs, ref } from 'vue';
import { useDraggable } from '@vueuse/core'

const props = withDefaults(defineProps<{
	point: Object;
    marker: String;
    container: any
    active: Boolean
}>(),  {
	point: null,
    marker: null,
    container: null,
    active: false
});

const { container } = toRefs(props)

const emit = defineEmits(['select', 'remove'])

const dragRef = ref()

const loaded = ref(false)
const isDragging = ref(false)

const { x, y, style } = useDraggable(dragRef, {
    containerElement: container,
    onStart: () => {
        isDragging.value = false
    },
    onEnd: () => {
    // optional: reset sau 1 tick nếu cần
        setTimeout(() => {
            isDragging.value = false
        }, 0)
    },
    onMove: (event) => {
        isDragging.value = true
        if (container.value) {
            if (x.value < 0) x.value = 0
            if (x.value > container.value?.offsetWidth) {
                x.value = container.value?.offsetWidth
            }
        }
    }
})

const coordinate = computed(() => {
    let output = {
        top: `${props.point.y}%`,
        left: `${props.point.x}%`,
    }

    if( loaded.value ) {
        output = style.value
    }

    return output
})

function onSelect(event) {
    console.log('event', event.target?.classList?.contains('hotspot-point-remove'))
    if (isDragging.value === true || event.target?.classList?.contains('hotspot-point-remove')) {
        event.stopImmediatePropagation?.()
        event.preventDefault()
        return
    }

    emit('select')
}

onMounted(() => {
    setTimeout(() => {
        x.value = (props.point.x * container.value?.clientWidth)/100
        y.value = (props.point.y * container.value?.clientHeight)/100
        loaded.value = true
    }, 1000)
})

console.log('container', container.value, container.value?.clientWidth, container.value?.clientHeight)
</script>
<style scoped>
.hotspot-point {
    position: absolute;
    z-index: 9;
    cursor: pointer;
}
.hotspot-point.dragging {
    cursor: grab;
}
.hotspot-point:hover {
    filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.35));
}
.hotspot-point-image {
    object-fit: contain;
    display: block;
    position: absolute;
    bottom: 0;
    transform: translateX(-50%);
    left: 50%;
}

.hotspot-point-dot {
    position: absolute;
    bottom: 0;
    transform: translateX(-50%);
    left: 50%;
    border-radius: 50%;
    background: var(--theme--primary);
}

.hotspot-point-content {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
    background: var(--theme--primary);
    border-radius: 12px;
    color: #fff;
    padding: 4px 10px;
    text-align: center;
    font-size: 16px;
}

.active .hotspot-point-content,
.hotspot-point:hover .hotspot-point-content {
    display: block
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
    transform: translateX(50%) translateY(-100%);
}

.hotspot-point-content .hotspot-point-remove {
    transform: none;
    right: -12px;
    top: -12px;
}

.hotspot-point > .hotspot-point-remove,
.hotspot-point > .hotspot-point-remove {
    display: none;
}

.hotspot-point:not(.has-content):hover > .hotspot-point-remove,
.hotspot-point.active:not(.has-content) > .hotspot-point-remove {
    display: flex;
}

.hotspot-point-remove :deep(*) {
    pointer-events: none;
}
</style>