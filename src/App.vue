<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue'
import AylaFlowSection from './sections/AylaFlowSection.vue'
import HeroSection from './sections/HeroSection.vue'
import ProjectsSection from './sections/ProjectsSection.vue'
</script>

<template>
  <AppHeader />
  <main>
    <HeroSection />
    <ProjectsSection />
    <AylaFlowSection />
  </main>
</template>
