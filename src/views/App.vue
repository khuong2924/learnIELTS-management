<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 bg-indigo-700 text-white transition-all duration-300 ease-in-out" :class="{ 'w-20': isSidebarCollapsed }">
      <div class="flex items-center justify-between p-4">
        <h1 class="text-2xl font-bold" :class="{ 'hidden': isSidebarCollapsed }">IELTS Admin</h1>
        <button @click="toggleSidebar" class="text-white focus:outline-none">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>
      <nav class="mt-8">
        <router-link v-for="(item, index) in menuItems" :key="index" :to="item.path" class="flex items-center px-4 py-3 transition-colors duration-200 hover:bg-indigo-600" :class="{ 'justify-center': isSidebarCollapsed }">
          <i :class="[item.icon, 'text-xl']"></i>
          <span class="ml-3" :class="{ 'hidden': isSidebarCollapsed }">{{ item.name }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-md">
        <div class="flex items-center justify-between px-6 py-4">
          <h2 class="text-2xl font-semibold text-gray-800">{{ currentPage }}</h2>
          <div class="flex items-center">
            <button class="mr-4 text-gray-600 hover:text-gray-800 focus:outline-none">
              <i class="fas fa-bell text-xl"></i>
            </button>
            <div class="relative">
              <button @click="toggleProfileMenu" class="flex items-center focus:outline-none">
                <img class="w-8 h-8 rounded-full" src="https://via.placeholder.com/40" alt="Profile">
                <span class="ml-2 text-gray-700">Admin User</span>
                <i class="fas fa-chevron-down ml-2 text-gray-500"></i>
              </button>
              <div v-if="isProfileMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isSidebarCollapsed = ref(false)
const isProfileMenuOpen = ref(false)

const menuItems = [
  { name: 'Dashboard', path: '/', icon: 'fas fa-tachometer-alt' },
  { name: 'Users', path: '/users', icon: 'fas fa-users' },
  { name: 'Content', path: '/content', icon: 'fas fa-book' },
  { name: 'Tests', path: '/tests', icon: 'fas fa-clipboard-check' },
]

const currentPage = computed(() => {
  return menuItems.find(item => item.path === route.path)?.name || 'Dashboard'
})

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

