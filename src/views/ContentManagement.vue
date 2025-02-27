<template>
    <div class="content-management">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-xl font-semibold mb-4">Content Overview</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-blue-100 rounded-lg p-4 flex items-center">
            <i class="fas fa-book text-3xl text-blue-500 mr-4"></i>
            <div>
              <p class="text-sm text-blue-600">Total Courses</p>
              <p class="text-2xl font-bold text-blue-800">{{ contentStats.courses }}</p>
            </div>
          </div>
          <div class="bg-green-100 rounded-lg p-4 flex items-center">
            <i class="fas fa-file-alt text-3xl text-green-500 mr-4"></i>
            <div>
              <p class="text-sm text-green-600">Total Lessons</p>
              <p class="text-2xl font-bold text-green-800">{{ contentStats.lessons }}</p>
            </div>
          </div>
          <div class="bg-yellow-100 rounded-lg p-4 flex items-center">
            <i class="fas fa-question-circle text-3xl text-yellow-500 mr-4"></i>
            <div>
              <p class="text-sm text-yellow-600">Total Questions</p>
              <p class="text-2xl font-bold text-yellow-800">{{ contentStats.questions }}</p>
            </div>
          </div>
          <div class="bg-purple-100 rounded-lg p-4 flex items-center">
            <i class="fas fa-file-video text-3xl text-purple-500 mr-4"></i>
            <div>
              <p class="text-sm text-purple-600">Total Materials</p>
              <p class="text-2xl font-bold text-purple-800">{{ contentStats.materials }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Content Management</h3>
          <div>
            <button @click="activeTab = 'courses'" :class="getTabClass('courses')" class="mr-2">Courses</button>
            <button @click="activeTab = 'questions'" :class="getTabClass('questions')">Question Bank</button>
          </div>
        </div>
  
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'courses'" key="courses">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-semibold">Courses</h4>
              <button @click="openAddCourseModal" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center">
                <i class="fas fa-plus mr-2"></i> Add Course
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="py-3 px-4 text-left">Title</th>
                    <th class="py-3 px-4 text-left">Level</th>
                    <th class="py-3 px-4 text-left">Skill</th>
                    <th class="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in courses" :key="course.id" class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4">{{ course.title }}</td>
                    <td class="py-3 px-4">
                      <span :class="getLevelBadgeClass(course.level)">{{ course.level }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <span :class="getSkillBadgeClass(course.skill)">{{ course.skill }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <button @click="editCourse(course)" class="text-blue-500 hover:text-blue-700 mr-2">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="deleteCourse(course)" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          <div v-else-if="activeTab === 'questions'" key="questions">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-semibold">Question Bank</h4>
              <button @click="openAddQuestionModal" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center">
                <i class="fas fa-plus mr-2"></i> Add Question
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="py-3 px-4 text-left">Type</th>
                    <th class="py-3 px-4 text-left">Difficulty</th>
                    <th class="py-3 px-4 text-left">Skill</th>
                    <th class="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="question in questions" :key="question.id" class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4">{{ question.type }}</td>
                    <td class="py-3 px-4">
                      <span :class="getDifficultyBadgeClass(question.difficulty)">{{ question.difficulty }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <span :class="getSkillBadgeClass(question.skill)">{{ question.skill }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <button @click="editQuestion(question)" class="text-blue-500 hover:text-blue-700 mr-2">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="deleteQuestion(question)" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </transition>
      </div>
  
      <!-- Add/Edit Course Modal -->
      <div v-if="isCourseModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 w-full max-w-md">
          <h3 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Course' : 'Add Course' }}</h3>
          <form @submit.prevent="saveCourse">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title</label>
              <input v-model="currentCourse.title" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="level">Level</label>
              <select v-model="currentCourse.level" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="level">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="skill">Skill</label>
              <select v-model="currentCourse.skill" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="skill">
                <option value="Listening">Listening</option>
                <option value="Reading">Reading</option>
                <option value="Writing">Writing</option>
                <option value="Speaking">Speaking</option>
              </select>
            </div>
            <div class="flex justify-end">
              <button type="button" @click="closeCourseModal" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
                Cancel
              </button>
              <button type="submit" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
                {{ isEditing ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Add/Edit Question Modal -->
      <div v-if="isQuestionModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 w-full max-w-md">
          <h3 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Question' : 'Add Question' }}</h3>
          <form @submit.prevent="saveQuestion">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="type">Type</label>
              <select v-model="currentQuestion.type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="type">
                <option value="Multiple Choice">Multiple Choice</option>
                <option value="True/False">True/False</option>
                <option value="Essay">Essay</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="difficulty">Difficulty</label>
              <select v-model="currentQuestion.difficulty" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="difficulty">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="skill">Skill</label>
              <select v-model="currentQuestion.skill" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="skill">
                <option value="Listening">Listening</option>
                <option value="Reading">Reading</option>
                <option value="Writing">Writing</option>
                <option value="Speaking">Speaking</option>
              </select>
            </div>
            <div class="flex justify-end">
              <button type="button" @click="closeQuestionModal" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
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
  
  const activeTab = ref('courses')
  const contentStats = reactive({
    courses: 25,
    lessons: 150,
    questions: 500,
    materials: 200,
  })
  
  const courses = ref([
    { id: 1, title: 'IELTS Listening Basics', level: 'Beginner', skill: 'Listening' },
    { id: 2, title: 'Advanced IELTS Writing', level: 'Advanced', skill: 'Writing' },
    { id: 3, title: 'IELTS Reading Strategies', level: 'Intermediate', skill: 'Reading' },
  ])
  
  const questions = ref([
    { id: 1, type: 'Multiple Choice', difficulty: 'Easy', skill: 'Reading' },
    { id: 2, type: 'Essay', difficulty: 'Hard', skill: 'Writing' },
    { id: 3, type: 'True/False', difficulty: 'Medium', skill: 'Listening' },
  ])
  
  const isCourseModalOpen = ref(false)
  const isQuestionModalOpen = ref(false)
  const isEditing = ref(false)
  const currentCourse = reactive({})
  const currentQuestion = reactive({})
  
  const getTabClass = (tab) => {
    return activeTab.value === tab
      ? 'bg-indigo-500 text-white px-4 py-2 rounded-md'
      : 'bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300'
  }
  
  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium'
      case 'Advanced': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'
      default: return ''
    }
  }
  
  const getSkillBadgeClass = (skill) => {
    switch (skill) {
      case 'Listening': return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium'
      case 'Reading': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      case 'Writing': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium'
      case 'Speaking': return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium'
      default: return ''
    }
  }
  
  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium'
      case 'Hard': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'
      default: return ''
    }
  }
  
  const openAddCourseModal = () => {
    isEditing.value = false
    Object.assign(currentCourse, { title: '', level: 'Beginner', skill: 'Listening' })
    isCourseModalOpen.value = true
  }
  
  const editCourse = (course) => {
    isEditing.value = true
    Object.assign(currentCourse, course)
    isCourseModalOpen.value = true
  }
  
  const closeCourseModal = () => {
    isCourseModalOpen.value = false
  }
  
  const saveCourse = () => {
    if (isEditing.value) {
      const index = courses.value.findIndex(c => c.id === currentCourse.id)
      if (index !== -1) {
        courses.value[index] = { ...currentCourse }
      }
    } else {
      courses.value.push({ ...currentCourse, id: courses.value.length + 1 })
    }
    closeCourseModal()
  }
  
  const deleteCourse = (course) => {
    if (confirm(`Are you sure you want to delete the course "${course.title}"?`)) {
      courses.value = courses.value.filter(c => c.id !== course.id)
    }
  }
  
  const openAddQuestionModal = () => {
    isEditing.value = false
    Object.assign(currentQuestion, { type: 'Multiple Choice', difficulty: 'Easy', skill: 'Listening' })
    isQuestionModalOpen.value = true
  }
  
  const editQuestion = (question) => {
    isEditing.value = true
    Object.assign(currentQuestion, question)
    isQuestionModalOpen.value = true
  }
  
  const closeQuestionModal = () => {
    isQuestionModalOpen.value = false
  }
  
  const saveQuestion = () => {
    if (isEditing.value) {
      const index = questions.value.findIndex(q => q.id === currentQuestion.id)
      if (index !== -1) {
        questions.value[index] = { ...currentQuestion }
      }
    } else {
      questions.value.push({ ...currentQuestion, id: questions.value.length + 1 })
    }
    closeQuestionModal()
  }
  
  const deleteQuestion = (question) => {
    if (confirm(`Are you sure you want to delete this question?`)) {
      questions.value = questions.value.filter(q => q.id !== question.id)
    }
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
  
  