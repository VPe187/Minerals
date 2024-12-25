<template>
    <div class="flex w-full text-xs justify-center text-stone-600 px-8 pb-2 pt-2 mt-6">
        Minerals v.04 |
        <span class="px-1">nodeJS, vite, vue3 | &copy; 2024</span>
        <span class="rotate-lr mr-2">ʕʘ̅͜ʘ̅ʔ</span>
        &lt;V&#9650;&#1071;G
        <span class="rotate">&#9650;</span>
        /P&#926;T&#926;R&gt;
    </div>
</template>

<style scoped>
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
