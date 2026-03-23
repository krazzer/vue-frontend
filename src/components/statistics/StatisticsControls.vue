<script lang="ts">
import { defineComponent } from 'vue';

const intervalOptions = [
  { value: 'daily', label: 'Dag' },
  { value: 'monthly', label: 'Maand' },
];

export default defineComponent({
  name: 'StatisticsControls',
  props: ['interval', 'startDate', 'endDate', 'loading', 'failed', 'requiresUpdate', 'darkMode'],
  data() {
    return {
      intervalOptions,
    };
  },
  emits: ['update:interval', 'update:startDate', 'update:endDate', 'refresh'],
  computed: {
    refreshButtonText(): string {
      if (this.loading) return 'Bezig met laden...';
      if (this.failed) return '❌ Ophalen mislukt';
      if (this.requiresUpdate) return 'Update beschikbaar';
      return 'Ververs';
    },

    today(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  },
});
</script>

<template>
  <div class="statistics-controls" :class="{ 'dark-mode': darkMode }">
    <div class="btn-group interval">
      <button
          v-for="opt in intervalOptions"
          :key="opt.value"
          :class="['btn', interval === opt.value ? 'btn-primary' : 'btn-default']"
          @click="$emit('update:interval', opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>

    <div class="date-range">
      <input
          type="date"
          class="form-control"
          :value="startDate"
          @change="$emit('update:startDate', ($event.target as HTMLInputElement).value)"
          :max="endDate"
      />
      <input
          type="date"
          class="form-control"
          :value="endDate"
          @change="$emit('update:endDate', ($event.target as HTMLInputElement).value)"
          :min="startDate"
          :max="today"
      />
    </div>

    <button class="btn refresh btn-default" @click="$emit('refresh')" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      <span class="lbl">{{ refreshButtonText }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.statistics-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .btn-group {
    display: flex;
    gap: 0.25rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
    border: 1px solid transparent;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;

    &.btn-primary {
      background-color: var(--main-color);
      color: var(--color-white);
      &:hover {
        background-color: var(--main-color-darker);
      }
    }

    &.btn-default {
      background-color: var(--color-background-shade1);
      color: var(--color-text);
      border-color: var(--color-line);
      &:hover {
        background-color: var(--color-background-shade2);
      }
    }
  }

  .date-range {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;

    input {
      width: 200px;
      border: 1px solid var(--color-line);
      border-radius: 3px;
      padding: 7px 12px;
      background-color: var(--color-background);
      color: var(--color-text);
      transition: border-color 0.2s, background-color 0.2s, color 0.2s;
    }
  }

  .refresh {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    float: right;
    position: relative;

    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  }

  &.dark-mode {
    .btn-default {
      background-color: var(--color-background-shade1);
      border-color: var(--color-line);
      &:hover {
        background-color: var(--color-background-shade2);
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>