<template>
  <div id="app">
    <main-component></main-component>
  </div>
</template>

<script>
import main from "./components/main.vue";

export default {
  name: "App",
  components: {
    "main-component": main,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@1,300&family=Sansita+Swashed:wght@300&display=swap");

#app {
  width: 100%;
  overflow-x: hidden;
  min-height: 500px;
  height: 100vh;
  background-color: #f5f5f5;
  /* background-color: #a32b2b; */
  box-sizing: border-box;
}

h1 {
  font-family: "Sansita Swashed", cursive;
}
</style>
