<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'StatisticsControls',
  props: {
    interval: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    loading: Boolean,
    failed: Boolean,
    requiresUpdate: Boolean,
    darkMode: Boolean,
  },
  emits: ['update:interval', 'update:startDate', 'update:endDate', 'refresh'],
  setup(props) {
    const intervalOptions = [
      { value: 'daily', label: 'Dag' },
      { value: 'monthly', label: 'Maand' },
    ];

    const refreshButtonText = computed(() => {
      if (props.loading) return 'Bezig met laden...';
      if (props.failed) return '❌ Ophalen mislukt';
      if (props.requiresUpdate) return 'Update beschikbaar';
      return 'Ververs';
    });

    return {
      intervalOptions,
      refreshButtonText,
    };
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
          @input="$emit('update:startDate', ($event.target as HTMLInputElement).value)"
          :max="endDate"
      />
      <input
          type="date"
          class="form-control"
          :value="endDate"
          @input="$emit('update:endDate', ($event.target as HTMLInputElement).value)"
          :min="startDate"
      />
    </div>

    <button
        class="btn refresh btn-default"
        @click="$emit('refresh')"
        :disabled="loading"
    >
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
  to { transform: rotate(360deg); }
}
</style>