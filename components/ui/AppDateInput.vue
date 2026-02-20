<template>
  <div class="app-input">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <div class="input-group" :class="{ 'has-validation': error }">
      <span v-if="prependIcon" class="input-group-text">
        <Icon :name="prependIcon" />
      </span>
      <input
        :id="id"
        type="date"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :max="maxDate"
        class="form-control"
        :class="{ 'is-invalid': error }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
      />
      <div v-if="error" class="invalid-feedback">{{ error }}</div>
    </div>
    <div v-if="hint && !error" class="form-text">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  id?: string;
  prependIcon?: string;
  maxDate?: string;
}>()

defineEmits(['update:modelValue', 'blur'])
</script>
