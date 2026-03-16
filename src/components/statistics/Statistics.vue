<script lang="ts">
import { defineComponent, ref, watch, getCurrentInstance } from 'vue';
import StatisticsControls from './StatisticsControls.vue';
import StatisticsChart from './StatisticsChart.vue';
import StatisticsTabs from './StatisticsTabs.vue';

export default defineComponent({
  name: 'Statistics',
  components: {StatisticsControls, StatisticsChart, StatisticsTabs},
  props: ['settings', 'csrfToken', 'darkMode'],
  setup(props) {
    const appUtil = (getCurrentInstance() as any)?.proxy?.$appUtil;
    const interval = ref('monthly');

    const formatDate = (date: Date): string => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const end   = new Date();
    const start = new Date();

    start.setDate(start.getDate() - 30);

    const startDate = ref(formatDate(start));
    const endDate   = ref(formatDate(end));

    const loading        = ref(false);
    const requiresUpdate = ref(false);
    const failed         = ref(false);
    const chartData      = ref<Record<string, any[]>>({});
    const visitorData    = ref<Record<string, any[]>>({});
    const overviewData   = ref({});

    const fetchData = () => {
      loading.value = true;
      failed.value = false;

      appUtil?.doAction('statistics/visitors', {
        interval: interval.value,
        start: startDate.value,
        end: endDate.value,
      }, (response: any) => {
        const data = response.data;
        chartData.value = data.visitorsData;
        visitorData.value = data.visitorData;
        requiresUpdate.value = data.requiresUpdate;
        overviewData.value = data.overviewData;
        loading.value = false;
      }, {
        onError: (error: any) => {
          console.error('Failed to fetch statistics', error);
          failed.value = true;
          loading.value = false;
        }
      });
    };

    watch([interval, startDate, endDate], fetchData, {immediate: true});

    const handleRefresh = () => {
      if (loading.value) return;

      if (requiresUpdate.value) {
        loading.value = true;
        appUtil?.doAction('statistics/update', {
          token: props.csrfToken
        }, () => {
          fetchData();
        }, {
          onError: (error: any) => {
            console.error('Update failed', error);
            failed.value = true;
            loading.value = false;
          },
        });
      } else {
        fetchData();
      }
    };

    return {
      interval,
      startDate,
      endDate,
      loading,
      failed,
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
        :failed="failed"
        :requiresUpdate="requiresUpdate"
        :darkMode="darkMode"
        @refresh="handleRefresh"
    />
    <StatisticsChart :data="chartData" :loading="loading" :interval="interval" :darkMode="darkMode"/>
    <StatisticsTabs :visitorData="visitorData" :overviewData="overviewData"/>
  </div>
</template>