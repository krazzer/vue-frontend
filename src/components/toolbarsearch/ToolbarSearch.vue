<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "ToolbarSearch",
  emits: ['search'],
  data() {
    return {
      search: '',
      lastEmittedSearch: <string | null>null,
    }
  },
  methods: {
    clearSearch() {
      this.search = ''; // Clear the search field
    },

    searchKeyDown(event: KeyboardEvent) {
      if (event.key == "Escape") {
        if (this.search !== '') {
          event.stopPropagation();
        }

        this.search = '';
      }
    },

    searchKeyUp(event: KeyboardEvent) {
      let searchOnKeyUp = <string | null>this.search;

      if (event.key == "Enter") {
        this.$emit('search', this.search);
        this.lastEmittedSearch = this.search;
        return;
      }

      setTimeout(async () => {
        if (this.search == searchOnKeyUp && this.search != this.lastEmittedSearch) {
          this.$emit('search', this.search);
          this.lastEmittedSearch = this.search;
        }
      }, 500);
    },
  }
})
</script>

<template>
  <v-text-field prepend-inner-icon="mdi-magnify" v-model="search" class="search" density="compact"
                :placeholder="$translator.tl('general.search')" @keydown="searchKeyDown" @keyup="searchKeyUp">
    <template v-slot:append-inner>
      <v-icon v-if="search" @click="clearSearch">mdi-close</v-icon>
    </template>
  </v-text-field>
</template>

<style scoped lang="scss">
.search {
  max-height: 36px;
  width: 250px;
  max-width: 250px;

  :deep(input), :deep(.v-field__input) {
    min-height: auto;
    padding: 6px 10px;
  }
}
</style>