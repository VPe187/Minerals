<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <img src="../assets/images/error_image.png" alt="Error Image" class="w-32 h-32 mb-4" />
        <h1 class="text-3xl font-bold text-gradient">No mineral data available.</h1>
        <a href="/" class="text-xl mt-2 text-purple-300">&larr; Vissza</a>
    </div>
</template>

<script setup></script>
<style scoped>
.text-gradient {
    @apply bg-gradient-to-l from-purple-300 via-purple-500 to-purple-700;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
