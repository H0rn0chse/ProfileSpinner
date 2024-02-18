<script setup>
import { ref, reactive } from "vue" ;
import { useAppStore } from "@/store/app";
import { downloadBlob, compressAsZip, downloadTypes } from "@/js/download";
import { composeImage } from "@/js/image";
const appStore = useAppStore();

const image = ref(null);

const imgSize = reactive({
  width: "500px",
  aspectRatio: 1
});

function updateRatio () {
  const ratio = image.value.naturalWidth / image.value.naturalHeight;
  imgSize.aspectRatio = ratio;
}

async function downloadCurrentImage () {
  const blob = composeImage(appStore.currentImage, image.value.naturalWidth, image.value.naturalHeight, 25);
  await downloadBlob(blob, "image.png", downloadTypes.image);
}

async function downloadSeries () {
  const imageBlob = composeImage(appStore.currentImage, image.value.naturalWidth, image.value.naturalHeight, 25);
  const files = [{
    filename: "image1.png",
    data: imageBlob
  }];
  const blob = await compressAsZip(files);
  await downloadBlob(blob, "images.zip", downloadTypes.zip);
}

</script>

<template>
  <div id="container">
    <div
      id="imgContainer"
      class="glow"
      :style="imgSize"
    >
      <img
        ref="image"
        :src="appStore.currentImage"
        :style="{ transform: 'rotate(25deg)'}"
        @load="updateRatio"
      >
    </div>
    <div id="btnContainer">
      <v-btn
        color="primary"
        @click="downloadCurrentImage"
      >
        Download
      </v-btn>
      <v-btn @click="downloadSeries">
        Download Series
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
#container {
  position: relative;
  display: flex;
  flex-direction: column;

  padding: 1rem;
  padding-top: 4rem;
}

.glow {
  border: solid #48abe0 0px;
  /* border-radius: 20px; */
  box-shadow: 0 0 800px 50px #48abe0;
}

#imgContainer {
  margin: 2rem;
  align-self: center;
}

img {
  min-width: 500px;
  max-width: 500px;
}

#btnContainer {
  position: absolute;
  bottom: 0;
  left: 0;

  margin: 1rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
}
</style>
