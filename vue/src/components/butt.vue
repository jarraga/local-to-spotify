<template>
  <div
    @click="$emit('click')"
    :style="`width:${full ? '100%' : 'fit-content'}`"
    :class="`px-4 ${
      small ? 'py-1' : 'py-2'
    } text-${color}-900  rounded-full bg-${color}-500 font-bold cursor-pointer hover:bg-${color}-400 transition`"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "green",
    },
    full: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
