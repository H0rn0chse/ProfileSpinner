<script setup>
import SideSettings from "@/components/SideSettings.vue";
import MainView from "@/components/MainView.vue";
</script>

<template>
  <v-app id="app"
    theme="dark"
    overflow-hidden>
    <v-main>
      <div id="gridContainer">
        <SideSettings style="gridArea:side;" />
        <MainView style="gridArea:main;" />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
#app,
#gridContainer {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

#gridContainer {
  display: grid;
  grid-template-columns: 20rem auto;
  grid-template-rows: auto;
  grid-template-areas:
    "side main";
}
</style>
