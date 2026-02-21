<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Gamificación</h1>
      <p class="page-subtitle">Tu progreso, logros y misiones semanales</p>
    </div>

    <!-- Level + Trust Row -->
    <div class="row g-3 mb-3">
      <!-- Level Progress -->
      <div class="col-12 col-md-8">
        <div :class="{ 'anim-in': mounted }" class="anim-wrapper">
          <LevelProgress
            v-if="gamStore.dashboard"
            :level="gamStore.dashboard.currentLevel"
            :name="gamStore.dashboard.levelName"
            :icon="gamStore.dashboard.levelIcon"
            :total-x-p="gamStore.dashboard.totalXP"
            :current-level-x-p="gamStore.dashboard.xpForCurrentLevel"
            :next-x-p="gamStore.dashboard.xpForNextLevel"
            :progress="gamStore.xpProgress"
          />
        </div>
      </div>

      <!-- Trust Gauge -->
      <div class="col-12 col-md-4">
        <div class="content-card text-center" :class="{ 'anim-in': mounted }" style="transition-delay: 0.05s">
          <TrustGauge :score="trustScore" />
          <p class="text-muted small mb-0">Confianza Cercu</p>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row mb-3" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
      <div class="stat-card">
        <div class="stat-card-icon stat-card-icon--xp"><Icon name="mdi:star-four-points" size="20" /></div>
        <div class="stat-card-value">{{ gamStore.totalXP }}</div>
        <div class="stat-card-label">XP Total</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon stat-card-icon--streak"><Icon name="mdi:fire" size="20" /></div>
        <div class="stat-card-value">{{ gamStore.dashboard?.consecutiveCompletions || 0 }}</div>
        <div class="stat-card-label">Racha</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon stat-card-icon--achievements"><Icon name="mdi:trophy" size="20" /></div>
        <div class="stat-card-value">{{ gamStore.dashboard?.earnedAchievements || 0 }}/{{ gamStore.dashboard?.totalAchievements || 0 }}</div>
        <div class="stat-card-label">Logros</div>
      </div>
    </div>

    <div class="row g-3">
      <!-- Weekly Missions -->
      <div class="col-12 col-lg-5">
        <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.15s">
          <h5 class="content-card-title">
            <Icon name="mdi:target" size="20" class="me-2 text-indigo" />
            Misiones de la semana
          </h5>
          <div v-if="gamStore.activeMissions.length" class="missions-list">
            <MissionCard v-for="m in gamStore.missions" :key="m.id" :mission="m" />
          </div>
          <div v-else class="text-muted small text-center py-3">
            <Icon name="mdi:calendar-clock" size="32" class="d-block mx-auto mb-2 text-muted" />
            Las misiones se asignan cada lunes
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="col-12 col-lg-7">
        <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.2s">
          <h5 class="content-card-title">
            <Icon name="mdi:trophy" size="20" class="me-2 text-indigo" />
            Logros
          </h5>
          <!-- Filter tabs -->
          <div class="achievement-tabs mb-3">
            <button class="tab-btn" :class="{ active: achievementFilter === 'all' }" @click="achievementFilter = 'all'">Todos</button>
            <button class="tab-btn" :class="{ active: achievementFilter === 'earned' }" @click="achievementFilter = 'earned'">Obtenidos</button>
            <button class="tab-btn" :class="{ active: achievementFilter === 'locked' }" @click="achievementFilter = 'locked'">Por obtener</button>
          </div>
          <div class="achievements-grid">
            <AchievementBadge
              v-for="a in filteredAchievements"
              :key="a.id"
              :name="a.name"
              :description="a.description"
              :icon="a.icon"
              :earned="a.earned"
              :reward="a.reward"
            />
          </div>
          <div v-if="!filteredAchievements.length" class="text-muted small text-center py-3">
            No hay logros en esta categoría
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'professional', middleware: ['role'] });

const gamStore = useGamificationStore();
const mounted = ref(false);
const achievementFilter = ref('all');
const trustScore = ref(0);

const filteredAchievements = computed(() => {
  if (achievementFilter.value === 'earned') return gamStore.earnedAchievements;
  if (achievementFilter.value === 'locked') return gamStore.lockedAchievements;
  return gamStore.achievements;
});

onMounted(() => {
  requestAnimationFrame(() => { mounted.value = true; });
  Promise.all([
    gamStore.fetchDashboard().catch(() => {}),
    gamStore.fetchAchievements().catch(() => {}),
    gamStore.fetchMissions().catch(() => {}),
    gamStore.fetchTrustScore().catch(() => {}),
  ]).then(() => {
    trustScore.value = gamStore.trustScore?.score ?? 0;
  });
});

useHead({ title: 'Gamificación - CERCU Pro' });
</script>

<style lang="scss" scoped>
.page-header { margin-bottom: 1.25rem; opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.page-title { font-family: $headings-font-family; font-size: 1.375rem; font-weight: 700; color: $neutral-900; margin-bottom: 0.25rem; }
.page-subtitle { font-size: 0.875rem; color: $neutral-600; margin-bottom: 0; }
.anim-wrapper { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.content-card { background: white; border: 1px solid $neutral-200; border-radius: 16px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } @media (min-width: 768px) { padding: 1.5rem; } }
.content-card-title { display: flex; align-items: center; font-size: 1rem; font-weight: 600; color: $neutral-800; margin-bottom: 1rem; }
.text-indigo { color: $cercu-indigo; }

.stats-row { display: flex; gap: 0.75rem; overflow-x: auto; scrollbar-width: none; opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease 0.05s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.05s; &.anim-in { opacity: 1; transform: translateY(0); } &::-webkit-scrollbar { display: none; } @media (min-width: 768px) { display: grid; grid-template-columns: repeat(3, 1fr); } }
.stat-card { flex-shrink: 0; min-width: 110px; background: white; border: 1px solid $neutral-200; border-radius: 14px; padding: 1rem; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); }
.stat-card-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.5rem; background: $neutral-50; border: 1px solid $neutral-100; &--xp { color: $cercu-indigo; } &--streak { color: $cercu-coral; } &--achievements { color: $warning; } }
.stat-card-value { font-family: $headings-font-family; font-size: 1.25rem; font-weight: 700; color: $neutral-900; }
.stat-card-label { font-size: 0.65rem; font-weight: 500; color: $neutral-500; text-transform: uppercase; letter-spacing: 0.03em; }

.missions-list { display: flex; flex-direction: column; gap: 0.625rem; }

.achievement-tabs { display: flex; gap: 0.5rem; }
.tab-btn { padding: 0.375rem 0.875rem; border-radius: 999px; font-size: 0.75rem; font-weight: 500; border: 1px solid $neutral-200; background: white; color: $neutral-600; cursor: pointer; transition: all 0.2s ease; &:hover { color: $cercu-indigo; border-color: rgba($cercu-indigo, 0.3); } &.active { color: white; background: $cercu-indigo; border-color: $cercu-indigo; box-shadow: 0 2px 8px rgba($cercu-indigo, 0.3); } }

.achievements-grid { display: flex; flex-direction: column; gap: 0.625rem; }
</style>
