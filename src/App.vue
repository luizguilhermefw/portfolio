<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue'
import AylaFlowSection from './sections/AylaFlowSection.vue'
import HeroSection from './sections/HeroSection.vue'
import ProjectsSection from './sections/ProjectsSection.vue'
import ServicesSection from './sections/ServicesSection.vue'
import TechnologiesSection from './sections/TechnologiesSection.vue'
</script>

<template>
  <AppHeader />
  <main>
    <HeroSection />
    <ProjectsSection />
    <AylaFlowSection />
    <TechnologiesSection />
    <ServicesSection />
  </main>
</template>
