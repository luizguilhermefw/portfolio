<script setup lang="ts">
import AboutSection from './sections/AboutSection.vue'
import AppFooter from './components/layout/AppFooter.vue'
import AppHeader from './components/layout/AppHeader.vue'
import FloatingActions from './components/layout/FloatingActions.vue'
import AylaFlowSection from './sections/AylaFlowSection.vue'
import HeroSection from './sections/HeroSection.vue'
import ProjectsSection from './sections/ProjectsSection.vue'
import ServicesSection from './sections/ServicesSection.vue'
import TechnologiesSection from './sections/TechnologiesSection.vue'
import ContactSection from './sections/ContactSection.vue'
</script>

<template>
  <AppHeader />
  <main>
    <HeroSection />
    <ProjectsSection />
    <AylaFlowSection />
    <TechnologiesSection />
    <ServicesSection />
    <AboutSection />
    <ContactSection />
  </main>
  <AppFooter />
  <FloatingActions />
</template>
