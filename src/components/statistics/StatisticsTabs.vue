<script lang="ts">
import {defineComponent, ref, computed, type PropType} from 'vue';

export default defineComponent({
  name: 'StatisticsTabs',
  props: {
    visitorData: { type: Object as PropType<Record<string, any[]>>, default: () => ({}) },
    overviewData: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const tabs = [
      { key: 'overview', label: 'Overzicht' },
      { key: 'source', label: 'Bron' },
      { key: 'page', label: 'Pagina' },
      { key: 'location', label: 'Locatie' },
      { key: 'browser', label: 'Browser' },
      { key: 'resolution', label: 'Resolutie' },
      { key: 'os', label: 'Besturingssysteem' },
    ];

    const activeTab = ref('overview');

    const firstColumnMap: Record<string, string> = {
      source: 'Bron',
      page: 'Pagina',
      location: 'Locatie',
      browser: 'Browser',
      os: 'Besturingssysteem',
    };

    const fieldMap: Record<string, string> = {
      'Bron': 'value',
      'Pagina': 'value',
      'Locatie': 'value',
      'Browser': 'value',
      'Besturingssysteem': 'value',
      'Device': 'device',
      'Value': 'value'
    };

    const filteredVisitorData = computed(() => {
      if (activeTab.value === 'resolution') {
        const desktop = props.visitorData['resolutionDesktop'] || [];
        const tablet = props.visitorData['resolutionTablet'] || [];
        const mobile = props.visitorData['resolutionMobile'] || [];
        return [
          ...desktop.map(item => ({ ...item, device: 'Desktop' })),
          ...tablet.map(item => ({ ...item, device: 'Tablet' })),
          ...mobile.map(item => ({ ...item, device: 'Mobile' })),
        ];
      }
      return props.visitorData[activeTab.value] || [];
    });

    const tableColumns = (tabKey: string): string[] => {
      if (tabKey === 'resolution') {
        return ['Device', 'Value', 'Hits', 'Percentage'];
      }
      const firstCol = firstColumnMap[tabKey] || 'Value';
      return [firstCol, 'Hits', 'Percentage'];
    };

    const overviewLabels: Record<string, string> = {
      'statistics.overview.totalVisits': 'Aantal bezoeken',
      'statistics.overview.totalUniqueVisits': 'Aantal unieke bezoeken',
      'statistics.overview.dailyAverage': 'Gemiddeld bezoek per dag',
      'statistics.overview.monthlyAverage': 'Gemiddeld bezoek per maand',
    };

    return {
      tabs,
      activeTab,
      filteredVisitorData,
      tableColumns,
      fieldMap,
      overviewLabels,
    };
  },
});
</script>

<template>
  <div class="statistics-tabs">
    <div class="tab-headers">
      <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <table v-if="activeTab === 'overview'" class="table table-striped">
        <tbody>
        <tr v-for="(value, key) in overviewData" :key="key">
          <td>{{ overviewLabels[key] || key }}</td>
          <td>{{ value }}</td>
        </tr>
        </tbody>
      </table>

      <table v-else class="table table-striped">
        <thead>
        <tr>
          <th v-for="col in tableColumns(activeTab)" :key="col">{{ col }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in filteredVisitorData" :key="row.value + (row.device || '')">
          <td v-for="col in tableColumns(activeTab)" :key="col">
            <template v-if="col === 'Percentage'">
              <span class="percentage-bar" :style="{ width: (parseFloat(row.percentage) * 5) + 'px' }"></span>
              {{ row.percentage }}%
            </template>
            <template v-else-if="col === 'Hits'">
              {{ row.visits }}
            </template>
            <template v-else>
              {{ row[fieldMap[col] as string] }}
            </template>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab-headers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-bottom: 2px solid var(--color-line);
  margin-bottom: 1rem;

  .tab-btn {
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      background: var(--color-background-shade2);
    }

    &.active {
      border-bottom-color: var(--main-color);
      color: var(--main-color);
    }
  }
}

.table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid var(--color-line);

    .percentage-bar {
      margin: auto 5px auto 0;
      background-color: var(--main-color);
      display: inline-block;
      height: 11px;
    }
  }

  th {
    font-weight: 600;
    background: var(--color-background-shade2);
  }
}
</style>