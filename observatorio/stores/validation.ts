import { defineStore } from 'pinia'
import { fetchValidationRecords } from '~/services/repositories/validation-repository'
import type { ValidationRecord, NivelConfianza, WithSourceMeta, ValidationRecordExtended } from '~/types'

// ---------------------------------------------------------------------------
// Store state shape
// ---------------------------------------------------------------------------
interface ValidationState {
  records: WithSourceMeta<ValidationRecordExtended>[]
  currentRecord: ValidationRecord | null
  filterEstado: ValidationRecord['estado'] | null
  loading: boolean
}

// ---------------------------------------------------------------------------
// Store definition
// ---------------------------------------------------------------------------
export const useValidationStore = defineStore('validation', {
  state: (): ValidationState => ({
    records: [],
    currentRecord: null,
    filterEstado: null,
    loading: false,
  }),

  getters: {
    /**
     * Number of records still awaiting human review.
     */
    pendingCount(state): number {
      return state.records.filter((r) => r.estado === 'pendiente').length
    },

    /**
     * Records filtered by the current estado filter.
     */
    filteredRecords(state): WithSourceMeta<ValidationRecordExtended>[] {
      if (!state.filterEstado) return state.records
      return state.records.filter((r) => r.estado === state.filterEstado)
    },

    /**
     * Breakdown of records by confianza level.
     */
    statsByConfianza(state): Record<NivelConfianza, { total: number; confirmados: number; rechazados: number; pendientes: number }> {
      const levels: NivelConfianza[] = ['alta', 'media', 'baja']
      const result = {} as Record<
        NivelConfianza,
        { total: number; confirmados: number; rechazados: number; pendientes: number }
      >

      for (const nivel of levels) {
        const subset = state.records.filter((r) => r.confianza === nivel)
        result[nivel] = {
          total: subset.length,
          confirmados: subset.filter((r) => r.estado === 'confirmado').length,
          rechazados: subset.filter((r) => r.estado === 'rechazado').length,
          pendientes: subset.filter((r) => r.estado === 'pendiente').length,
        }
      }

      return result
    },
  },

  actions: {
    /**
     * Load data from the repository (official-first, mock fallback).
     */
    async loadRecords(): Promise<void> {
      this.loading = true
      try {
        const config = useRuntimeConfig()
        const dataMode = config.public.dataMode as string
        this.records = await fetchValidationRecords(dataMode)
      } finally {
        this.loading = false
      }
    },

    /**
     * Mark a record as confirmed by a human reviewer.
     */
    confirmRecord(id: number, reviewer: string): void {
      const record = this.records.find((r) => r.id === id)
      if (!record) return
      record.estado = 'confirmado'
      record.revisadoPor = reviewer
      record.fechaRevision = new Date().toISOString().slice(0, 10)
    },

    /**
     * Mark a record as rejected by a human reviewer.
     */
    rejectRecord(id: number, reviewer: string): void {
      const record = this.records.find((r) => r.id === id)
      if (!record) return
      record.estado = 'rechazado'
      record.revisadoPor = reviewer
      record.fechaRevision = new Date().toISOString().slice(0, 10)
    },

    /**
     * Mark a record as indeterminate (needs further analysis).
     */
    markIndeterminate(id: number, reviewer: string): void {
      const record = this.records.find((r) => r.id === id)
      if (!record) return
      record.estado = 'indeterminado'
      record.revisadoPor = reviewer
      record.fechaRevision = new Date().toISOString().slice(0, 10)
    },

    /**
     * Set the estado filter. Pass `null` to show all.
     */
    setFilterEstado(estado: ValidationRecord['estado'] | null): void {
      this.filterEstado = estado
    },

    /**
     * Set the current record for detail/review view.
     */
    setCurrentRecord(record: ValidationRecord | null): void {
      this.currentRecord = record
    },
  },
})
