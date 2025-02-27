<template>
    <div class="test-management">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4">Test Management</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-100 rounded-lg p-4 flex items-center">
            <i class="fas fa-clipboard-list text-3xl text-blue-500 mr-4"></i>
            <div>
              <p class="text-sm text-blue-600">Total Tests</p>
              <p class="text-2xl font-bold text-blue-800">{{ testStats.total }}</p>
            </div>
          </div>
          <div class="bg-green-100 rounded-lg p-4 flex items-center">
            <i class="fas fa-clock text-3xl text-green-500 mr-4"></i>
            <div>
              <p class="text-sm text-green-600">Avg. Duration</p>
              <p class="text-2xl font-bold text-green-800">{{ testStats.avgDuration }} min</p>
            </div>
          </div>
          <div class="bg-purple-100 rounded-lg p-4 flex items-center">
            <i class="fas fa-users text-3xl text-purple-500 mr-4"></i>
            <div>
              <p class="text-sm text-purple-600">Total Attempts</p>
              <p class="text-2xl font-bold text-purple-800">{{ testStats.totalAttempts }}</p>
            </div>
          </div>
        </div>
  
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <input v-model="searchQuery" type="text" placeholder="Search tests..." class="px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button @click="searchTests" class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300">
              <i class="fas fa-search"></i>
            </button>
          </div>
          <button @click="openAddTestModal" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 flex items-center">
            <i class="fas fa-plus mr-2"></i> Add New Test
          </button>
        </div>
  
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left">Title</th>
                <th class="py-3 px-4 text-left">Type</th>
                <th class="py-3 px-4 text-left">Duration</th>
                <th class="py-3 px-4 text-left">Max Attempts</th>
                <th class="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="test in filteredTests" :key="test.id" class="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
                <td class="py-3 px-4">{{ test.title }}</td>
                <td class="py-3 px-4">
                  <span :class="getTypeBadgeClass(test.type)">{{ test.type }}</span>
                </td>
                <td class="py-3 px-4">{{ test.duration }} minutes</td>
                <td class="py-3 px-4">{{ test.attempts }}</td>
                <td class="py-3 px-4">
                  <button @click="editTest(test)" class="text-blue-500 hover:text-blue-700 mr-2 transition duration-300">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteTest(test)" class="text-red-500 hover:text-red-700 transition duration-300">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Add/Edit Test Modal -->
      <div v-if="isTestModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 w-full max-w-md">
          <h3 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Test' : 'Add New Test' }}</h3>
          <form @submit.prevent="saveTest">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title</label>
              <input v-model="currentTest.title" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="type">Type</label>
              <select v-model="currentTest.type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="type">
                <option value="mini">Mini-test</option>
                <option value="full">Full-test</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="duration">Duration (minutes)</label>
              <input v-model="currentTest.duration" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="duration" type="number" min="1" max="180" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="attempts">Max Attempts</label>
              <input v-model="currentTest.attempts" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="attempts" type="number" min="1" max="10" required>
            </div>
            <div class="flex justify-end">
              <button type="button" @click="closeTestModal" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 transition duration-300">
                Cancel
              </button>
              <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                {{ isEditing ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 w-full max-w-md">
          <h3 class="text-xl font-semibold mb-4">Confirm Deletion</h3>
          <p class="mb-4">Are you sure you want to delete the test "{{ testToDelete.title }}"? This action cannot be undone.</p>
          <div class="flex justify-end">
            <button @click="cancelDelete" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 transition duration-300">
              Cancel
            </button>
            <button @click="confirmDelete" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed } from 'vue'
  
  const tests = ref([
    { id: 1, title: 'IELTS Reading Mini-test', type: 'mini', duration: 30, attempts: 3 },
    { id: 2, title: 'Full IELTS Practice Test', type: 'full', duration: 180, attempts: 1 },
    { id: 3, title: 'IELTS Listening Section', type: 'mini', duration: 40, attempts: 5 },
    { id: 4, title: 'IELTS Writing Task 1', type: 'mini', duration: 20, attempts: 2 },
    { id: 5, title: 'IELTS Speaking Practice', type: 'mini', duration: 15, attempts: 3 },
  ])
  
  const testStats = reactive({
    total: computed(() => tests.value.length),
    avgDuration: computed(() => {
      const total = tests.value.reduce((sum, test) => sum + test.duration, 0)
      return Math.round(total / tests.value.length)
    }),
    totalAttempts: computed(() => tests.value.reduce((sum, test) => sum + test.attempts, 0)),
  })
  
  const searchQuery = ref('')
  const filteredTests = computed(() => {
    if (!searchQuery.value) return tests.value
    const query = searchQuery.value.toLowerCase()
    return tests.value.filter(test => 
      test.title.toLowerCase().includes(query) || 
      test.type.toLowerCase().includes(query)
    )
  })
  
  const isTestModalOpen = ref(false)
  const isDeleteModalOpen = ref(false)
  const isEditing = ref(false)
  const currentTest = reactive({})
  const testToDelete = reactive({})
  
  const getTypeBadgeClass = (type) => {
    return type === 'mini'
      ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium'
      : 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
  }
  
  const openAddTestModal = () => {
    isEditing.value = false
    Object.assign(currentTest, { title: '', type: 'mini', duration: 30, attempts: 1 })
    isTestModalOpen.value = true
  }
  
  const editTest = (test) => {
    isEditing.value = true
    Object.assign(currentTest, test)
    isTestModalOpen.value = true
  }
  
  const closeTestModal = () => {
    isTestModalOpen.value = false
  }
  
  const saveTest = () => {
    if (isEditing.value) {
      const index = tests.value.findIndex(t => t.id === currentTest.id)
      if (index !== -1) {
        tests.value[index] = { ...currentTest }
      }
    } else {
      tests.value.push({ ...currentTest, id: tests.value.length + 1 })
    }
    closeTestModal()
  }
  
  const deleteTest = (test) => {
    testToDelete.value = test
    isDeleteModalOpen.value = true
  }
  
  const cancelDelete = () => {
    isDeleteModalOpen.value = false
  }
  
  const confirmDelete = () => {
    tests.value = tests.value.filter(t => t.id !== testToDelete.value.id)
    isDeleteModalOpen.value = false
  }
  
  const searchTests = () => {
    // This function is called when the search button is clicked
    // The filtering is already handled by the computed property 'filteredTests'
    console.log('Searching for:', searchQuery.value)
  }
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  
  