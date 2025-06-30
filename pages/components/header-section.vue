<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">{{ title }}</h2>
      <div class="flex items-center space-x-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
