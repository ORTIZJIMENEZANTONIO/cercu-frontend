<template>
  <div class="otp-input">
    <label v-if="label" class="form-label text-center d-block">{{ label }}</label>
    <div class="otp-input-group">
      <input
        v-for="(_, i) in length"
        :key="i"
        :ref="(el) => { if (el) inputs[i] = el as HTMLInputElement }"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="otp-digit"
        :value="digits[i]"
        @input="handleDigit(i, $event)"
        @keydown.backspace="handleBackspace(i)"
        @paste="handlePaste"
      />
    </div>
    <div v-if="error" class="invalid-feedback d-block text-center mt-2">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  length?: number;
  label?: string;
  error?: string;
}>();

const emit = defineEmits(['update:modelValue', 'complete']);

const length = computed(() => props.length || 4);
const inputs = ref<HTMLInputElement[]>([]);
const digits = computed(() => props.modelValue.split(''));

function handleDigit(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const val = input.value.replace(/\D/g, '');
  if (!val) return;

  const newCode = props.modelValue.split('');
  newCode[index] = val[0];
  const code = newCode.join('').slice(0, length.value);
  emit('update:modelValue', code);

  if (index < length.value - 1) {
    nextTick(() => inputs.value[index + 1]?.focus());
  }

  if (code.length === length.value) {
    emit('complete', code);
  }
}

function handleBackspace(index: number) {
  if (!digits.value[index] && index > 0) {
    nextTick(() => inputs.value[index - 1]?.focus());
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, length.value) || '';
  emit('update:modelValue', pasted);
  if (pasted.length === length.value) {
    emit('complete', pasted);
  }
}
</script>
