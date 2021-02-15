<template>
  <div
    style="max-width: 1300px"
    class="flex flex-col justify-center items-center text-center"
  >
    <div
      class="flex flex-col justify-center items-center"
      v-if="$route.query.code && creating"
    >
      <div class="text-xl">🎼 creating playlist</div>
      <div class="mt-4">{{ state }}</div>
    </div>
    <div v-if="$route.query.error">
      <div class="text-xl">❕ error logging on spotify</div>
      <div class="mt-4">
        localToSpotify need your permission to create the playlist, please log
        in
      </div>
      <butt class="mt-6" @click="logInOnSpotify">log in</butt>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spotifyData: null,
      creating: true,
      state: "requesting permission...",
      userToken: null,
      userId: null,
      plId: null,
      plName: null,
    };
  },
  created() {
    this.spotifyData = JSON.parse(localStorage.getItem("spotifyData"));
    this.plName = localStorage.getItem("plName");
  },
  mounted() {
    if (this.$route.query.code) {
      this.getUserToken(this.$route.query.code);
    }
  },
  methods: {
    getUserToken(code) {
      fetch(`${process.env.VUE_APP_SERVER_URL}userToken`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((r) => r.json())
        .then((r) => {
          this.userToken = r.data.access_token;
          // localStorage.setItem(
          //   "userToken",
          //   JSON.stringify({
          //     token: r.data.access_token,
          //     timeStamp: Date.now(),
          //   })
          // );
          this.getUserId();
        });
    },
    getUserId() {
      this.state = `getting user id`;
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${this.userToken}`,
        },
      })
        .then((r) => r.json())
        .then((r) => {
          this.userId = r.id;
          this.createPlaylist();
        });
    },
    createPlaylist() {
      this.state = `creating playlist "${this.plName}"`;
      fetch(`https://api.spotify.com/v1/users/${this.userId}/playlists`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          name: this.plName,
          public: false,
          description:
            "playlist created by localToSpotify https://localtospotify.web.app",
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          this.plId = r.id;
          this.addSongs();
        });
    },
    addSongs() {
      this.state = `adding songs! 🎵🎵🎵`;

      let uris = [];
      this.spotifyData.forEach((song) => {
        if (song.spot.id) {
          uris.push(`spotify:track:${song.spot.id}`);
        }
      });

      fetch(`https://api.spotify.com/v1/playlists/${this.plId}/tracks`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${this.userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: 0,
          uris,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          this.$router.push({
            name: "finish",
            query: { name: this.plName, id: this.plId },
          });
        });
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
};
</script>

<style>
</style>