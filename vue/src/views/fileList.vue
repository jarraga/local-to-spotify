<template>
  <!-- CONTENT -->
  <div
    v-if="!searching"
    style="max-width: 1300px"
    class="flex flex-col items-end text-center w-full h-full"
  >
    <div class="text-xl text-gray-500 w-full text-left">
      Files table... please fill empty fields, songs with no artist or name will
      be not searched
    </div>
    <!-- TABLE -->
    <div
      class="w-full border-2 rounded-lg border-gray-800 mt-4 flex-grow overflow-hidden h-full"
    >
      <!-- HEAD -->
      <div
        class="grid grid-cols-12 divide-x divide-gray-800 py-3 border-b-2 border-gray-800 font-bold"
      >
        <div class="col-span-3">song</div>
        <div class="col-span-2">artist</div>
        <div class="col-span-3">player</div>
        <div class="col-span-3">fileName</div>
        <div>X</div>
      </div>
      <!-- HEAD -->
      <!-- CONTENT -->
      <div style="height: calc(100% - 50px)" class="overflow-y-scroll">
        <!-- ROWS -->
        <div
          class="grid grid-cols-12 hover:bg-gray-800"
          v-for="(item, i) in data"
          :key="i"
        >
          <input
            @blur="updateUi"
            :class="`col-span-3 ${
              item.name ? 'bg-transparent' : 'bg-gray-800'
            } w-full px-4 py-2 hover:bg-gray-700 transition`"
            type="text"
            v-model="item.name"
          />
          <!--  -->
          <input
            @blur="updateUi"
            :class="`col-span-2 ${
              item.artist ? 'bg-transparent' : 'bg-gray-800'
            } w-full px-4 py-2 hover:bg-gray-700 transition`"
            type="text"
            v-model="item.artist"
          />
          <!--  -->
          <div class="col-span-3 flex justify-center items-center px-4 py-1">
            <audio
              class="h-7"
              @play="stopOthers"
              controls
              :src="item.url"
            ></audio>
          </div>
          <!--  -->
          <div
            class="col-span-3 items-center text-left px-4 py-2 select-all truncate"
          >
            {{ item.fileName }}
          </div>
          <!--  -->
          <div
            @click="deleteItem(i)"
            class="flex items-center justify-center px-4 py-2 cursor-pointer hover:bg-gray-700 transition"
          >
            🗑️
          </div>
        </div>
        <!-- ROWS -->
      </div>
      <!-- CONTENT -->
    </div>
    <!-- TABLE -->
    <!-- FOOTER -->
    <div
      class="flex justify-end items-center mt-4 bg-gray-800 p-4 rounded-full"
    >
      <div class="ml-4 text-lg text-gray-500 underline">
        {{ qText }}
      </div>
      <butt @click="getToken" class="ml-6">search songs</butt>
    </div>
    <!-- FOOTER -->
  </div>
  <!-- SEARCHING -->
  <div class="text-xl" v-else>🎶 searching songs</div>
  <!-- SEARCHING -->

  <!-- CONTENT -->
</template>

<script>
export default {
  methods: {
    deleteItem(index) {
      this.data.splice(index, 1);
      localStorage.setItem("data", JSON.stringify(this.data));
      this.updateUi();
    },
    stopOthers(e) {
      document.querySelectorAll("audio").forEach((audio) => {
        if (audio != e.target) {
          audio.pause();
        }
      });
    },
    getToken() {
      this.searching = true;
      fetch(`${process.env.VUE_APP_SERVER_URL}appToken`)
        .then((r) => r.json())
        .then((r) => {
          this.appToken = r.data.code;
          this.searchSongs();
        });
    },
    searchSongs() {
      let promises = [];
      let validSongs = [];
      this.data.forEach((song) => {
        if (song.artist && song.name) {
          validSongs.push({
            name: song.name,
            artist: song.artist,
            spot: { id: null, artist: null, name: null },
          });
          promises.push(
            this.search(`artist:${song.artist} track:${song.name}`)
          );
        }
      });

      let finalData = [];

      Promise.all(promises).then((values) => {
        // let index = 0;
        values.forEach((val, i) => {
          finalData.push(validSongs[i]);
          if (val.tracks.items.length > 0) {
            let t = val.tracks.items[0];
            finalData[i].spot.id = t.id;
            finalData[i].spot.artist = t.artists[0].name;
            finalData[i].spot.name = t.name;
            // index++;
          }
        });
        localStorage.setItem("spotifyData", JSON.stringify(finalData));
        this.$router.push({ name: "songsQuery" });
      });

      //
    },
    search(text) {
      return fetch(
        `https://api.spotify.com/v1/search?q=${text}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${this.appToken}`,
          },
        }
      ).then((r) => r.json());
    },
    updateUi() {
      let q = 0;
      this.data.forEach((song) => {
        if (song.artist && song.name) {
          q++;
        }
      });
      this.qText = `${q} of ${this.data.length} songs will be searched`;
    },
  },
  created() {
    this.data = JSON.parse(localStorage.getItem("data"));
  },
  mounted() {
    this.$nextTick(this.updateUi());
  },
  data() {
    return {
      data: [],
      spotifyData: [],
      qText: "x of x songs will be searched",
      appToken: null,
      searching: false,
    };
  },
};
</script>

<style>
</style>