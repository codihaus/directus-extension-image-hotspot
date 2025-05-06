// composables/useImageLoaded.ts
import { ref, onMounted, Ref, watch } from "vue";

export function useImageLoaded(imgElement: Ref<HTMLImageElement | null>) {
    const isLoaded = ref(false);

    watch(imgElement, () => {

        const img = imgElement.value;
        console.log('imgElement', imgElement, img)
        if (!img) return;
    
        if (img.complete && img.naturalWidth !== 0) {
            console.log('img.complete && img.naturalWidth !== 0')
            isLoaded.value = true;
        } else {
            img.addEventListener("load", () => {
                isLoaded.value = true
                console.log('loaded')
            });
            img.addEventListener("error", () => (isLoaded.value = false));
        }
    })

    onMounted(() => {
    });

    return isLoaded;
}
