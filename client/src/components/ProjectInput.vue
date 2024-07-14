<template>
    <div class="flex gap-4">
        <input :value="props.input" type="text" placeholder="Enter project..." @input="$emit('update:input', $event.target.value)" class="w-full border border-slate-400 p-2 rounded-md focus:outline-none focus:border-slate-800">
        <button @click="$emit('getTasks')" class="bg-cyan-400 p-2 rounded-md font-medium min-w-[140px]">Get Tasks</button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['input'])
const emit = defineEmits(['update:input', 'getTasks'])
</script>