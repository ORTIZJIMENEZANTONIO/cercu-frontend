<template>
  <div class="app-input">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <div class="input-group" :class="{ 'has-validation': error }">
      <span v-if="$slots.prepend || prependIcon" class="input-group-text">
        <slot name="prepend">
          <Icon v-if="prependIcon" :name="prependIcon" />
        </slot>
      </span>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
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
defineProps<{
  modelValue?: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  error?: string;
  hint?: string;
  id?: string;
  prependIcon?: string;
}>();

defineEmits(['update:modelValue', 'blur']);
</script>
