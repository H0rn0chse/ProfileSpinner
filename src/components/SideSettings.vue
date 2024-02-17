<script setup>
import { useAppStore } from "@/store/app";
import { computed } from "vue";
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

function updateImage () {

}

function reset () {
  appStore.reset();
}
</script>

<template>
  <div class="container">
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
.container {
  display: flex;
  flex-direction: column;

  padding: 1rem;
  margin-top: 3rem;
}
</style>
