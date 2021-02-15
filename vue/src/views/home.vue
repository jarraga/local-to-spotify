<template>
  <div style="max-width: 500px" class="m-10 flex justify-center items-center">
    <div
      v-if="!reading"
      class="flex flex-col justify-center items-center text-center"
    >
      <img class="w-20" :src="require('@/assets/logo.png')" alt="" />
      <div class="mt-4 text-3xl font-bold">localToSpotify</div>
      <div class="text-xl mt-10">
        this app scans your local mp3 files, searches for them on Spotify based
        on metadata information and generates a playlist on your account
      </div>
      <div class="text-xl mt-4">it's easy and fast, let's get started!</div>
      <butt @click="openInput" class="mt-10">scan files (max 100)</butt>

      <input v-show="false" type="file" multiple accept=".mp3" />
    </div>

    <div class="text-xl" v-else>🗄 reading files</div>
  </div>
</template>

<script>
import { parseBlob } from "music-metadata-browser";

export default {
  mounted() {
    document
      .querySelector("input")
      .addEventListener("change", this.onInputChange);
  },
  methods: {
    openInput() {
      document.querySelector("input").click();
    },
    onInputChange() {
      this.reading = true;
      const files = document.querySelector("input").files;

      let size;
      if (files.length > 100) {
        size = 100;
        console.warn("Only first 100 songs will be added!");
      } else {
        size = files.length;
      }

      let fileNames = [];
      let fileUrls = [];
      let promises = [];

      for (let i = 0; i < size; i++) {
        fileNames.push(files[i].name);
        fileUrls.push(URL.createObjectURL(files[i]));
        promises.push(parseBlob(files[i]));
      }

      let data = [];

      Promise.all(promises).then((songs) => {
        songs.forEach((song, i) => {
          data.push({
            name: song.common.title,
            artist: song.common.artist,
            fileName: fileNames[i],
            url: fileUrls[i],
          });
        });
        localStorage.setItem("data", JSON.stringify(data));
        this.$router.push({ name: "fileList" });
      });
    },
  },
  data() {
    return {
      reading: false,
    };
  },
};
</script>
