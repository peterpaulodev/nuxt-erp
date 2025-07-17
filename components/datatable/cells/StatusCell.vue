<script setup>
defineProps({
  isActive: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div class="flex items-center">
    <Switch :checked="isActive" :disabled="disabled" />
  </div>
</template>
