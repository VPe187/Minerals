import { createRouter, createMemoryHistory } from "vue-router";
import Minerals from "../Minerals.vue";
import Gallery from "../components/Gallery.vue";

const base = import.meta.env.BASE_URL;

const routes = [
    {
        path: base,
        name: "Home",
        component: Minerals,
        props: (route) => ({ scrollPosition: Number(route.query.scrollPosition) || 0 }),
    },
    {
        path: `${base}:mineral`,
        name: "Mineral",
        component: Gallery,
    },
];

const router = createRouter({
    history: createMemoryHistory(base),
    routes,
});

export default router;
