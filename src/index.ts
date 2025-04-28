import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'image-hotspot',
	name: 'Image Hotspot',
	icon: 'box',
	description: ' A interface to pin hotspots to image!',
	component: InterfaceComponent,
	options: null,
	types: ['json'],
});
