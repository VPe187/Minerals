<template>
    <div class="relative min-h-screen overflow-hidden bg-stone-900">
        <div class="relative z-10 flex flex-col min-h-screen">
            <div class="flex-grow">
                <div class="relative text-white py-4 px-6">
                    <div class="flex items-center justify-center gap-4">
                        <h1 class="text-3xl font-bold tracking-wider animate-pulse">Ásványok, kőzetek</h1>
                        <div class="rotating-crystal">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 2L4 6L12 10L20 6L12 2Z"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M4 6V18L12 22L20 18V6"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M12 10V22"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M8 4L16 8"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M8 20L16 16"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <TransitionGroup
                    tag="div"
                    name="mineral-list"
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 p-4 md:p-6"
                    @contextmenu.prevent
                    appear>
                    <router-link
                        v-for="(imageName, index) in imageNames"
                        :key="imageName"
                        :to="{
                            name: 'Mineral',
                            params: { mineral: imageName },
                            query: { scrollPosition: scrollPosition },
                        }"
                        class="group relative flex flex-col items-center justify-center gap-2 p-3 rounded transition-all duration-300 ease-out hover:!scale-105 hover:bg-gray-400/20"
                        :data-index="index">
                        <img
                            :src="getImageUrl(imageName)"
                            :alt="formatMineralName(imageName)"
                            class="menuImage block h-auto rounded-md saturate-50 hover:saturate-150 transition-all duration-500"
                            loading="lazy" />
                        <p class="mineral-name text-center text-sm font-medium text-slate-200">
                            {{ formatMineralName(imageName) }}
                        </p>
                    </router-link>
                </TransitionGroup>
            </div>

            <Footer class="relative z-10 mt-auto" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";
import Footer from "./components/Footer.vue";
import { mineralNames } from "./minerals.js";

const imageNames = ref(mineralNames);

const getImageUrl = (name) => {
    try {
        return new URL(`./assets/${name}.png`, import.meta.url).href;
    } catch (e) {
        console.error(`Hiba a kép URL betöltésekor (${name}):`, e);
        return "";
    }
};

const formatMineralName = (name) => {
    if (!name) return "";
    return name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const route = useRoute();
const scrollPosition = ref(0);
const updateScrollPosition = () => {
    scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop;
};
const setScrollPosition = () => {
    nextTick(() => {
        const scrollPositionQuery = route.query.scrollPosition;
        const targetPosition =
            typeof scrollPositionQuery === "string" && !isNaN(Number(scrollPositionQuery))
                ? Number(scrollPositionQuery)
                : 0;
        if (targetPosition > 0) {
            window.scrollTo({ top: targetPosition, behavior: "auto" });
        }
    });
};

onMounted(() => {
    setScrollPosition();
    window.addEventListener("scroll", updateScrollPosition, { passive: true });
});
onBeforeUnmount(() => {
    window.removeEventListener("scroll", updateScrollPosition);
});
</script>

<style scoped>
.mineral-card-container {
    transform: scale(1);
    background-color: transparent;
}

.menuImage {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    object-fit: contain;
    aspect-ratio: 1 / 1;
}

.mineral-name {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    user-select: none;
}

.mineral-list-enter-active,
.mineral-list-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: calc(0.03s * var(--stagger-index, 0));
}
.mineral-list-enter-from,
.mineral-list-leave-to {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
}
.mineral-card-container {
    --stagger-index: attr(data-index number, 0);
}

.rotating-crystal svg {
    color: white;
    filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
}
</style>
