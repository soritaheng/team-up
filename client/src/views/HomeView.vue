<template>
  <div>
    <h1 class="font-bold text-2xl mb-4">Projects</h1>
    <div>
      <ProjectInput
        :input="input"
        @update:input="(event) => (input = event)"
        @getTasks="generateTasks(input, getProjects)"
        class="mb-4"
      ></ProjectInput>
      <div v-for="project in projects">
        <RouterLink :to="`${project.id}`">
          <ProjectItem :title="project.item" class="mt-4"></ProjectItem>
        </RouterLink>
      </div>
      <div
        v-if="isLoading"
        class="my-4 mx-auto border-gray-300 h-16 w-16 animate-spin rounded-full border-8 border-t-cyan-400"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import ProjectInput from "../components/ProjectInput.vue";
import ProjectItem from "../components/ProjectItem.vue";
import { response } from "express";

const API_URL = "http://localhost:3000";

const projects = ref([]);
const input = ref("");
const isLoading = ref(false);

const generateTasks = async (prompt, callback) => {
  isLoading.value = true;
  //add project to database
  let { projectId } = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item: prompt }),
  })
    .then((res) => res.json())
    .then((data) => data);

  //generate tasks

  let tasks = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item: prompt }),
  })
    .then((res) => res.json())
    .then((data) => data);

  for (let i = 0; i < tasks.length - 1; i++) {
    try {
      fetch(`${API_URL}/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: tasks[i], completed: false }),
      })
        .then((res) => res.json())
        .then((data) => data);
    } catch (error) {
      alert(error);
    }
  }
  await getProjects();

  isLoading.value = false;
  input.value = "";
};

const getProjects = async () => {
  try {
    projects.value = await fetch(`${API_URL}/projects`)
      .then((response) => response.json())
      .then((data) => data);
  } catch (error) {
    alert(error);
  }
  console.log(projects.value);
};

onMounted(async () => await getProjects());
</script>
