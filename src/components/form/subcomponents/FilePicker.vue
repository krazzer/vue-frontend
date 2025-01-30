<script lang="ts">
import {defineComponent} from "vue";
import Media from "@/components/media/Media.vue";
import Uploader from "@/components/media/subcomponents/Uploader.vue";

export default defineComponent({
  name: "FilePicker",
  components: {Uploader, Media},
  props: ["label", "hint", "validateOn", "rules", "hideDetails", "modelValue", "helperData", "multiple"],
  data() {
    return {
      dialog: false,
      pickedFile: <null | number>null,
      displayMedia: false,
      thumb: <null | string>null,
      mediaFileSelected: false,
      uploadProgress: 0,
      hideUploadProgress: false,
    }
  },
  mounted() {
    this.pickedFile = this.modelValue;

    if (this.thumb) {
      this.helperData.thumb = this.thumb;
    }
  },
  methods: {
    clickClose() {
      this.dialog = false;
    },

    openDialog() {
      this.dialog = true;
    },

    pickFile(file: number, thumb: string) {
      this.helperData.thumb = thumb;
      this.pickedFile       = file;

      this.$emit('update:modelValue', this.pickedFile);
      this.clickClose();
    },
    mediaPickFile() {
      (<typeof Media>this.$refs.media).pickFile();
    },
    updateFileSelected(selected: boolean) {
      this.mediaFileSelected = selected;
    },
    updateUploadProgress(progress: number, hide: boolean) {
      this.uploadProgress     = progress;
      this.hideUploadProgress = hide;
    },
    uploadFiles(files: any) {
      this.helperData.thumb      = files[0].thumb;
      this.helperData.pickedFile = files[0].id;
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        // hide form when dialog animation has finished
        setTimeout(() => this.displayMedia = false, 300);
      } else {
        this.displayMedia = true;
      }
    },
  }
});
</script>

<template>
  <v-row align="center" dense>
    <v-col cols="auto" style="align-items: flex-start; justify-content: flex-start; display: flex;">
      <v-btn variant="tonal" class="me-2" :class="{ 'pick-button': helperData.thumb && pickedFile }"
             @click="openDialog">
        <template v-if="pickedFile">
          <template v-if="helperData.thumb">
            <img class="thumb" :src="helperData.thumb" alt=""/>
          </template>
          <template v-else>
            Pick file (Current: {{ pickedFile }})
          </template>
        </template>
        <template v-else>
          Pick file
        </template>
      </v-btn>
      <v-btn variant="tonal" @click="(<any> $refs).uploader.click();">
        Upload
        <div class="upload-progress" v-if="uploadProgress > 0" :class="{ 'd-none': hideUploadProgress }" :style="'width:' + uploadProgress + '%'"></div>
      </v-btn>
      <Uploader @uploadedNewFiles="uploadFiles" @progress="updateUploadProgress" ref="uploader"/>
    </v-col>
  </v-row>

  <v-dialog class="dt-dialog" v-model="dialog" :eager="true" max-width="1200">
    <v-card height="100vh">
      <v-card-title>
        <span class="text-h5">{{ $translator.tl('media.pickFile') }}</span>
        <span class="close">
            <i class="mdi mdi-close" @click="clickClose"></i>
          </span>
      </v-card-title>
      <v-card-text>
        <Media v-if="displayMedia" @pick="pickFile" @fileSelection="updateFileSelected" ref="media" pick="true"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="tonal" @click="clickClose" prepend-icon="mdi-close">
          {{ $translator.tl('general.close') }}
        </v-btn>
        <v-btn variant="tonal" @click="mediaPickFile()" :disabled="!mediaFileSelected"
               prepend-icon="mdi-cursor-pointer">
          {{ $translator.tl('media.pickFile') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
@use '@/assets/css/dialog';

.upload-progress{
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  border-radius: var(--border-radius);
  background-color: var(--color-action);
  width: 0;
  transition: width 0.3s ease;
}

.v-btn.v-btn--density-default.pick-button {
  padding: 5px;
  height: auto;
}

.thumb {
  max-width: 160px;
  max-height: 80px;
}
</style>