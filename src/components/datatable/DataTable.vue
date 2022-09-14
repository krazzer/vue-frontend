<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "DataTable",
  props: ['settings'],
  mounted(){
  }
});

</script>

<template>
  <div class="datatable" v-if="settings">
    <div class="datatable__toolbar">
      <a class="btn">{{ settings.addButtonLabel }}</a>
    </div>
    <div class="datatable__table">
      <table>
        <thead>
          <tr>
            <th v-for="header in settings.headers">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="row in settings.data">
          <td v-for="cell in row">{{ cell }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .datatable{

    &__toolbar{
      margin-bottom: 36px;
    }

    &__table{
      table{
        border-spacing: 0;
        border-collapse: separate;
        width: 100%;

        td, th{
          padding: 8px 15px;
        }

        thead th{
          text-align: left;
          font-weight: bold;
        }

        tbody{
          tr:nth-child(odd){
            transition: background-color var(--color-scheme-transition-speed);
            background-color: var(--color-background-shade1);
          }
        }
      }
    }
  }
</style>