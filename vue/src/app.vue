<template>
  <div
    class="bg-gray-900 text-gray-300 h-screen flex justify-center items-center py-10 px-4 overflow-hidden"
  >
    <router-view />
  </div>
</template>

<style>
* {
  user-select: none;
  cursor: default;
  scrollbar-width: none;
}

::-webkit-scrollbar {
  display: none;
}

input {
  outline: none;
  cursor: text;
}

button:focus {
  outline: none;
}

audio {
  outline: none;
}
</style>