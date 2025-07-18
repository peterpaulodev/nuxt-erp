<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
})

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(props.value)
})
</script>

<template>
  <div class="font-medium">
    {{ formattedPrice }}
  </div>
</template>
