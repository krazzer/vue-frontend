<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";

export default defineComponent({
  name: "Uploader",
  emits: ['uploadedNewFiles', 'uploadedFolderFiles', 'progress'],
  props: ['folderId'],
  data() {
    return {
      totalProgress: 0,
      hideProgress: false,
    }
  },
  watch: {
    totalProgress() {
      this.$emit('progress', this.totalProgress, this.hideProgress);
    },
    hideProgress() {
      this.$emit('progress', this.totalProgress, this.hideProgress);
    }
  },
  methods: {

    click() {
      (<any> this).$refs.uploader.click();
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

      formData.append("folder", String(this.folderId));

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
            this.$emit('uploadedFolderFiles', response.data.files);
            this.$emit('uploadedNewFiles', response.data.newFiles);

            setTimeout(() => {
              this.hideProgress = true;
            }, 300);
          }).catch((error: any) => {
        console.error(error);
      });
    },
  }
})
</script>

<template>
  <input ref="uploader" class="d-none" type="file" multiple @change="handleFileChange"/>
</template>