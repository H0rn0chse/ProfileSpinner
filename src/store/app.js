// Utilities
import { getPersonalizationValue, setPersonalizationValue, } from "@/js/personalization";
import { clone, formatDate } from "@/js/utils";
import { defineStore } from "pinia";

function getDefaultMetadata () {
  return {
    steps: 30,
    daysPerStep: 7,
    startingDay: formatDate(new Date())
  };
}


export const useAppStore = defineStore("app", {
  state: () => ({
    stockImageInUse: true,
    currentImage: "",
    metadata: {
      steps: null,
      daysPerStep: null,
      startingDay: null
    }
  }),
  getters: {
  },
  actions: {
    reset () {
      this.stockImageInUse = true;
      this.metadata = getDefaultMetadata();
      clearMetadata();
    },
    saveImage () {
    },
    removeImage () {
      this.stockImageInUse = true;
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

export async function loadInitialData () {
  // load initial data
  const savedImage = await getPersonalizationValue("image");
  const appStore = useAppStore();
  // todo
  if (savedImage) {
    appStore.currentImage = savedImage;
    this.stockImageInUse = false;
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
