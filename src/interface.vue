<template>
	<div>
		<v-tabs v-model="currentTab" class="hotspot-tabs">
			<v-tab v-slot="{active}">
				<v-button :secondary="!active">Edit</v-button>
			</v-tab>
			<v-tab v-slot="{active}">
				<v-button :secondary="!active">Settings</v-button>
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="currentTab" class="hotspot-tabs-content">
			<v-tab-item>
				<template v-if="value?.image">
					<div ref="hotspotBox" class="hotspot-box">
						<v-image
							:src="`/assets/${value?.image}`"
							class="hotspot-image"
							role="presentation"
						/>
						<div ref="hotspotOverlay" class="hotspot-overlay" @click.stop.prevent="addHotSpot"></div>
						<div v-if="hotspotBox" class="hotspot-points">
							<point
								v-for="item, index in model?.points"
								:point="item"
								:key="`point-${index}`"
								:marker="value?.marker"
								:container="hotspotBox"
								:active="selectedPoint === index"
								@select="onClickPoint(item, index)"
								@remove="model.points?.splice(index, 1)"
								@update="model.points[index] = $event"
							/>
						</div>
					</div>
					<div v-show="showForm" ref="formRef"class="hotspot-form">
						<v-form
							v-model="formValue"
							:initial-values="{}"
							:fields="fields"
						/>
						<v-button @click="onSave(formValue)">Save</v-button>
					</div>
				</template>
				<div v-else class="hotspot-image-not-found">
					<v-info icon="upload" title="Upload an image to continue" type="info">
						Please upload an image on settings page!
						<v-button @click="currentTab = [1]">Go to settings</v-button>
					</v-info>
				</div>
			</v-tab-item>
			<v-tab-item>
				<div class="v-form grid with-fill">
					<div class="field first-visible-field">
						<label>Image:</label>
						<uploader :value="model?.image" @input="onUploadImage"/>
					</div>
					<div class="field">
						<label>Marker image:</label>
						<uploader :value="model?.marker?.id" @input="onUploadMarker"/>
					</div>
					<div class="field">
						<label>Marker Width:</label>
						<interface-input :value="model?.marker?.width" inputType="integer" @input="onInputMarkerWidth" />
					</div>
					<div class="field">
						<label>Marker height:</label>
						<interface-input :value="model?.marker?.height" inputType="integer" @input="onInputMarkerHeight" />
					</div>
				</div>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script setup lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import Point from './components/point.vue'
import uploader from './components/uploader.vue'
import { set } from 'lodash-es'

const props = withDefaults(defineProps<{
	value: JSON | null;
}>(),  {
	value: null
});

const emit = defineEmits(['input'])

const model = computed({
	get: () => props.value ?? {},
	set: (value) => {
		emit('input', value);
	},
});

const currentTab = ref([0])

onMounted(async() => {
	setTimeout(() => {
		if( !model.value?.image ) {
			currentTab.value = [1]
		}
	}, 2000)
})

const hotspotBox = ref()
const hotspotOverlay = ref()
const formRef = ref()
const selectedPoint = ref()

const formValue = ref({})

const fields = ref([
	{
		field: "title",
		name: "Title",
		type: "string",
		meta: {
			interface: "input"
		}
	},
	{
		field: "description",
		name: "Description",
		type: "string",
		meta: {
			interface: "input"
		}
	},
])

const showForm = ref(false)
const isNew = ref(false)
const points = ref([])

async function addHotSpot(e) {
	const relativeX = e.offsetX
	const relativeY = e.offsetY
	const height = hotspotOverlay.value?.offsetHeight
	const width = hotspotOverlay.value?.offsetWidth
	const hotspot = { x: relativeX / width * 100, y: relativeY / height * 100 }
	points.value = model.value?.points || []
	points.value?.push(hotspot)
	formValue.value = {
		index: (points.value?.length - 1),
		...hotspot
	}
	model.value = {
		...model.value,
		points: points.value
	}
	selectedPoint.value = formValue.value.index
	showForm.value = true
	isNew.value = true
	await nextTick()
	formRef.value?.scrollIntoView({behavior: 'smooth'})
}

function onSave(data) {
	points.value[data?.index] = data
	model.value = {
		...model.value,
		points: points.value
	}
	if( isNew.value ) {
		formValue.value = {}
	}
}

async function onClickPoint(item, index) {
	points.value = model.value?.points || []
	formValue.value = {
		...item, 
		index
	};
	showForm.value = true
	isNew.value = false
	selectedPoint.value = index
	await nextTick()
	formRef.value?.scrollIntoView({behavior: 'smooth'})
}

function onUploadImage(id) {
	model.value = {
		...model.value,
		image: id
	}
}

function onUploadMarker(id) {
	model.value = {
		...model.value,
		marker: {
			id,
			width: Number(model.value?.marker?.width) || 32,
			height: Number(model.value?.marker?.height) || 32,
		}
	}
}

function onInputMarkerWidth(width) {
	model.value.marker = {
		...model.value.marker,
		width: Number(width)
	}
}

function onInputMarkerHeight(height) {
	model.value.marker = {
		...model.value.marker,
		height: Number(height)
	}
}

</script>
<style scoped>
.v-tabs.hotspot-tabs :deep(.v-tab) {
	padding: 0;
	height: auto;
}

.v-tabs-items.hotspot-tabs-content {
	margin-top: 24px;
}

.v-tabs-items.hotspot-tabs-content :deep(.v-form) {
	display: grid;
	grid-template-columns: [start] minmax(0, 1fr) [half] minmax(0, 1fr) [full];
    gap: var(--theme--form--row-gap) var(--theme--form--column-gap);
}

.v-tabs-items.hotspot-tabs-content :deep(.v-form) .full {
	grid-column: start / full;
}

.v-tabs-items.hotspot-tabs-content :deep(.v-form) .field {
	display: grid;
	gap: 12px;
}

.hotspot-box {
	position: relative;
	border: 1px solid #e4eaf1;
}

.hotspot-overlay {
	position: absolute;
	inset: 0;
	cursor: copy;
}

.hotspot-image {
	max-width: 100%;
}

.hotspot-image-not-found {
	padding: 20px;
	border-radius: 10px;
	border: 1px solid #e4eaf1;
}
.hotspot-image-not-found .v-button {
	margin-top: 24px;
}

.hotspot-form {
	margin-top: 24px;
	display: grid;
	gap: var(--theme--form--row-gap);
}
</style>