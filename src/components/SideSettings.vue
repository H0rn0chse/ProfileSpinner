<script setup>
import { useAppStore } from "@/store/app";
import { ref, computed } from "vue";
const appStore = useAppStore();

const steps = computed({
  get () {
    return appStore.metadata.steps;
  },
  set (newSteps) {
    appStore.setSteps(newSteps);
  }
});

const daysPerStep = computed({
  get () {
    return appStore.metadata.daysPerStep;
  },
  set (newDaysPerStep) {
    appStore.setDaysPerStep(newDaysPerStep);
  }
});

const startingDay = computed({
  get () {
    return appStore.metadata.startingDay;
  },
  set (newDay) {
    appStore.setStartingDay(newDay);
  }
});

const image = ref([]);

function updateImage ([firstFile]) {
  if (!firstFile) {
    return;
  }
  const supportedFileEndings = [
    ".png",
    ".jpeg",
    ".jpg"
  ];
  const fileSupported = supportedFileEndings.some((ending) => firstFile.name.toLowerCase().endsWith(ending));
  if (!fileSupported) {
    alert("wrong filetype");
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    if (event.target.result) {
      appStore.setImage(event.target.result);
    } else {
      appStore.removeImage();
    }
    image.value = [];
  };
  reader.readAsDataURL(firstFile);
}

function reset () {
  appStore.reset();
}
</script>

<template>
  <div id="container">
    <v-form>
      <v-text-field
        v-model="steps"
        label="Steps"
        type="number"
      />
      <v-text-field
        v-model="daysPerStep"
        label="Days Per Step"
        type="number"
      />
      <v-text-field
        v-model="startingDay"
        label="Starting Day"
        type="date"
      />
      <v-file-input
        v-model="image"
        label="Image"
        accept="image/*"
        @update:model-value="updateImage"
      />
      <v-btn
        color="error"
        @click="reset"
      >
        Reset
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
#container {
  display: flex;
  flex-direction: column;

  padding: 1rem;
  margin-top: 3rem;
}
</style>
