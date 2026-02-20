export function useGeolocation() {
  const lat = ref<number | null>(null);
  const lng = ref<number | null>(null);
  const address = ref('');
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getCurrentPosition() {
    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported';
      return;
    }

    loading.value = true;
    error.value = null;

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          lat.value = position.coords.latitude;
          lng.value = position.coords.longitude;
          await reverseGeocode(lat.value, lng.value);
          loading.value = false;
          resolve();
        },
        (err) => {
          error.value = err.message;
          loading.value = false;
          resolve();
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  async function reverseGeocode(latitude: number, longitude: number) {
    try {
      const data: any = await $fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'es' } }
      );
      address.value = data.display_name || '';
    } catch {
      address.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  }

  return { lat, lng, address, loading, error, getCurrentPosition, reverseGeocode };
}
