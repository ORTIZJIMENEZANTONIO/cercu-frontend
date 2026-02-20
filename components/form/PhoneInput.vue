<template>
  <div class="phone-input">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="input-group">
      <span class="input-group-text">+52</span>
      <input
        type="tel"
        :value="modelValue"
        placeholder="55 1234 5678"
        class="form-control"
        :class="{ 'is-invalid': error }"
        maxlength="15"
        @input="handleInput"
      />
    </div>
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  label?: string;
  error?: string;
}>();

const emit = defineEmits(['update:modelValue']);

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  emit('update:modelValue', value);
}
</script>
