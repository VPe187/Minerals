<template>
    <div class="m-[1rem] md:m-[1rem]" @contextmenu.prevent>
        <header ref="headerRef" class="mb-4 sticky top-0 z-50">
            <div
                :class="[
                    'flex flex-col items-center w-full text-stone-400 transition-all duration-300',
                    { 'p-4 bg-stone-900/80 backdrop-blur-sm': isFloating },
                ]">
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
            class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6 m-1">
            <div
                v-for="(imgSrc, index) in imgSources"
                :key="index"
                @click="openModal(imgSrc.full)"
                class="sphere-container">
                <div class="sphere">
                    <img :src="imgSrc.thumbnail" class="sphere-image" @contextmenu.prevent />
                    <div class="sphere-label">
                        <span>{{ mineral.value }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center mt-4 text-xl text-stone-600">404</div>
    </div>
    <div
        v-if="showModalBackdrop"
        :class="[
            'fixed inset-0 z-50 flex items-center justify-center transition-all duration-300',
            { 'bg-black/60 backdrop-blur-md': showModal },
            { 'bg-transparent backdrop-blur-none': !showModal },
        ]"
        @click="closeModal"
        @contextmenu.prevent>
        <div
            class="bg-black/10 overflow-hidden transition-all duration-300 relative m-4"
            :class="[
                { 'opacity-100 scale-100 animate-modal-open': showModal && !isClosing },
                { 'opacity-0 scale-95 animate-modal-close': isClosing },
                { 'opacity-0 scale-95': !showModal && !isClosing },
            ]"
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
    <Footer />
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import ParticleAnimation from "../LoadAnimation.vue";
import Footer from "./Footer.vue";

const route = useRoute();
const mineral = ref("");
const imgSources = ref([]);
const noImagesFound = ref(false);
const showModal = ref(false);
const showModalBackdrop = ref(false);
const selectedImageSrc = ref("");
const imageLoaded = ref(false);
const headerRef = ref(null);
const isFloating = ref(false);
const isClosing = ref(false);

const loadImages = async () => {
    imgSources.value = [];
    noImagesFound.value = false;

    // Escape special characters in mineral name for regex safety (optional but recommended)
    // Ezt csak akkor kell beépíteni, ha a mineral.value tartalmazhat regex speciális karaktereket, pl. '.' , '+', '*' stb.
    // const escapedMineralName = mineral.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const mineralNameForRegex = mineral.value; // Használd az 'escapedMineralName'-t, ha szükséges

    // Reguláris kifejezés:
    // ^                   - Sor eleje
    // ${mineralNameForRegex} - Pontosan az ásvány neve
    // _                   - Egy aláhúzás
    // (\d{2})             - Pontosan két számjegy (ezt meg is őrizzük, bár itt nem használjuk fel közvetlenül)
    // t                   - A 't' karakter (thumbnail jelölés)
    // \.                  - Egy pont karakter (a '.' speciális jelentése miatt '\'-el kell escape-elni)
    // jpg                 - A 'jpg' kiterjesztés
    // $                   - Sor vége
    const thumbnailRegex = new RegExp(`^${mineralNameForRegex}_\\d{2}t\\.jpg$`);

    try {
        const images = import.meta.glob("../assets/*.jpg");
        // Használj Promise.all-t a párhuzamos betöltéshez és jobb teljesítményhez
        const imagePromises = [];

        for (const path in images) {
            const filename = path.split("/").pop();

            // Ellenőrzés a pontos regex mintával
            if (thumbnailRegex.test(filename)) {
                const fullPath = path.replace(/_(\d{2})t\.jpg$/, `_$1.jpg`); // Megtartja a számot a teljes képnél is, ha az is úgy van elnevezve

                // Hozzáadjuk a betöltési ígéreteket egy tömbhöz
                imagePromises.push(
                    Promise.all([images[path](), images[fullPath]()])
                        .then(([thumbnailModule, fullModule]) => ({
                            thumbnail: thumbnailModule.default,
                            full: fullModule.default,
                        }))
                        .catch((err) => {
                            console.error(`Hiba a képek betöltésekor (${path}, ${fullPath}):`, err);
                            return null; // Hiba esetén null-t adunk vissza, amit később kiszűrünk
                        })
                );
            }
        }

        // Várunk az összes kép betöltésére
        const loadedSources = (await Promise.all(imagePromises)).filter((source) => source !== null); // Kiszűrjük a sikertelen betöltéseket

        imgSources.value = loadedSources;

        if (imgSources.value.length === 0) {
            noImagesFound.value = true;
        }
    } catch (error) {
        console.error("Error loading image manifest:", error);
        noImagesFound.value = true;
    }
};

