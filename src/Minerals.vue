<template>
    <div class="m-4" ref="mineralsContainer">
        <div class="flex flex-col items-center">
            <router-link
                v-for="(imageName, index) in imageNames"
                :key="index"
                :to="{ name: 'Mineral', params: { mineral: imageName }, query: { scrollPosition: scrollPosition } }"
                style="user-drag: none">
                <img :src="getImageUrl(imageName)" class="menuImage" :alt="imageName" style="user-drag: none" />
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
    "smoke",
    "tourmaline",
    "obsidian",
    "artificial",
    "galenite",
    "antimonite",
    "boulangerite",
    "aura",
    "ruby",
    "rose",
    "pink",
    "sun",
    "rodhonite",
    "cinnabar",
    "blood",
    "garnet",
    "caramell",
    "jasper",
    "agate",
    "rodochrosite",
    "quartz1",
    "citrine",
    "opal",
    "amber",
    "fluorite_h",
    "tiger",
    "yellow",
    "cactus",
    "unakite",
    "pirite",
    "marcasite",
    "labradorite",
    "green",
    "mexican",
    "spharelit",
    "barite",
    "selenite",
    "sphere",
    "grape",
    "amethyst",
    "celestine",
    "blue",
    "amazonite",
    "fluorite",
    "malachite",
    "emerald",
    "other",
    "zebra",
    "quartz2",
    "cube",
];

const getImageUrl = (name) => {
    return new URL(`./assets/${name}.png`, import.meta.url).href;
};

const updateScrollPosition = () => {
    scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop;
};

const smoothScroll = (element, target, duration) => {
    const start = element.scrollTop;
    const change = target - start;
    const increment = 16;
    let currentTime = 0;

    const animateScroll = () => {
        currentTime += increment;
        const val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };

    Math.easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    animateScroll();
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

onMounted(() => {
    setScrollPosition();
    window.addEventListener("scroll", updateScrollPosition);
});

onBeforeUnmount(() => {
    if (mineralsContainer.value) {
        window.removeEventListener("scroll", updateScrollPosition);
    }
});
</script>

<style scoped>
@keyframes zoomFadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-zoom-fade-in {
    animation: zoomFadeIn 0.3s ease-out;
}

.menuImage {
    @apply border border-black cursor-pointer relative inline-block hover:scale-x-105 hover:translate-x-1 transform transition-all duration-300;
}
</style>
