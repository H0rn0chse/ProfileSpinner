// Utilities
import { getPersonalizationValue, setPersonalizationValue, } from "@/js/personalization";
import { getRotation } from "@/js/rotation";
import { clone, formatDate, parseDate } from "@/js/utils";
import { defineStore } from "pinia";

const dayInMs = 1000 * 60 * 60 * 24;

function getDefaultMetadata () {
  return {
    steps: 30,
    daysPerStep: 7,
    startingDay: formatDate(new Date())
  };
}

export const useAppStore = defineStore("app", {
  state: () => ({
    currentImage: "",
    metadata: {
      steps: null,
      daysPerStep: null,
      startingDay: null
    }
  }),
  getters: {
    degree (state) {
      const daysPerStep = state.metadata.daysPerStep || 1;
      const steps = state.metadata.steps || 1;

      const startingDay = parseDate(state.metadata.startingDay);
      const today = new Date();
      const daysSinceStart = Math.abs(today.getTime() - startingDay.getTime()) / dayInMs;
      const stepsSinceStart = daysSinceStart / daysPerStep;
      const currentStep  = Math.floor(stepsSinceStart % steps);

      return getRotation(currentStep);
    }
  },
  actions: {
    async reset () {
      this.metadata = getDefaultMetadata();
      clearMetadata();
      clearImage();
      const { defaultImage } = await import("./defaultImage.js");
      this.currentImage = defaultImage;
    },
    setImage (imgData) {
      this.currentImage = imgData;
      storeImage();
    },
    async removeImage () {
      clearImage();
      const { defaultImage } = await import("./defaultImage.js");
      this.currentImage = defaultImage;
    },
    setSteps (newSteps) {
      this.metadata.steps = newSteps;
      storeMetadata();
    },
    setDaysPerStep (newDaysPerStep) {
      this.metadata.daysPerStep = newDaysPerStep;
      storeMetadata();
    },
    setStartingDay (newStartingDay) {
      this.metadata.startingDay = newStartingDay;
      storeMetadata();
    }
  }
});

async function clearMetadata () {
  await setPersonalizationValue("metadata", {});
}

async function storeMetadata () {
  const appStore = useAppStore();
  await setPersonalizationValue("metadata", clone(appStore.metadata));
}

async function clearImage () {
  await setPersonalizationValue("image", "");
}

async function storeImage () {
  const appStore = useAppStore();
  await setPersonalizationValue("image", appStore.currentImage);
}

export async function loadInitialData () {
  // load initial data
  const savedImage = await getPersonalizationValue("image");
  const appStore = useAppStore();
  if (savedImage) {
    appStore.currentImage = savedImage;
  } else {
    const { defaultImage } = await import("./defaultImage.js");
    appStore.currentImage = defaultImage;
  }

  const defaultMetadata = getDefaultMetadata();
  const savedMetadata = await getPersonalizationValue("metadata");
  if (savedMetadata) {
    Object.keys(defaultMetadata).forEach((key) => {
      appStore.metadata[key] = savedMetadata[key] || defaultMetadata[key];
    });
  } else {
    appStore.metadata = getDefaultMetadata();
  }
}
