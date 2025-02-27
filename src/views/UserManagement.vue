<template>
    <div class="user-management">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-xl font-semibold mb-4">User Statistics</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-100 rounded-lg p-4 flex items-center">
            <i class="fas fa-user-graduate text-3xl text-blue-500 mr-4"></i>
            <div>
              <p class="text-sm text-blue-600">Total Students</p>
              <p class="text-2xl font-bold text-blue-800">{{ userStats.students }}</p>
            </div>
          </div>
          <div class="bg-green-100 rounded-lg p-4 flex items-center">
            <i class="fas fa-chalkboard-teacher text-3xl text-green-500 mr-4"></i>
            <div>
              <p class="text-sm text-green-600">Total Teachers</p>
              <p class="text-2xl font-bold text-green-800">{{ userStats.teachers }}</p>
            </div>
          </div>
          <div class="bg-purple-100 rounded-lg p-4 flex items-center">
            <i class="fas fa-user-shield text-3xl text-purple-500 mr-4"></i>
            <div>
              <p class="text-sm text-purple-600">Total Admins</p>
              <p class="text-2xl font-bold text-purple-800">{{ userStats.admins }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">User List</h3>
          <button @click="openAddUserModal" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center">
            <i class="fas fa-plus mr-2"></i> Add User
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left">Name</th>
                <th class="py-3 px-4 text-left">Email</th>
                <th class="py-3 px-4 text-left">Role</th>
                <th class="py-3 px-4 text-left">Status</th>
                <th class="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-4">{{ user.name }}</td>
                <td class="py-3 px-4">{{ user.email }}</td>
                <td class="py-3 px-4">
                  <span :class="getRoleBadgeClass(user.role)">{{ user.role }}</span>
                </td>
                <td class="py-3 px-4">
                  <span :class="getStatusBadgeClass(user.status)">{{ user.status }}</span>
                </td>
                <td class="py-3 px-4">
                  <button @click="editUser(user)" class="text-blue-500 hover:text-blue-700 mr-2">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteUser(user)" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Add/Edit User Modal -->
      <div v-if="isUserModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 w-full max-w-md">
          <h3 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
          <form @submit.prevent="saveUser">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
              <input v-model="currentUser.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
              <input v-model="currentUser.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="role">Role</label>
              <select v-model="currentUser.role" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="role">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="status">Status</label>
              <select v-model="currentUser.status" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="flex justify-end">
              <button type="button" @click="closeUserModal" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
                Cancel
              </button>
              <button type="submit" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
                {{ isEditing ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  
  const users = ref([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'teacher', status: 'active' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
  ])
  
  const userStats = reactive({
    students: 150,
    teachers: 20,
    admins: 5,
  })
  
  const isUserModalOpen = ref(false)
  const isEditing = ref(false)
  const currentUser = reactive({})
  
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium'
      case 'teacher': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      case 'admin': return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium'
      default: return ''
    }
  }
  
  const getStatusBadgeClass = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      : 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'
  }
  
  const openAddUserModal = () => {
    isEditing.value = false
    Object.assign(currentUser, { name: '', email: '', role: 'student', status: 'active' })
    isUserModalOpen.value = true
  }
  
  const editUser = (user) => {
    isEditing.value = true
    Object.assign(currentUser, user)
    isUserModalOpen.value = true
  }
  
  const closeUserModal = () => {
    isUserModalOpen.value = false
  }
  
  const saveUser = () => {
    if (isEditing.value) {
      const index = users.value.findIndex(u => u.id === currentUser.id)
      if (index !== -1) {
        users.value[index] = { ...currentUser }
      }
    } else {
      users.value.push({ ...currentUser, id: users.value.length + 1 })
    }
    closeUserModal()
  }
  
  const deleteUser = (user) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      users.value = users.value.filter(u => u.id !== user.id)
    }
  }
  </script>