onMounted(() => {
    mineral.value = route.params.mineral;
    loadImages();
    window.addEventListener("scroll", handleScroll);
    handleScroll();
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
    if (headerRef.value) {
        const headerRect = headerRef.value.getBoundingClientRect();
        isFloating.value = headerRect.top <= 0;
    }
};

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
    showModalBackdrop.value = true;
    isClosing.value = false;
    setTimeout(() => {
        showModal.value = true;
    }, 10);
};

const closeModal = () => {
    isClosing.value = true;
    showModal.value = false;
    setTimeout(() => {
        showModalBackdrop.value = false;
        //selectedImageSrc.value = "";
        isClosing.value = false;
    }, 300);
};

const onImageLoad = () => {
    imageLoaded.value = true;
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
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-style: preserve-3d;
}

.sphere-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    border-radius: 50%;
}

.sphere-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.3rem;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    transform: translateY(100%);
    transition: transform 0.4s ease;
    z-index: 3;
}

.sphere::before,
.sphere::after {
    content: "";
    position: absolute;
    top: -5%;
    left: -5%;
    right: -5%;
    bottom: -5%;
    border-radius: 50%;
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    opacity: 0.2;
}

.sphere::before {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(128, 128, 128, 0.15));
    filter: blur(10px);
    z-index: 1;
}

.sphere::after {
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 60%);
    z-index: 2;
    mix-blend-mode: overlay;
}

.sphere:hover {
    transform: scale(1.05) rotate(-5deg);
}

.sphere:hover .sphere-label {
    transform: translateY(10);
}

.sphere:hover::before,
.sphere:hover::after {
    opacity: 0.4;
}

.sphere:hover .sphere-image {
    filter: brightness(1.05) contrast(1.05) saturate(1.1);
}

@keyframes crystal-shimmer {
    0%,
    100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

.sphere:hover::before {
    animation: crystal-shimmer 4s linear infinite;
    background-size: 200% 200%;
}

@keyframes crystal-refract {
    0%,
    100% {
        transform: translateX(0) translateY(0);
    }
    25% {
        transform: translateX(5px) translateY(-5px);
    }
    50% {
        transform: translateX(0) translateY(-8px);
    }
    75% {
        transform: translateX(-5px) translateY(-5px);
    }
}

.sphere:hover .sphere-image {
    animation: crystal-refract 6s ease-in-out infinite;
}

.animate-slide-in {
    animation: slideIn 0.3s ease-out;
}

.animate-slide-out {
    animation: slideOut 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-100%);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(100%);
    }
}

header {
    transition: all 0.3s ease;
}

.sticky {
    position: -webkit-sticky;
    position: sticky;
}

@keyframes zoom-fade-in {
    from {
        opacity: 0;
        transform: scale(1.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-zoom-fade-in {
    animation: zoom-fade-in 0.3s ease-out;
}

@keyframes modal-open {
    0% {
        opacity: 0;
        transform: scale(0.95);
    }
    70% {
        opacity: 1;
        transform: scale(1.05);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes modal-close {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0.95);
    }
}

.animate-modal-open {
    animation: modal-open 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-modal-close {
    animation: modal-close 0.3s ease-in-out;
}
</style>
