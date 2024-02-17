// Utilities
import { getPersonalizationValue, } from "@/js/personalization";
import { defineStore } from "pinia";


export const useAppStore = defineStore("app", {
  state: () => ({
    currentImage: "",
    metadata: {
      steps: 30,
      daysPerStep: 7,
      startingDay: Date.now()
    }
  }),
  getters: {
  },
  actions: {
    saveImage () {
    },
    removeImage () {
    }
  }
});

export async function loadInitialData () {
  // load initial data
  const savedImage = await getPersonalizationValue("image");
  const appStore = useAppStore();
  // todo
  if (savedImage) {
    appStore.currentImage = savedImage;
  }

  const savedMetadata = await getPersonalizationValue("metadata");
  if (savedMetadata) {
    appStore.metadata = savedMetadata || {};
  }
}
