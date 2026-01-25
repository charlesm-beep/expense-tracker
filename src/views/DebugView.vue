<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const output = ref<string[]>([])
const loading = ref(true)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function log(message: string, isError = false) {
  const prefix = isError ? '❌' : '✅'
  output.value.push(`${prefix} ${message}`)
}

async function runTests() {
  output.value = []
  loading.value = true

  try {
    // Test 1: Auth Session
    log('Test 1: Checking auth session...')
    const { data: { session }, error: authError } = await supabase.auth.getSession()

    if (authError) {
      log(`Auth Error: ${authError.message}`, true)
      log(`Error Details: ${JSON.stringify(authError)}`, true)
    } else {
      log(`Auth OK - User: ${session?.user?.email || 'Not logged in'}`)
    }

    // Test 2: Query periods table
    log('Test 2: Querying periods table...')
    const { data: periods, error: periodsError } = await supabase
      .from('periods')
      .select('id')
      .limit(1)

    if (periodsError) {
      log(`Periods Error: ${periodsError.message}`, true)
      log(`Error Code: ${periodsError.code}`, true)
      log(`Error Details: ${periodsError.details || 'N/A'}`, true)
      log(`Error Hint: ${periodsError.hint || 'N/A'}`, true)
      log(`Full Error: ${JSON.stringify(periodsError, null, 2)}`, true)
    } else {
      log(`Periods table OK - Found ${periods?.length || 0} periods`)
    }

    // Test 3: Query expenses table
    log('Test 3: Querying expenses table...')
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id')
      .limit(1)

    if (expensesError) {
      log(`Expenses Error: ${expensesError.message}`, true)
      log(`Error Code: ${expensesError.code}`, true)
      log(`Full Error: ${JSON.stringify(expensesError, null, 2)}`, true)
    } else {
      log(`Expenses table OK - Found ${expenses?.length || 0} expenses`)
    }

    // Test 4: Full query with join (this is what syncFromCloud does)
    if (session?.user) {
      log('Test 4: Running full query (periods with expenses)...')
      const { data: fullPeriods, error: fullError } = await supabase
        .from('periods')
        .select(`
          *,
          expenses (*)
        `)
        .order('start_date', { ascending: false })

      if (fullError) {
        log(`FULL QUERY ERROR: ${fullError.message}`, true)
        log(`Error Code: ${fullError.code}`, true)
        log(`Error Details: ${fullError.details || 'N/A'}`, true)
        log(`Error Hint: ${fullError.hint || 'N/A'}`, true)
        log(`Full Error Object: ${JSON.stringify(fullError, null, 2)}`, true)
      } else {
        log(`Full query SUCCESS - Found ${fullPeriods?.length || 0} periods`)
        if (fullPeriods && fullPeriods.length > 0) {
          log(`Data: ${JSON.stringify(fullPeriods, null, 2)}`)
        }
      }
    } else {
      log('Skipping Test 4 - not logged in')
    }

  } catch (error: any) {
    log(`Unexpected error: ${error.message}`, true)
    console.error('Test error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  runTests()
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-4">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">🔍 Supabase Connection Diagnostics</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="text-center py-4">
          <p class="text-muted-foreground">Running tests...</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="(line, index) in output"
            :key="index"
            :class="line.startsWith('❌') ? 'text-red-600' : 'text-green-600'"
            class="font-mono text-sm"
          >
            {{ line }}
          </div>
        </div>

        <div class="mt-6 pt-6 border-t">
          <button
            @click="runTests"
            class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Run Tests Again
          </button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Environment Check</CardTitle>
      </CardHeader>
      <CardContent class="font-mono text-sm space-y-1">
        <p>Supabase URL: {{ supabaseUrl }}</p>
        <p>Anon Key: {{ anonKey?.substring(0, 20) }}...</p>
      </CardContent>
    </Card>
  </div>
</template>
