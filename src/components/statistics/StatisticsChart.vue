<script lang="ts">
import { defineComponent } from 'vue';
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
  Filler,
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
  props: ['data', 'loading', 'interval', 'darkMode'],
  data() {
    return {
      chartKey: 0,
    };
  },
  computed: {
    chartData() {
      if (!this.data) return null;
      const rows = this.data.rows || [];
      const labels = rows.map((row: any) => this.formatDateLabel(row.c[0].v));
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
    },

    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' as const },
          tooltip: { mode: 'index' as const, intersect: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: this.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              color: this.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
      };
    },
  },
  watch: {
    data: {
      handler() {
        this.chartKey += 1;
      },
      deep: true,
    },
  },
  methods: {
    formatDateLabel(dateStr: string): string {
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
      if (this.interval === 'daily' && !isMonthly) {
        options.day = 'numeric';
      }

      return new Intl.DateTimeFormat('nl', options).format(date);
    },
  },
});
</script>

<template>
  <div class="statistics-chart" :class="{ loading, 'dark-mode': darkMode }">
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
  background: var(--color-background-shade1);
  color: var(--color-text-gray);

  .dark-mode & {
    background: var(--color-background-shade2);
    color: var(--color-text-gray);
  }
}
</style>