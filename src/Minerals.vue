<template>
    <div class="m-4 overflow-hidden" ref="mineralsContainer">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mx-4 my-2">
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
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const mineralsContainer = ref(null);
const scrollPosition = ref(0);

const imageNames = [
    "agate",
    "amazonite",
    "amber",
    "amethyst",
    "antimonite",
    "anyolite",
    "apatite",
    "aquamarine",
    "aragonite",
    "aventurine",
    "barite",
    "bismuth",
    "boulangerite",
    "cactus",
    "calcite",
    "celestine",
    "chalcopyrite",
    "chrysocolla",
    "cinnabar",
    "citrine",
    "dragonblood",
    "emerald",
    "fluorite1",
    "fluorite2",
    "galenite",
    "garnet",
    "grape",
    "heliotrope",
    "jasper",
    "kianite",
    "kunzite",
    "labradorite",
    "lazurite",
    "lepidolite",
    "malachite",
    "marcasite",
    "mexican",
    "moss",
    "obsidian",
    "opal",
    "opalite",
    "fynchenite",
    "pyrite",
    "quartz1",
    "quartz2",
    "rhodochrosite",
    "rhodolith",
    "rose",
    "ruby",
    "rutile",
    "selenite",
    "siderite",
    "smoke",
    "spharelite",
    "sulfur",
    "sun",
    "terrahertz",
    "tiger",
    "tourmaline",
    "unakite",
    "vanadinite",
    "watermelone",
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
.hover-container {
    perspective: 1000px;
    padding: 5px;
    transition: all 0.5s ease-in-out;
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
    @apply cursor-pointer relative inline-block;
    @apply rounded-full;
    @apply transition-all duration-500 ease-in-out;
    @apply z-10;
    @apply shadow-lg;
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
