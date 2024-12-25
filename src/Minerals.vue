<template>
    <div class="relative overflow-hidden">
        <div class="starry-background relative w-full bg-stone-900 text-white py-4 px-6">
            <div class="stars-container absolute inset-0">
                <div v-for="i in 50" :key="i" class="star" :style="getRandomStarStyle()"></div>
            </div>
            <div class="relative z-10 flex items-center justify-between">
                <h1 class="text-3xl font-bold tracking-wider animate-pulse">Ásványok, kőzetek</h1>
                <div class="rotating-crystal">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 2L4 6L12 10L20 6L12 2Z"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path
                            d="M4 6V18L12 22L20 18V6"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path
                            d="M12 10V22"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path
                            d="M8 4L16 8"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path
                            d="M8 20L16 16"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
    <div class="m-4 overflow-hidden" ref="mineralsContainer" @contextmenu.prevent>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mx-4 my-2">
            <router-link
                v-for="(imageName, index) in imageNames"
                :key="index"
                :to="{ name: 'Mineral', params: { mineral: imageName }, query: { scrollPosition: scrollPosition } }"
                class="group relative flex justify-center items-center hover-container"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave">
                <div class="sphere">
                    <img :src="getImageUrl(imageName)" class="menuImage" :alt="imageName" />
                </div>
            </router-link>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";
import Footer from "./components/Footer.vue";

function getRandomStarStyle() {
    return {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 5}s`,
    };
}

const route = useRoute();
const mineralsContainer = ref(null);
const scrollPosition = ref(0);

const imageNames = [
    "agate_carnelian",
    "agate_crazy",
    "agate_grape",
    "agate_lace",
    "agate_merlinite",
    "agate_mexican",
    "agate_moss",
    "amazonite",
    "amber",
    "amethyst",
    "antimonite",
    "anyolite",
    "apatite",
    "aquamarine",
    "aragonite_blue",
    "aragonite_flower",
    "aragonite_pink",
    "aventurine_blue",
    "aventurine_green",
    "aventurine_yellow",
    "azurite",
    "barite",
    "bismuth",
    "bornite",
    "boulangerite",
    "calcite_chocolate",
    "calcite_orange",
    "calcite_white",
    "celestine",
    "chalcopyrite_fujian",
    "chalcopyrite_orig",
    "chrysocolla",
    "cinnabar",
    "citrine",
    "cobalt",
    "dioptase",
    "emerald",
    "epidote",
    "fluorite_green",
    "fluorite_purple",
    "fluorite_white",
    "fluorite_yellow",
    "fynchenite",
    "galenite",
    "garnet",
    "gibbsite",
    "heliotrope",
    "jasper_dalmatian",
    "jasper_dragon",
    "jasper_leopard",
    "jasper_mookaite",
    "jasper_red",
    "kianite",
    "kunzite",
    "labradorite",
    "lazurite",
    "lepidolite",
    "malachite",
    "marcasite",
    "mica",
    "moon",
    "mosasaurus",
    "obsidian",
    "opal_honey",
    "opal_iron",
    "opal_splash",
    "opal_water",
    "opalite",
    "petersite",
    "pyrite",
    "pyrolusite",
    "pyromorphite",
    "quartz_aura",
    "quartz_cactus",
    "quartz_lemurian",
    "quartz_red",
    "quartz_rose",
    "quartz_rutiled",
    "quartz_smoke",
    "quartz_white",
    "realgar",
    "rhodochrosite",
    "rhodolith",
    "rhodonite",
    "ruby",
    "selenite_orange",
    "selenite_orig",
    "septarian",
    "siderite",
    "sodalite",
    "spharelite",
    "sulfur",
    "sun",
    "terrahertz",
    "tiger",
    "topaz",
    "tourmaline_black",
    "tourmaline_green",
    "tourmaline_pink",
    "tourmaline_watermelone",
    "tourmaline_yellow",
    "tree",
    "unakite",
    "vanadinite",
    "variscite",
    "veszelyite",
    "vivianite",
    "zaphire",
    "zebra",
];

const getImageUrl = (name) => {
    return new URL(`./assets/${name}.png`, import.meta.url).href;
};

const updateScrollPosition = () => {
    scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop;
};

const setScrollPosition = () => {
    nextTick(() => {
        const targetPosition = Number(route.query.scrollPosition) || 0;
        window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
        });
    });
};

const handleMouseMove = (event) => {
    const { currentTarget, clientX, clientY } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    const sphere = currentTarget.querySelector(".sphere");
    sphere.style.transform = `
        rotateY(${x * 30}deg)
        rotateX(${-y * 30}deg)
        translateZ(20px)
    `;
};

const handleMouseLeave = (event) => {
    const sphere = event.currentTarget.querySelector(".sphere");
    sphere.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0px)";
};

onMounted(() => {
    setScrollPosition();
    window.addEventListener("scroll", updateScrollPosition);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", updateScrollPosition);
});
</script>

<style scoped>
.starry-background {
    background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
    overflow: hidden;
}

.stars-container {
    pointer-events: none;
}

.star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    opacity: 0;
    animation: twinkle 10s infinite;
}

@keyframes twinkle {
    0%,
    100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}

.rotating-crystal {
    animation: rotate 10s linear infinite;
}

.rotating-crystal svg {
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.7));
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.sphere {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform-style: preserve-3d;
    transition: transform 0.3s ease-out;
}

.menuImage {
    @apply cursor-pointer relative inline-block rounded-full;
    @apply transition-all duration-500 ease-in-out;
    @apply z-10 shadow-lg;
    @apply filter saturate-100 brightness-100;
    @apply hover:drop-shadow-md hover:shadow-stone-600/60;
    @apply hover:saturate-150 hover:brightness-110;
    @apply hover:rotate-12;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.sphere::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
}

.sphere::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    pointer-events: none;
}
</style>
