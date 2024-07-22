<template>
    <div class="m-[1rem] md:m-[1rem]">
        <header class="mb-4 relative overflow-hidden">
            <div class="flex flex-col items-center w-full text-stone-400 relative z-10 mt-4">
                <router-link :to="{ name: 'Home', query: { scrollPosition: route.query.scrollPosition } }">
                    <svg
                        width="100px"
                        height="100px"
                        viewBox="0 0 117 117"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink">
                        <title />

                        <desc />

                        <defs />

                        <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
                            <g fill-rule="nonzero" id="left-arrow">
                                <path
                                    d="M58.5,116.6 C90.5,116.6 116.6,90.6 116.6,58.5 C116.6,26.4 90.6,0.5 58.5,0.5 C26.4,0.5 0.5,26.5 0.5,58.5 C0.5,90.5 26.5,116.6 58.5,116.6 Z M58.5,8.6 C86,8.6 108.4,31 108.4,58.5 C108.4,86 86,108.4 58.5,108.4 C31,108.4 8.6,86 8.6,58.5 C8.6,31 31,8.6 58.5,8.6 Z"
                                    fill="#4A4A4A"
                                    id="Shape" />

                                <path
                                    d="M64,87.5 C64.8,88.3 65.8,88.7 66.9,88.7 C67.9,88.7 69,88.3 69.8,87.5 C71.4,85.9 71.4,83.3 69.8,81.7 L46.3,58.2 L69.8,34.7 C71.4,33.1 71.4,30.5 69.8,28.9 C68.2,27.3 65.6,27.3 64,28.9 L37.6,55.3 C36.8,56.1 36.4,57.1 36.4,58.2 C36.4,59.3 36.8,60.3 37.6,61.1 L64,87.5 Z"
                                    fill="#17AB13"
                                    id="Shape" />
                            </g>
                        </g>
                    </svg>
                </router-link>
            </div>
        </header>
        <div
            v-if="!noImagesFound"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 mt-2">
            <div v-for="(imgSrc, index) in imgSources" :key="index" @click="openModal(imgSrc.full)">
                <img
                    :src="imgSrc.thumbnail"
                    style="user-drag: none"
                    class="w-full h-full border border-black saturate-50 rounded-xl hover:scale-105 hover:border hover:saturate-100 transition-all duration-200 cursor-pointer"
                    @contextmenu.prevent />
            </div>
        </div>
        <div v-else class="text-center mt-8 text-xl text-stone-600">404</div>
    </div>
    <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300"
        @click="closeModal"
        @contextmenu.prevent>
        <div
            class="bg-black/10 overflow-hidden transition-all duration-300 relative m-4"
            :style="{ width: imageLoaded ? 'auto' : '200px', height: imageLoaded ? 'auto' : '200px' }"
            @click.stop>
            <button
                @click="closeModal"
                class="font-bold absolute top-0 right-2 text-rose-500 text-4xl hover:rotate-90 hover:scale-105 transition-all duration-300">
                &times;
            </button>
            <img
                v-show="imageLoaded"
                :src="selectedImageSrc"
                @load="onImageLoad"
                @contextmenu.prevent
                class="max-w-full max-h-[90vh] border-2 border-stone-600 animate-zoom-fade-in" />
            <div
                v-show="!imageLoaded"
                class="w-full h-full flex items-center justify-center bg-stone-950 border-2 border-stone-600">
                <ParticleAnimation />
            </div>
        </div>
    </div>

    <div class="flex w-full text-xs justify-center text-stone-600 px-8 pb-2 pt-2">
        <span class="px-1">nodeJS, vite, vue3 | &copy; 2024</span>
        <span class="rotate-lr mr-2">ʕʘ̅͜ʘ̅ʔ</span>
        &lt;V&#9650;&#1071;G
        <span class="rotate">&#9650;</span>
        /P&#926;T&#926;R&gt;
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import ParticleAnimation from "../LoadAnimation.vue";

const route = useRoute();
const mineral = ref("");
const imgSources = ref([]);
const noImagesFound = ref(false);

const loadImages = async () => {
    imgSources.value = [];
    noImagesFound.value = false;

    try {
        const images = import.meta.glob("../assets/*.jpg");
        for (const path in images) {
            const filename = path.split("/").pop();
            if (filename.startsWith(`${mineral.value}_`) && filename.match(/_\d{2}t\.jpg$/)) {
                const thumbnailModule = await images[path]();
                const fullPath = path.replace("t.jpg", ".jpg");
                const fullModule = await images[fullPath]();

                imgSources.value.push({
                    thumbnail: thumbnailModule.default,
                    full: fullModule.default,
                });
            }
        }

        if (imgSources.value.length === 0) {
            noImagesFound.value = true;
        }
    } catch (error) {
        console.error("Error loading images:", error);
        noImagesFound.value = true;
    }
};

onMounted(() => {
    mineral.value = route.params.mineral;
    loadImages();
});

watch(
    () => route.params.mineral,
    (newMineral) => {
        mineral.value = newMineral;
        loadImages();
    }
);

const showModal = ref(false);
const selectedImageSrc = ref("");
const imageLoaded = ref(false);

const openModal = (imgSrc) => {
    imageLoaded.value = false;
    selectedImageSrc.value = imgSrc;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedImageSrc.value = "";
};

const onImageLoad = () => {
    imageLoaded.value = true;
};
</script>
