import { useAppStore } from "@/store/app";

export function getAllRotations () {
  const appStore = useAppStore();
  const stepCount = appStore.metadata.steps;
  const stepSize = 360 / (stepCount);
  const steps = new Array(stepCount).fill(0).map((value, index) => {
    return index * stepSize;
  });
  return steps;
}

export function getRotation (step) {
  const appStore = useAppStore();
  const stepCount = appStore.metadata.steps;
  const stepSize = 360 / (stepCount);
  return step * stepSize;
}
