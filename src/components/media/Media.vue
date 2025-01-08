<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";
import ToolbarSearch from "@/components/toolbarsearch/ToolbarSearch.vue";
import Toolbar from "@/mixins/Toolbar.vue";

export default defineComponent({
  components: {ToolbarSearch},
  mixins: [Toolbar],
  props: ['settings', 'role'],
  data() {
    return {
      files: <any>[],
      isSelecting: false,
      selectedFiles: <any>[],
      selectedFilesCut: <any>[],
      path: <any>[],
      currentFolderId: <number | null>null,
      totalProgress: 0,
      hideProgress: false,
    };
  },
  mounted() {
    if (this.settings) {
      this.files = this.settings.files;
    } else {
      this.open(null);
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
    deleteFile(event: MouseEvent) {
      event.stopPropagation();
      let doDelete = confirm(this.$translator.tl('media.deleteConfirm'));

      if (!doDelete) {
        return;
      }

      this.$appUtil.doAction('media/delete', {folder: this.currentFolderId, ids: this.selectedFiles}, (response: any) => {
        this.files         = response.data.files;
        this.selectedFiles = [];
      });
    },

    /**
     * Cut selected items
     * @param event
     */
    editKey(event: MouseEvent) {
      event.stopPropagation();

      let name = prompt(this.$translator.tl('media.editKeyPrompt'), '');

      this.$appUtil.doAction('media/key', {name: name, folder: this.currentFolderId, id: this.selectedFiles[0]},
          (response: any) => {
            this.files = response.data.files;

            this.selectedFilesCut = [];
            this.selectedFiles    = [];
          }
      );
    },

    /**
     * Show file upload when clicking button
     */
    openFileUploadModal() {
      let mediaComponent: any = this;
      mediaComponent.$refs.uploader.click();
    },

    /**
     * Paste the selected files to the current folder
     */
    paste() {
      this.$appUtil.doAction('media/paste', {ids: this.selectedFilesCut, folder: this.currentFolderId}, (response: any) => {
        this.files = response.data.files;

        this.selectedFilesCut = [];
        this.selectedFiles    = [];
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
    newFolder() {
      let name = prompt(this.$translator.tl('media.newFolderPrompt'), this.$translator.tl('media.newFolderPlaceholder'));

      this.$appUtil.doAction('media/newfolder', {name: name, folder: this.currentFolderId}, (response: any) => {
        this.files         = response.data.files;
        this.path          = response.data.path;
        this.selectedFiles = [];
      });
    },

    /**
     * @param id
     * @param url
     */
    open(id: number | null, url?: string | null) {
      if (url) {
        window.open(url);
        return;
      }

      this.$appUtil.doAction('media/open', {id: id}, (response: any) => {
        this.files           = response.data.files;
        this.path            = response.data.path;
        this.selectedFiles   = [];
        this.currentFolderId = id;
      });
    },

    /**
     * @param search
     */
    search(search: string) {
      if (!search) {
        this.open(this.currentFolderId);
        return;
      }

      this.$appUtil.doAction('media/search', {search: search}, (response: any) => {
        this.files         = response.data.files;
        this.path          = response.data.path;
        this.selectedFiles = [];
      });
    },

    /**
     * @param event
     */
    handleFileChange(event: any) {
      this.hideProgress  = false;
      this.totalProgress = 0;

      this.uploadFiles(Array.from(event.target.files));
      (this.$refs.uploader as HTMLInputElement).value = '';
    },

    /**
     * @param uploadedFiles
     */
    async uploadFiles(uploadedFiles: any) {
      if (!uploadedFiles.length) {
        return;
      }

      let totalBytes = uploadedFiles.reduce((sum: any, file: any) => sum + file.size, 0);
      let formData   = new FormData();

      formData.append("folder", String(this.currentFolderId));

      let fileUploadLoaded: any = {};

      uploadedFiles.forEach((file: any) => {
        formData.append("file", file);
        fileUploadLoaded[file.name] = 0;
      });

      let uploadProgressEvent = (event: any) => {
        let totalProgress  = Math.round((event.loaded / totalBytes) * 100);
        this.totalProgress = totalProgress > 100 ? 100 : totalProgress;
      };

      let config = {
        onUploadProgress: uploadProgressEvent,
        totalBytes: totalBytes,
      };

      axios
          .post('/api/media/upload', formData, config)
          .then((response: any) => {
            this.files         = response.data.files;
            this.path          = response.data.path;
            this.selectedFiles = [];

            setTimeout(() => {
              this.hideProgress = true;
            }, 300);
          }).catch((error: any) => {
        console.error(error);
      });
    },
  }
});
</script>

<template>
  <div class="media">
    <div class="media__toolbar" ref="toolbarButtons" :class="isWrapped ? 'wrapped' : ''">
      <v-btn @click="openFileUploadModal" prepend-icon="mdi-file-upload-outline">
        {{ $translator.tl('media.upload') }}
      </v-btn>
      <v-btn @click="newFolder" prepend-icon="mdi-folder-plus-outline">
        {{ $translator.tl('media.newFolder') }}
      </v-btn>
      <input ref="uploader" class="d-none" type="file" multiple @change="handleFileChange"/>
      <v-btn v-if="selectedFiles.length" @click="deleteFile" prepend-icon="mdi-delete">
        {{ $translator.tl('media.delete') }}
      </v-btn>
      <v-btn v-if="selectedFiles.length" @click="cut" prepend-icon="mdi-content-cut">
        {{ $translator.tl('media.cut') }}
      </v-btn>
      <v-btn v-if="selectedFilesCut.length" @click="paste" prepend-icon="mdi-content-paste">
        {{ $translator.tl('media.paste') }}<span v-if="selectedFilesCut.length"> ({{ selectedFilesCut.length }})</span>
      </v-btn>
      <v-btn v-if="selectedFiles.length == 1 && $appUtil.roleIsDev(role)" @click="editKey" prepend-icon="mdi-lock">
        {{ $translator.tl('media.editKey') }}
      </v-btn>

      <div class="media__toolbar__right">
        <ToolbarSearch @search="search"/>
      </div>
    </div>
    <div class="media__progress" v-if="totalProgress > 0" :class="{ hidden: hideProgress }">
      <div class="amount" :style="'width:' + totalProgress + '%'"></div>
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
      <div class="media__file" v-for="file in files" @click="selectFile(file.id, $event)"
           @dblclick="open(file.id, file.url)"
           :class="getFileClasses(file.id)">
        <div class="icon">
          <div class="thumb" :class="file.isDir ? 'folder' : ''"
               :style="file.thumb ? 'background-image:url(' + file.thumb + ');' : ''"></div>
          <i v-if="file.key" class="mdi mdi-lock lock-icon"></i>
        </div>
        <div class="name"><span>{{ file.name }}</span></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.media {

  &__progress {
    width: 100%;
    height: 4px;
    position: relative;
    margin-bottom: -4px;
    opacity: 1;
    transition: opacity 0.3s ease;

    &.hidden {
      opacity: 0;
    }

    .amount {
      position: absolute;
      top: 0;
      height: 4px;
      border-radius: 2px;
      background-color: var(--color-action);
      width: 0;
      transition: width 0.3s ease;
    }
  }

  &__toolbar {
    $self: &;
    margin-bottom: 50px;
    display: flex;
    gap: 5px;
    flex-wrap: wrap;

    .upload {
      input {
        display: none;
      }
    }

    &__right {
      margin-left: auto;
    }

    &.wrapped{
      #{$self}__right{
        margin-left: 0;
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
      border-radius: var(--border-radius);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .lock-icon {
        position: absolute;
        bottom: 10px;
        right: 16px;
        font-size: 20px;
      }

      .thumb {
        width: 90px;
        height: 90px;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;

        &.folder {
          background-image: url("@/assets/icons/map.svg");
        }
      }
    }

    .name {
      display: flex;
      margin-left: -5px;
      margin-right: -5px;
      justify-content: center;

      span {
        padding: 0 3px 1px 3px;
        line-height: 20px;
        border-radius: 2px;
        margin-top: 2px;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 130px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
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
    @include noSelect();

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