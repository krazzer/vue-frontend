<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";

export default defineComponent({
  props: ['settings'],
  data() {
    return {
      files: <any>[],
      isSelecting: false,
      selectedFiles: <any>[],
      selectedFilesCut: <any>[],
      path: <any>[],
      currentFolderId: <number | null>null,
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
    /**
     * @param index
     */
    canClickPath(index: number) {
      return index != Object.keys(this.path).length - 1;
    },

    /**
     * Cut selected items
     * @param event
     */
    cut(event: MouseEvent) {
      event.stopPropagation();
      this.selectedFilesCut = [...this.selectedFiles];
    },

    /**
     * @param event
     */
    async deleteFile(event: MouseEvent) {
      event.stopPropagation();
      let doDelete = confirm(this.$translator.tl('media.deleteConfirm'));

      if( ! doDelete){
        return;
      }

      await axios
          .get('/api/media/delete', {params: {folder: this.currentFolderId, ids: this.selectedFiles}})
          .then((response: any) => {
            this.files         = response.data.files;
            this.selectedFiles = [];
          }).catch((error: any) => {
            console.error(error);
          });
    },

    /**
     * Cut selected items
     * @param event
     */
    async editKey(event: MouseEvent) {
      event.stopPropagation();

      let name = prompt(this.$translator.tl('media.editKeyPrompt'), '');

      await axios
          .get('/api/media/key', {params: {name: name, folder: this.currentFolderId, id: this.selectedFiles[0]}})
          .then((response: any) => {
            this.files = response.data.files;

            this.selectedFilesCut = [];
            this.selectedFiles    = [];
          }).catch((error: any) => {
            console.error(error);
          });
    },

    /**
     * Show file upload when clicking button
     */
    handleFileImport() {
      let mediaComponent: any = this;
      mediaComponent.$refs.uploader.click();
    },

    /**
     * Action when file has been selected for upload
     * @param e
     */
    onFileChanged(e: any) {
      console.log(e.target.files);
    },

    /**
     * Paste the selected files to the current folder
     */
    async paste() {
      await axios
          .get('/api/media/paste', {params: {ids: this.selectedFilesCut, folder: this.currentFolderId}})
          .then((response: any) => {
            this.files = response.data.files;

            this.selectedFilesCut = [];
            this.selectedFiles    = [];
          }).catch((error: any) => {
            console.error(error);
          });
    },

    /**
     * @param id
     * @param event
     */
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

    /**
     * @param id
     */
    getFileClasses(id: number) {
      let classes = [];

      if (this.selectedFiles.includes(id)) {
        classes.push('selected');
      }

      if (this.selectedFilesCut.includes(id)) {
        classes.push('cut');
      }

      return classes;
    },

    /**
     * Action when clicking the 'new folder' button
     */
    async newFolder() {
      let name = prompt(this.$translator.tl('media.newFolderPrompt'), this.$translator.tl('media.newFolderPlaceholder'));

      await axios
          .get('/api/media/newfolder', {params: {name: name}})
          .then((response: any) => {
            console.log(response);
          }).catch((error: any) => {
            console.error(error);
          });
    },

    /**
     * @param id
     */
    async open(id: number | null) {
      await axios
          .get('/api/media/open', {params: {id: id}})
          .then((response: any) => {
            this.files           = response.data.files;
            this.path            = response.data.path;
            this.selectedFiles   = [];
            this.currentFolderId = id;
          }).catch((error: any) => {
            console.error(error);
          });
    }
  }
});
</script>

<template>
  <div class="media">
    <div class="media__toolbar">
      <v-btn @click="handleFileImport" prepend-icon="mdi-file-upload-outline">
        {{ $translator.tl('media.upload') }}
      </v-btn>
      <v-btn @click="newFolder" prepend-icon="mdi-folder-plus-outline">
        {{ $translator.tl('media.newFolder') }}
      </v-btn>
      <input ref="uploader" class="d-none" type="file" multiple @change="onFileChanged"/>
      <v-btn v-if="selectedFiles.length" @click="deleteFile" prepend-icon="mdi-delete">
        {{ $translator.tl('media.delete') }}
      </v-btn>
      <v-btn v-if="selectedFiles.length" @click="cut" prepend-icon="mdi-content-cut">
        {{ $translator.tl('media.cut') }}
      </v-btn>
      <v-btn v-if="selectedFilesCut.length" @click="paste" prepend-icon="mdi-content-paste">
        Plak<span v-if="selectedFilesCut.length"> ({{ selectedFilesCut.length }})</span>
      </v-btn>
      <v-btn v-if="selectedFiles.length == 1" @click="editKey" prepend-icon="mdi-lock">
        {{ $translator.tl('media.editKey') }}
      </v-btn>
    </div>
    <ul class="media__path" v-if="Object.keys(path).length">
      <li><span class="clickable" @click="open(null)">🏠</span></li>
      <li v-for="(name, id, i) in path">
        <span :class="canClickPath(i) ? 'clickable' : ''" @click="canClickPath(i) ? open(id) : null">
          {{ name }}
        </span>
      </li>
    </ul>
    <div class="media__files">
      <div class="media__file" v-for="file in files" @click="selectFile(file.id, $event)" @dblclick="open(file.id)"
           :class="getFileClasses(file.id)">
        <div class="icon">
          <i v-if="file.key" class="mdi mdi-lock lock-icon"></i>
        </div>
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
    height: 180px;

    .icon {
      width: 120px;
      height: 120px;
      background: url("@/assets/icons/map.svg") no-repeat center;
      background-size: 90px 90px;
      border-radius: var(--border-radius);
      position: relative;

      .lock-icon {
        position: absolute;
        bottom: 10px;
        right: 16px;
        font-size: 20px;
      }
    }

    .name {
      display: flex;
      margin-left: -5px;
      margin-right: -5px;
      justify-content: center;

      span {
        padding: 2px 5px 3px;
        line-height: 20px;
        border-radius: 2px;
        margin-top: 2px;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 130px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        width: fit-content;
        text-align: center;
      }
    }

    &.selected {
      .icon {
        background-color: var(--color-background-shade3);
      }

      .name span {
        background-color: var(--color-action);
        color: var(--color-white);

      }
    }

    &.cut {
      opacity: .3;
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

  &__path {
    background-color: var(--color-background-shade2);
    padding: 10px 20px;
    list-style: none;
    margin: 0;

    li {
      display: inline-block;

      span {
        &.clickable {
          cursor: pointer;
          color: var(--main-color)
        }
      }

      &:before {
        content: '/';
        margin: 0 15px;
      }

      &:first-child {
        &:before {
          display: none;
        }
      }
    }
  }
}
</style>