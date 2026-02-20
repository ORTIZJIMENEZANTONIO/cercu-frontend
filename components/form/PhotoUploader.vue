<template>
  <div class="photo-uploader">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="d-flex flex-wrap gap-2">
      <div
        v-for="(photo, index) in modelValue"
        :key="index"
        class="photo-preview position-relative"
      >
        <img :src="photo" alt="Preview" class="rounded" />
        <button
          type="button"
          class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-0"
          style="width: 24px; height: 24px;"
          @click="removePhoto(index)"
        >
          <Icon name="mdi:close" size="14" />
        </button>
      </div>
      <label
        v-if="modelValue.length < max"
        class="photo-add d-flex align-items-center justify-content-center rounded border-dashed"
      >
        <input
          type="file"
          accept="image/*"
          multiple
          class="d-none"
          @change="handleFiles"
        />
        <div class="text-center text-muted">
          <Icon name="mdi:camera-plus" size="24" />
          <div class="small mt-1">Agregar foto</div>
        </div>
      </label>
    </div>
    <div class="form-text">Maximo {{ max }} fotos</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[];
  label?: string;
  max?: number;
}>();

const emit = defineEmits(['update:modelValue']);

const max = computed(() => props.max || 4);

function removePhoto(index: number) {
  const newPhotos = [...props.modelValue];
  newPhotos.splice(index, 1);
  emit('update:modelValue', newPhotos);
}

async function handleFiles(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const remaining = max.value - props.modelValue.length;
  const files = Array.from(input.files).slice(0, remaining);
  const newPhotos: string[] = [];

  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) continue; // 5MB limit
    const dataUrl = await readFileAsDataURL(file);
    newPhotos.push(dataUrl);
  }

  emit('update:modelValue', [...props.modelValue, ...newPhotos]);
  input.value = '';
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
</script>

<style lang="scss" scoped>
.photo-preview {
  width: 80px;
  height: 80px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.photo-add {
  width: 80px;
  height: 80px;
  cursor: pointer;
  border: 2px dashed $neutral-300;
  border-radius: $border-radius;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: $cercu-indigo;
  }
}
</style>
