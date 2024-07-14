<template>
    <div class="bg-gray-100 p-4 rounded-md">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button>View tasks</button>
    </div>
</template>

<script setup lang="ts">
interface ProjectItemProps {
    title: string
}

defineProps<ProjectItemProps>()
</script>