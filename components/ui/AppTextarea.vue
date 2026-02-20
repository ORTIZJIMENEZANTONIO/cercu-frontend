<template>
  <div class="app-textarea">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      class="form-control"
      :class="{ 'is-invalid': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
    <div v-if="hint && !error" class="form-text">
      {{ hint }}
      <span v-if="maxLength" class="float-end">
        {{ (modelValue || '').toString().length }}/{{ maxLength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: string;
  hint?: string;
  id?: string;
  maxLength?: number;
}>();

defineEmits(['update:modelValue']);
</script>
