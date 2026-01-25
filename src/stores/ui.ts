import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DayInfo } from '@/types'

export type TabType = 'dashboard' | 'goals' | 'history'

export const useUIStore = defineStore('ui', () => {
  // State
  const activeTab = ref<TabType>('dashboard')
  const userMenuOpen = ref(false)
  const deleteConfirmExpenseId = ref<string | null>(null)
  const showClearDataConfirm = ref(false)
  const expandedPeriods = ref<Record<string, boolean>>({})
  const newPeriodDialogVisible = ref(false)
  const newExpenseAmount = ref<number | null>(null)
  const newExpenseNote = ref('')
  const newBudgetAmount = ref<number | null>(null)
  const selectedDay = ref<DayInfo | null>(null)

  // Actions
  function setActiveTab(tab: TabType) {
    activeTab.value = tab
  }

  function toggleUserMenu() {
    userMenuOpen.value = !userMenuOpen.value
  }

  function closeUserMenu() {
    userMenuOpen.value = false
  }

  function openDeleteConfirm(expenseId: string) {
    deleteConfirmExpenseId.value = expenseId
  }

  function closeDeleteConfirm() {
    deleteConfirmExpenseId.value = null
  }

  function openClearDataConfirm() {
    showClearDataConfirm.value = true
  }

  function closeClearDataConfirm() {
    showClearDataConfirm.value = false
  }

  function togglePeriodExpanded(periodId: string) {
    expandedPeriods.value[periodId] = !expandedPeriods.value[periodId]
  }

  function openNewPeriodDialog() {
    newPeriodDialogVisible.value = true
  }

  function closeNewPeriodDialog() {
    newPeriodDialogVisible.value = false
    newBudgetAmount.value = null
  }

  function resetExpenseForm() {
    newExpenseAmount.value = null
    newExpenseNote.value = ''
  }

  function selectDay(day: DayInfo) {
    selectedDay.value = day
  }

  function clearSelectedDay() {
    selectedDay.value = null
  }

  function resetUIState() {
    activeTab.value = 'dashboard'
    userMenuOpen.value = false
    deleteConfirmExpenseId.value = null
    showClearDataConfirm.value = false
    expandedPeriods.value = {}
    newPeriodDialogVisible.value = false
    newExpenseAmount.value = null
    newExpenseNote.value = ''
    newBudgetAmount.value = null
    selectedDay.value = null
  }

  return {
    // State
    activeTab,
    userMenuOpen,
    deleteConfirmExpenseId,
    showClearDataConfirm,
    expandedPeriods,
    newPeriodDialogVisible,
    newExpenseAmount,
    newExpenseNote,
    newBudgetAmount,
    selectedDay,
    // Actions
    setActiveTab,
    toggleUserMenu,
    closeUserMenu,
    openDeleteConfirm,
    closeDeleteConfirm,
    openClearDataConfirm,
    closeClearDataConfirm,
    togglePeriodExpanded,
    openNewPeriodDialog,
    closeNewPeriodDialog,
    resetExpenseForm,
    selectDay,
    clearSelectedDay,
    resetUIState,
  }
})
