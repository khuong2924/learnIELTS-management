<template>
    <div class="dashboard">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-2">Total Users</h2>
          <p class="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-2">Active Courses</h2>
          <p class="text-3xl font-bold text-green-600">56</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-2">Total Tests</h2>
          <p class="text-3xl font-bold text-purple-600">89</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-2">Avg. Test Score</h2>
          <p class="text-3xl font-bold text-yellow-600">7.2</p>
        </div>
      </div>
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul class="bg-white rounded-lg shadow">
          <li v-for="(activity, index) in recentActivities" :key="index" class="p-4 border-b last:border-b-0">
            <p class="font-semibold">{{ activity.action }}</p>
            <p class="text-sm text-gray-600">{{ activity.timestamp }}</p>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const recentActivities = ref([
    { action: 'New user registered', timestamp: '2023-05-15 14:30' },
    { action: 'Course "IELTS Writing Advanced" created', timestamp: '2023-05-15 13:45' },
    { action: 'Test "IELTS Listening Practice 1" completed by John Doe', timestamp: '2023-05-15 12:20' },
    { action: 'Content update: Added new reading materials', timestamp: '2023-05-15 11:10' },
    { action: 'User account deactivated', timestamp: '2023-05-15 10:05' },
  ])
  </script>
  