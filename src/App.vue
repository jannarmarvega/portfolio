<script setup>
import NavBar from './components/layout/NavBar.vue'
import Footer from './components/layout/Footer.vue'
import HeroSection from './components/sections/HeroSection.vue'
import ChatSection from './components/sections/ChatSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import ProjectsSection from './components/sections/ProjectsSection.vue'
import ExperienceSection from './components/sections/ExperienceSection.vue'
import BlogSection from './components/sections/BlogSection.vue'
import ContactSection from './components/sections/ContactSection.vue'
</script>

<template>
  <NavBar />
  <main>
    <HeroSection />
    <ChatSection />
    <AboutSection />
    <ProjectsSection />
    <ExperienceSection />
    <BlogSection />
    <ContactSection />
  </main>
  <Footer />
</template>
