<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
} from 'chart.js';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
);

export default defineComponent({
  name: 'StatisticsChart',
  components: { Line },
  props: {
    data: { type: Object, default: null },
    loading: Boolean,
    interval: { type: String, default: 'daily' },
  },
  setup(props) {
    const chartKey = ref(0);
    watch(() => props.data, () => {
      chartKey.value += 1;
    });

    const formatDateLabel = (dateStr: string): string => {
      const isMonthly = dateStr.length === 7;
      let date: Date;
      if (isMonthly) {
        date = new Date(dateStr + '-01T00:00:00');
      } else {
        date = new Date(dateStr + 'T00:00:00');
      }

      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        year: 'numeric',
      };
      if (props.interval === 'daily' && !isMonthly) {
        options.day = 'numeric';
      }

      return new Intl.DateTimeFormat('nl', options).format(date);
    };

    const chartData = computed(() => {
      if (!props.data) return null;
      const rows = props.data.rows || [];
      const labels = rows.map((row: any) => formatDateLabel(row.c[0].v));
      const visits = rows.map((row: any) => row.c[1].v);
      const uniqueVisits = rows.map((row: any) => row.c[2].v);

      return {
        labels,
        datasets: [
          {
            label: 'Bzoekers',
            data: visits,
            borderColor: '#3669c9',
            backgroundColor: 'rgba(54, 105, 201, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Unieke bezoekers',
            data: uniqueVisits,
            borderColor: '#df137a',
            backgroundColor: 'rgba(223, 19, 122, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      };
    });

    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' as const },
        tooltip: { mode: 'index' as const, intersect: false },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }));

    return { chartKey, chartData, chartOptions };
  },
});
</script>

<template>
  <div class="statistics-chart" :class="{ loading }">
    <Line
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
        :key="chartKey"
    />
    <div v-else class="no-data">Geen gegevens beschikbaar</div>
  </div>
</template>

<style scoped>
.statistics-chart {
  height: 400px;
  margin-bottom: 2rem;
  position: relative;
}
.no-data {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  /**
   * Todo: Gebruik geen losse kleuren maar de variabelen, ook voor darkmode
   */
  background: #f5f5f5;
  color: #999;
}
</style>