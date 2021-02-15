<template>
  <div
    style="max-width: 1300px"
    class="flex flex-col items-end text-center w-full h-full"
  >
    <div class="text-xl text-gray-500 w-full text-left">
      Results table... the names of songs and artists are metadata take from
      your local files, compare that with the spotify result, if aren't right,
      you can delete item, or modify data and search again
    </div>
    <!-- TABLE -->
    <div
      class="w-full border-2 rounded-lg border-gray-800 mt-4 flex-grow overflow-hidden h-full"
    >
      <!-- HEAD -->
      <div
        class="grid grid-cols-8 divide-x divide-gray-800 py-3 border-b-2 border-gray-800 font-bold"
      >
        <div class="col-span-2">song</div>
        <div class="col-span-2">artist</div>
        <div class="col-span-3">spotify result</div>
        <div>X</div>
      </div>
      <!-- HEAD -->
      <!-- CONTENT -->
      <div style="height: calc(100% - 50px)" class="overflow-y-scroll">
        <!-- ROWS -->
        <div
          class="grid grid-cols-8 hover:bg-gray-800"
          v-for="(item, i) in spotifyData"
          :key="i"
        >
          <!-- NAME -->
          <div
            v-if="item.spot.id"
            :class="`flex items-center px-4 py-2 text-left col-span-2`"
          >
            {{ item.name }}
          </div>
          <input
            v-else
            :class="`col-span-2 ${
              item.name ? 'bg-transparent' : 'bg-gray-800'
            } w-full px-4 py-2 hover:bg-gray-700 transition`"
            type="text"
            v-model="item.name"
          />
          <!-- NAME -->
          <!-- ARTIST -->
          <div
            v-if="item.spot.id"
            :class="`flex items-center px-4 py-2 text-left col-span-2`"
          >
            {{ item.artist }}
          </div>
          <input
            v-else
            :class="`col-span-2 ${
              item.name ? 'bg-transparent' : 'bg-gray-800'
            } w-full px-4 py-2 hover:bg-gray-700 transition`"
            type="text"
            v-model="item.artist"
          />
          <!-- ARTIST -->
          <!-- RESULT -->
          <iframe
            v-if="item.spot.id"
            class="col-span-3"
            :src="`https://open.spotify.com/embed/track/${item.spot.id}`"
            width="100%"
            height="80"
            frameborder="0"
            allowtransparency="false"
            allow="encrypted-media"
          ></iframe>
          <div
            class="col-span-3 flex items-center justify-between px-4 py-2"
            v-else
          >
            <div :id="`empty${i}`">no results, change and try again</div>
            <butt @click="getToken(i)" color="gray" small class="ml-4"
              >search</butt
            >
          </div>
          <!-- RESULT -->
          <div
            @click="deleteItem(i)"
            :class="`flex items-center justify-center cursor-pointer w-full px-4 py-2 hover:bg-gray-700 transition`"
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
        {{ footerText }}
      </div>
      <input
        class="ml-6 bg-black py-2 px-4 rounded-full"
        type="text"
        v-model="plName"
      />
      <butt @click="checkUserToken" class="ml-4">create playlist!</butt>
    </div>
    <!-- FOOTER -->
  </div>
</template>

<script>
export default {
  mounted() {
    this.$nextTick(this.updateUi());
  },
  methods: {
    getToken(index) {
      document.querySelector(`#empty${index}`).textContent = "searching...";
      fetch(`${process.env.VUE_APP_SERVER_URL}appToken`)
        .then((r) => r.json())
        .then((r) => {
          this.appToken = r.data.code;
          this.searchOne(index);
        });
    },
    searchOne(index) {
      let text = `artist:${this.spotifyData[index].artist} track:${this.spotifyData[index].name}`;
      return fetch(
        `https://api.spotify.com/v1/search?q=${text}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${this.appToken}`,
          },
        }
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.tracks.items.length > 0) {
            let t = r.tracks.items[0];
            this.spotifyData[index].spot.id = t.id;
            this.spotifyData[index].spot.artist = t.artists[0].name;
            this.spotifyData[index].spot.name = t.name;
            localStorage.setItem(
              "spotifyData",
              JSON.stringify(this.spotifyData)
            );
            this.updateUi();
          } else {
            document.querySelector(`#empty${index}`).textContent =
              "no results, change and try again";
          }
        });
    },
    updateUi() {
      let q = 0;
      this.spotifyData.forEach((el) => {
        if (el.spot.id) {
          q++;
        }
      });
      this.footerText = `the playlist will be created with ${q} songs`;
    },
    deleteItem(index) {
      this.spotifyData.splice(index, 1);
      localStorage.setItem(
              "spotifyData",
              JSON.stringify(this.spotifyData)
            );
      this.updateUi();
    },
    checkUserToken() {
      localStorage.setItem("plName", this.plName);
      this.logInOnSpotify();
    },
    logInOnSpotify() {
      const params = new URLSearchParams({
        client_id: "d4bd7d39da06469ea2e35f07aafec14b",
        response_type: "code",
        redirect_uri: process.env.VUE_APP_CB_URL,
        // state: "",
        scope: "playlist-modify-private",
        show_dialog: false,
      });
      window.location.replace(
        `https://accounts.spotify.com/authorize?${params.toString()}`
      );
    },
  },
  created() {
    this.spotifyData = JSON.parse(localStorage.getItem("spotifyData"));
  },
  data() {
    return {
      data: [],
      spotifyData: [],
      appToken: null,
      footerText: "the playlist will be created with x songs",
      plName: "my awesome playlist",
    };
  },
};
</script>

<style>
</style>