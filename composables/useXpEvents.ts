import { ref, readonly } from 'vue';

const xpQueue = ref<{ amount: number; id: number }[]>([]);
const currentXp = ref<{ amount: number; id: number } | null>(null);
const visible = ref(false);
let nextId = 0;

function processQueue() {
  if (visible.value || xpQueue.value.length === 0) return;
  currentXp.value = xpQueue.value.shift()!;
  visible.value = true;
}

export function useXpEvents() {
  function showXpGain(amount: number) {
    xpQueue.value.push({ amount, id: nextId++ });
    processQueue();
  }

  function onDone() {
    visible.value = false;
    currentXp.value = null;
    setTimeout(processQueue, 200);
  }

  return {
    currentXp: readonly(currentXp),
    visible: readonly(visible),
    showXpGain,
    onDone,
  };
}
