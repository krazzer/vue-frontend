<script lang="ts">
import { defineComponent } from 'vue';
import StatisticsControls from './StatisticsControls.vue';
import StatisticsChart from './StatisticsChart.vue';
import StatisticsTabs from './StatisticsTabs.vue';

export default defineComponent({
  name: 'Statistics',
  components: {StatisticsControls, StatisticsChart, StatisticsTabs},
  props: ['settings', 'csrfToken', 'darkMode'],
  data() {
    return {
      interval: 'monthly',
      startDate: '',
      endDate: '',
      loading: false,
      requiresUpdate: false,
      failed: false,
      chartData: {} as Record<string, any[]>,
      visitorData: {} as Record<string, any[]>,
      overviewData: {} as Record<string, any>,
    };
  },
  created() {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    this.startDate = this.formatDate(start);
    this.endDate = this.formatDate(end);
  },
  computed: {
    watchSource() {
      return {
        interval: this.interval,
        startDate: this.startDate,
        endDate: this.endDate,
      };
    },
  },
  watch: {
    watchSource: {
      handler() {
        this.fetchData();
      }
    },
  },
  methods: {
    formatDate(date: Date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    },

    fetchData() {
      this.loading = true;
      this.failed = false;
      this.$appUtil?.doAction('statistics/visitors', {interval: this.interval, start: this.startDate, end: this.endDate},
        (response: any) => {
          const data = response.data;
          this.chartData = data.visitorsData;
          this.visitorData = data.visitorData;
          this.requiresUpdate = data.requiresUpdate;
          this.overviewData = data.overviewData;
          this.loading = false;
        },
        {
          onError: (error: any) => {
            console.error('Failed to fetch statistics', error);
            this.failed = true;
            this.loading = false;
          },
        }
      );
    },

    handleRefresh() {
      if (this.loading) return;

      if (this.requiresUpdate) {
        this.loading = true;
        this.$appUtil?.doAction('statistics/update', {token: this.csrfToken},
          () => {
            this.fetchData();
          },
          {
            onError: (error: any) => {
              console.error('Update failed', error);
              this.failed = true;
              this.loading = false;
            },
          }
        );
      } else {
        this.fetchData();
      }
    },
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