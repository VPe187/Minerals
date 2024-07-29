<template>
    <div class="m-[1rem] md:m-[1rem]">
        <header class="mb-4 relative overflow-hidden">
            <div class="flex flex-col items-center w-full text-stone-400 relative z-10 mt-4">
                <router-link
                    :to="{ name: 'Home', query: { scrollPosition: route.query.scrollPosition } }"
                    class="w-16 h-16 bg-stone-800 rounded-full shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex items-center justify-center group">
                    <svg
                        width="60%"
                        height="60%"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="transition-transform duration-300 group-hover:rotate-[-360deg]">
                        <path
                            d="M15 18L9 12L15 6"
                            stroke="#E2E8F0"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </router-link>
            </div>
        </header>
        <div
            v-if="!noImagesFound"
            class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6 mt-1">
            <div
                v-for="(imgSrc, index) in imgSources"
                :key="index"
                @click="openModal(imgSrc.full)"
                class="sphere-container">
                <div class="sphere">
                    <img :src="imgSrc.thumbnail" class="sphere-image" @contextmenu.prevent />
                </div>
            </div>
        </div>
        <div v-else class="text-center mt-4 text-xl text-stone-600">404</div>
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
const showModal = ref(false);
const selectedImageSrc = ref("");
const imageLoaded = ref(false);

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

const startRotatingBorder = (index) => {
    rotatingBorders.value[index] = true;
};

const stopRotatingBorder = (index) => {
    rotatingBorders.value[index] = false;
};
</script>

<style scoped>
.sphere-container {
    cursor: pointer;
    width: 100%;
    max-width: 220px;
    margin: 0 auto;
    perspective: 1000px;
}

.sphere {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    border-radius: 50%;
    overflow: hidden;
    transition: all 0.3s ease-out;
    transform-style: preserve-3d;
}

.sphere-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease-out;
    border-radius: 50%;
}

.sphere::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.3) 100%);
    opacity: 0;
    transition: opacity 0.3s ease-out;
    border-radius: 50%;
    z-index: 1;
}

.sphere::after {
    content: "";
    position: absolute;
    top: -5%;
    left: -5%;
    right: -5%;
    bottom: -5%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    opacity: 0;
    transition: opacity 0.3s ease-out;
    border-radius: 50%;
    z-index: 2;
}

.sphere:hover {
    transform: scale(0.95) translateZ(-10px);
}

.sphere:hover::before,
.sphere:hover::after {
    opacity: 1;
}

.sphere:hover .sphere-image {
    filter: brightness(0.8);
}

.rotate {
    display: inline-block;
    animation: rotate 2s linear infinite;
}

.rotate-lr {
    display: inline-block;
    animation: rotate 3s ease-in-out infinite alternate;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
