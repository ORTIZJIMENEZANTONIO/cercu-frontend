<template>
  <div class="app-select">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      class="form-select"
      :class="{ 'is-invalid': error }"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="typeof opt === 'string' ? opt : opt.value"
        :value="typeof opt === 'string' ? opt : opt.value"
      >
        {{ typeof opt === 'string' ? opt : opt.label }}
      </option>
    </select>
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string | number;
  label?: string;
  options: (string | { value: string | number; label: string })[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
}>();

defineEmits(['update:modelValue']);
</script>
