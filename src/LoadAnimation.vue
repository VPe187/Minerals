<template>
    <canvas ref="canvas" class="w-full h-full"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";

const canvas = ref(null);

onMounted(() => {
    const ctx = canvas.value.getContext("2d");

    // Explicit beállítjuk a canvas méretét
    canvas.value.width = canvas.value.clientWidth;
    canvas.value.height = canvas.value.clientHeight;

    const particlesArray = [];
    const numberOfParticles = 12;
    const centerX = canvas.value.width / 2;
    const centerY = canvas.value.height / 2;
    const radius = Math.min(centerX, centerY) / 1.8;

    const createParticles = () => {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push({
                angle: (i * 2 * Math.PI) / numberOfParticles,
                size: 10,
                opacity: 1,
                speed: 0.02,
            });
        }
    };

    const moveParticles = () => {
        for (let particle of particlesArray) {
            particle.angle += particle.speed;
            particle.x = centerX + radius * Math.cos(particle.angle);
            particle.y = centerY + radius * Math.sin(particle.angle);
            particle.opacity = 0.4 + 0.5 * Math.cos(particle.angle);
            particle.size = 7 + 5 * Math.cos(particle.angle);
        }
    };

    const drawParticles = () => {
        for (let particle of particlesArray) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 20, 100, ${particle.opacity})`;
            ctx.fill();
        }
    };

    const animate = () => {
        if (canvas.value && ctx) {
            ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
            moveParticles();
            drawParticles();
        }
        requestAnimationFrame(animate);
    };

    createParticles();
    animate();
});
</script>

<style scoped>
canvas {
    display: block;
}
</style>
