<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";

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

    window.addEventListener('click', (event) => {
      if (!event.shiftKey) {
        this.selectedFiles = [];
      }
    });
  },
  methods: {
    handleFileImport() {
      let mediaComponent: any = this;
      mediaComponent.$refs.uploader.click();
    },
    onFileChanged(e: any) {
      console.log(e.target.files);
    },
    selectFile(id: number, event: MouseEvent) {
      if (event.shiftKey) {
        if (!this.selectedFiles.includes(id)) {
          this.selectedFiles.push(id);
        }
      } else {
        this.selectedFiles = [id];
      }
      event.stopPropagation();
    },
    getFileClasses(id: number) {
      if (this.selectedFiles.includes(id)) {
        return ['selected'];
      }

      return [];
    },
    async newFolder() {
      let name = prompt('Geef een naam op voor de nieuwe map', 'Nieuwe map');

      await axios
          .get('/api/media/newfolder', {params: {name: name}})
          .then((response: any) => {
            console.log(response);
          }).catch((error: any) => {
            console.error(error);
          });
    },
  }
});
</script>

<template>
  <div class="media">
    <div class="media__toolbar">
      <v-btn @click="handleFileImport" prepend-icon="mdi-file-upload-outline">Uploaden</v-btn>
      <v-btn @click="newFolder" prepend-icon="mdi-folder-plus-outline">Nieuwe map</v-btn>
      <input ref="uploader" class="d-none" type="file" multiple @change="onFileChanged"/>
    </div>
    <div class="media__files">
      <div class="media__file" v-for="file in files" @click="selectFile(file.id, $event)"
           :class="getFileClasses(file.id)">
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
    display: flex;
    gap: 5px;

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

    &.selected {
      .icon {
        background-color: var(--color-background-shade3);
      }

      .name span {
        background-color: var(--color-action);
        color: var(--color-white);
        display: inline-block;
        padding: 2px 3px 3px;
        line-height: 14px;
        border-radius: 2px;
      }
    }
  }

  &__files {
    width: 100%;
    min-height: 480px;
    background-color: var(--color-background-shade1);
    transition: background-color var(--color-scheme-transition-speed);
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:after {
      clear: both;
      content: "";
      display: table;
    }
  }
}
</style>