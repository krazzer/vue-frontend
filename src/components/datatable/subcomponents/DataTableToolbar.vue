<script lang="ts">
import {defineComponent} from "vue";
import ToolbarSearch from "@/components/toolbarsearch/ToolbarSearch.vue";
import Toolbar from "@/mixins/Toolbar.vue";

export default defineComponent({
  name: "DataTableToolbar",
  components: {ToolbarSearch},
  mixins: [Toolbar],
  props: ['buttons', 'filters', 'pages', 'languages', 'language', 'search', 'selected', 'filterValues', 'page', 'showSearch'],
  emits: ["buttonClick", "changeLanguage", "searchAction", "setPage"],
  methods: {
    buttonClick(button: any) {
      this.$emit("buttonClick", button);
    },
    changeLanguage(val: string) {
      this.$emit("changeLanguage", val);
    },
    searchAction(search: string) {
      this.$emit("searchAction", search);
    },
    setPage(page: number) {
      this.$emit("setPage", page);
    },
    isDisabled(button: any) {
      if (button.action == 'delete') {
        return this.selected.length < 1;
      }
    },
  },
});
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__buttons" ref="toolbarButtons" :class="isWrapped ? 'wrapped' : ''">
      <template v-for="button in buttons">
        <v-menu v-if="button.type == 'menu'">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :prepend-icon="'mdi-menu'">{{ button.label }}</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in button.items" :key="index" :value="index" @click="buttonClick(item)">
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-chip v-else-if="button.type == 'label'" :prepend-icon="button.icon">{{ button.label }}</v-chip>
        <v-btn v-else @click="buttonClick(button)" :disabled="isDisabled(button)" :prepend-icon="button.icon">
          {{ button.label }}
        </v-btn>
      </template>

      <template v-for="filter in filters">
        <v-select :multiple="filter.multiple" :items="filter.items" v-model="filterValues[filter.key]"
                  :label="filter.label" density="compact" :max-width="filter.width ? filter.width : 200"
                  return-object :clearable="!filter.multiple" min-width="135"></v-select>
      </template>
      <div class="toolbar__buttons__right">
        <div v-if="pages" class="pagination">
          <span class="page" :class="pageNr ? (pageNr == page ? 'selected' : '') : 'disabled'" v-for="pageNr in pages"
                @click="setPage(pageNr)">
            {{ pageNr ? pageNr : '...' }}
          </span>
        </div>
        <v-select v-if="languages" :items="languages" item-title="label" @update:modelValue="changeLanguage"
                  item-value="key" density="compact" class="language" v-model="language"/>
        <ToolbarSearch v-if="showSearch" @search="searchAction"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/css/pagination';

.toolbar {
  margin-bottom: $spaceLogoMenu;

  &__buttons {
    $self: &;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;

    :deep(.icon--add) {
      top: 1px;
    }

    :deep(.icon--delete) {
      top: 1px;
    }

    :deep(svg) {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      fill: var(--color-text);

      line {
        stroke: var(--color-text);
      }
    }

    &__right {
      margin-left: auto;
      display: flex;
      gap: 5px;
      white-space: nowrap;
      flex-wrap: wrap;
    }

    .v-btn--disabled {
      :deep(svg) {
        opacity: .3;
      }
    }

    &.wrapped {
      #{$self}__right {
        margin-left: 0;
      }
    }

    .v-chip {
      height: 36px;
      padding: 0 16px;
    }
  }

  .v-select {
    height: 36px;

    :deep(.v-input__details) {
      position: absolute;
    }

    :deep(.v-input__control) {
      height: 36px;
    }

    :deep(.v-field-label) {
      margin-top: -1px;
    }

    :deep(.v-field--focused .v-field-label), &--selected :deep(.v-field-label) {
      margin-top: -9px;
      margin-left: 10px;
      font-size: 10px;
    }

    :deep(input), :deep(.v-field__input) {
      padding: 6px 10px;
      margin-top: -2px;
    }

    :deep(.v-field__input) {
      flex-flow: nowrap;
      overflow: hidden;
    }
  }

  .language {
    max-width: 200px;
  }
}
</style>