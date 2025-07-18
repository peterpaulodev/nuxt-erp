<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import HeaderSection from './components/header-section.vue'
import { Activity, CreditCard, DollarSign, Users } from 'lucide-vue-next'

const dataCard = ref({
  totalRevenue: 0,
  totalRevenueDesc: 0,
  subscriptions: 0,
  subscriptionsDesc: 0,
  sales: 0,
  salesDesc: 0,
  activeNow: 0,
  activeNowDesc: 0,
})

const dataRecentSales = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: 1999,
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: 39,
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: 299,
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    amount: 99,
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: 39,
  },
]

onMounted(() => {
  dataCard.value = {
    totalRevenue: 45231.89,
    totalRevenueDesc: 20.1 / 100,
    subscriptions: 2350,
    subscriptionsDesc: 180.5 / 100,
    sales: 12234,
    salesDesc: 45 / 100,
    activeNow: 573,
    activeNowDesc: 201,
  }
})
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <HeaderSection title="Dashboard">
      <template #actions>
        <Button>Download</Button>
      </template>
    </HeaderSection>
    <main class="flex flex-1 flex-col gap-4 md:gap-8">
      <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> Total Revenue </CardTitle>
            <DollarSign class="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow
                :value="dataCard.totalRevenue"
                :format="{
                  style: 'currency',
                  currency: 'USD',
                  trailingZeroDisplay: 'stripIfInteger',
                }"
              />
            </div>
            <p class="text-muted-foreground text-xs">
              <NumberFlow
                :value="dataCard.totalRevenueDesc"
                prefix="+"
                :format="{ style: 'percent', minimumFractionDigits: 1 }"
              />
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> Subscriptions </CardTitle>
            <Users class="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="dataCard.subscriptions" prefix="+" />
            </div>
            <p class="text-muted-foreground text-xs">
              <NumberFlow
                :value="dataCard.subscriptionsDesc"
                prefix="+"
                :format="{ style: 'percent', minimumFractionDigits: 1 }"
              />
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> Sales </CardTitle>
            <CreditCard class="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="dataCard.sales" prefix="+" />
            </div>
            <p class="text-muted-foreground text-xs">
              <NumberFlow
                :value="dataCard.salesDesc"
                prefix="+"
                :format="{ style: 'percent', minimumFractionDigits: 1 }"
              />
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> Active Now </CardTitle>
            <Activity class="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow :value="dataCard.activeNow" prefix="+" />
            </div>
            <p class="text-muted-foreground text-xs">
              <NumberFlow :value="dataCard.activeNowDesc" prefix="+" /> since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card class="xl:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent class="pl-2">
            <DashboardOverview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-8">
            <div
              v-for="recentSales in dataRecentSales"
              :key="recentSales.name"
              class="flex items-center gap-4"
            >
              <Avatar class="hidden h-9 w-9 sm:flex">
                <AvatarFallback>{{
                  recentSales.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                }}</AvatarFallback>
              </Avatar>
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">
                  {{ recentSales.name }}
                </p>
                <p class="text-muted-foreground text-sm">
                  {{ recentSales.email }}
                </p>
              </div>
              <div class="ml-auto font-medium">
                <NumberFlow
                  :value="recentSales.amount"
                  :format="{
                    style: 'currency',
                    currency: 'USD',
                    trailingZeroDisplay: 'stripIfInteger',
                  }"
                  prefix="+"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
