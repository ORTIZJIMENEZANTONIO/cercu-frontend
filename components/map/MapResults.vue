<template>
  <div class="map-results">
    <ClientOnly>
      <LMap
        :zoom="12"
        :center="center"
        style="height: 500px; border-radius: 0.75rem;"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <LMarker
          v-for="marker in markers"
          :key="marker.id"
          :lat-lng="[marker.lat, marker.lng]"
        >
          <LPopup>
            <strong>{{ marker.title }}</strong>
            <p class="mb-0 small">{{ marker.description }}</p>
          </LPopup>
        </LMarker>
      </LMap>
      <template #fallback>
        <div class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 500px;">
          <AppSpinner text="Cargando mapa..." />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
interface Marker {
  id: number | string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
}

const props = defineProps<{
  markers: Marker[];
  center?: [number, number];
}>();

const center = computed(() => {
  if (props.center) return props.center;
  if (props.markers.length > 0) {
    return [props.markers[0].lat, props.markers[0].lng] as [number, number];
  }
  return [19.4326, -99.1332] as [number, number]; // CDMX
});
</script>
