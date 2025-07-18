<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  hasDelete: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="flex justify-end gap-2">
    <Button variant="ghost" size="icon" @click="$emit('edit', item)">
      <Icon name="lucide:edit" class="h-4 w-4" />
    </Button>
    <Button v-if="hasDelete" variant="ghost" size="icon" @click="$emit('delete', item)">
      <Icon name="lucide:trash-2" class="h-4 w-4 text-red-500" />
    </Button>
  </div>
</template>
