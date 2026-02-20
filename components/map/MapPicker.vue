<template>
  <div class="map-picker">
    <ClientOnly>
      <LMap
        :zoom="13"
        :center="center"
        style="height: 400px; border-radius: 0.75rem;"
        @ready="onMapReady"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <LMarker v-if="markerPosition" :lat-lng="markerPosition" draggable @moveend="handleDrag" />
        <LCircle
          v-if="markerPosition && radius"
          :lat-lng="markerPosition"
          :radius="radius * 1000"
          :color="'#3730A3'"
          :fill-opacity="0.1"
        />
      </LMap>
      <template #fallback>
        <div class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 400px;">
          <AppSpinner text="Cargando mapa..." />
        </div>
      </template>
    </ClientOnly>
    <p v-if="!modelValue" class="text-muted small mt-2 mb-0">
      <Icon name="mdi:gesture-tap" size="16" class="me-1" />
      Toca el mapa para seleccionar tu ubicacion base
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: { lat: number; lng: number } | null;
  radius?: number;
}>();

const emit = defineEmits(['update:modelValue']);

const center = ref<[number, number]>(
  props.modelValue
    ? [props.modelValue.lat, props.modelValue.lng]
    : [19.4326, -99.1332]
);

const markerPosition = computed((): [number, number] | null =>
  props.modelValue ? [props.modelValue.lat, props.modelValue.lng] : null
);

function onMapReady(mapInstance: any) {
  // Fix dimensions when map renders inside a transition/v-if
  setTimeout(() => {
    mapInstance.invalidateSize();
  }, 200);

  // Bind click via Leaflet API directly (more reliable than @click on LMap)
  mapInstance.on('click', (e: any) => {
    emit('update:modelValue', { lat: e.latlng.lat, lng: e.latlng.lng });
  });
}

function handleDrag(e: any) {
  const latLng = e.target.getLatLng();
  emit('update:modelValue', { lat: latLng.lat, lng: latLng.lng });
}
</script>
