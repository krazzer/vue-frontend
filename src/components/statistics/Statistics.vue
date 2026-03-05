<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from 'vue';
import StatisticsControls from './StatisticsControls.vue';
import StatisticsChart from './StatisticsChart.vue';
import StatisticsTabs from './StatisticsTabs.vue';
import axios from 'axios';

export default defineComponent({
  name: 'Statistics',
  components: { StatisticsControls, StatisticsChart, StatisticsTabs },
  props: ['settings', 'csrfToken', 'darkMode'],
  setup(props) {
    const interval = ref('monthly');

    const formatDate = (date: Date): string => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    const startDate = ref(formatDate(start));
    const endDate = ref(formatDate(end));

    const loading = ref(false);
    const requiresUpdate = ref(false);
    const failed = ref(false);
    const chartData = ref(null);
    const visitorData = ref<Record<string, any[]>>({});
    const overviewData = ref({});

    const fetchData = async () => {
      loading.value = true;
      failed.value = false;
      try {
        const response = await axios.post('/api/statistics/visitors', {
          interval: interval.value,
          start: startDate.value,
          end: endDate.value,
        });
        const data = response.data;
        chartData.value = data.visitorsData;
        visitorData.value = data.visitorData;
        overviewData.value = data.overviewData;
        requiresUpdate.value = data.requiresUpdate;
      } catch (error) {
        console.error('Failed to fetch statistics', error);
        failed.value = true;
      } finally {
        loading.value = false;
      }
    };

    watch([interval, startDate, endDate], fetchData, { immediate: true });

    const handleRefresh = async () => {
      if (loading.value) return;

      if (requiresUpdate.value) {
        loading.value = true;
        try {
          await axios.post('/api/statistics/update', { token: props.csrfToken });
          await fetchData();
          requiresUpdate.value = false;
        } catch (error) {
          failed.value = true;
        } finally {
          loading.value = false;
        }
      } else {
        await fetchData();
      }
    };

    return {
      interval,
      startDate,
      endDate,
      loading,
      requiresUpdate,
      chartData,
      visitorData,
      overviewData,
      handleRefresh,
    };
  },
});
</script>

<template>
  <div class="statistics" :class="{ 'dark-mode': darkMode }">
    <StatisticsControls
        v-model:interval="interval"
        v-model:startDate="startDate"
        v-model:endDate="endDate"
        :loading="loading"
        :requiresUpdate="requiresUpdate"
        :darkMode="darkMode"
        @refresh="handleRefresh"
    />
    <StatisticsChart :data="chartData" :loading="loading" :interval="interval" />
    <StatisticsTabs :visitorData="visitorData" :overviewData="overviewData" />
  </div>
</template>

<style scoped lang="scss">
.statistics {
  padding: 1rem;
  min-height: 100vh;
  background-color: var(--bg-color, #fff);
  color: var(--text-color, #333);

  &.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #f0f0f0;
  }
}
</style>