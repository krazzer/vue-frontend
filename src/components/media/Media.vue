<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  props: ['settings'],
  data() {
    return {
      files: <any>[],
      isSelecting: false,
      selectedFiles: <any>[]
    };
  },
  mounted() {
    if (this.settings) {
      this.files = this.settings.files;
    }
  },
  methods: {
    handleFileImport() {
      let mediaComponent: any = this;
      mediaComponent.$refs.uploader.click();
    },
    onFileChanged(e: any) {
      console.log(e.target.files);
    },
    selectFile(id: number) {
      this.selectedFiles = [id];
    },
    getFileClasses(id: number){
      if(this.selectedFiles.includes(id)){
        return ['selected'];
      }

      return [];
    }
  }
});
</script>

<template>
  <div class="media">
    <div class="media__toolbar">
      <v-btn @click="handleFileImport">Uploaden</v-btn>
      <input ref="uploader" class="d-none" type="file" multiple @change="onFileChanged"/>
    </div>
    <div class="media__files">
      <div class="media__file" v-for="file in files" @click="selectFile(file.id)" :class="getFileClasses(file.id)">
        <div class="icon"></div>
        <div class="name"><span>{{ file.name }}</span></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.media {

  &__toolbar {
    margin-bottom: 50px;

    .upload {
      input {
        display: none;
      }
    }
  }

  &__file {
    float: left;
    padding: 10px;
    height: 160px;

    .icon {
      width: 120px;
      height: 120px;
      background: url("@/assets/icons/map.svg") no-repeat center;
      background-size: 90px 90px;
      border-radius: var(--border-radius);
    }

    .name {
      text-align: center;
    }

    &.selected{
      .icon{
        background-color: var(--color-background-shade3);
      }

      .name span {
        background-color: var(--color-action);
        color: var(--color-white);
      }
    }
  }

  &__files {
    width: 100%;
    min-height: 480px;
    background-color: var(--color-background-shade1);
    transition: background-color var(--color-scheme-transition-speed);

    &:after {
      clear: both;
      content: "";
      display: table;
    }
  }
}
</style>