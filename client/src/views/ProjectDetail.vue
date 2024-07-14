<template>
  <div>
    <h1 class="font-bold text-2xl mb-2">{{ project.item }}</h1>
    <template v-for="task in tasks">
      <div>
        <input type="checkbox" @change="" />
        <label for="">{{ task.title }}</label>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const project = ref({});
const tasks = ref([]);

// const API_URL = "http://localhost:3000";
const API_URL = "https://winter-hackathon.onrender.com/"

//fetch tasks
onMounted(async () => {
  project.value = await fetch(`${API_URL}/projects/${route.params.id}`)
    .then((response) => response.json())
    .then((data) => data);
  tasks.value = await fetch(`${API_URL}/projects/${route.params.id}/tasks`)
    .then((response) => response.json())
    .then((data) => data.tasks);
});
</script>
