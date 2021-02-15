<template>
  <div
    style="max-width: 1300px"
    class="flex flex-col justify-center items-center text-center"
  >
    <div class="text-3xl text-center">
      playlist "{{ $route.query.name }}" created successfully!
    </div>
    <div class="text-lg mt-4">
      you can open it here:
      <a
        target="_blank"
        class="underline cursor-pointer"
        :href="`https://open.spotify.com/playlist/${$route.query.id}`"
        >{{ $route.query.name }}</a
      >
    </div>

    <iframe
      class="rounded-lg shadow-lg mt-10"
      :src="`https://open.spotify.com/embed/playlist/${$route.query.id}`"
      width="700"
      height="400"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media"
    ></iframe>

    <div class="mt-6 flex justify-center items-center">
      <butt @click="donate" color="blue">buy me a beer 🍻</butt>
      <butt @click="createAnother" class="ml-4">create another list!</butt>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    donate() {
      window.open("https://www.buymeacoffee.com/jarraga");
    },
    createAnother() {
      localStorage.removeItem("data");
      localStorage.removeItem("spotifyData");
      localStorage.removeItem("plName");
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style>
</style>