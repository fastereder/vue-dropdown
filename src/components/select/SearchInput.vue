<template>
  <input
    class="v-dropdown-search"
    :placeholder="placeholder"
    ref="search"
    @keyup="onKeyUp"
    @focus="onFocus"
    @blur="onBlur"
    v-model="search"
    aria-multiline="false"
    :aria-autocomplete="autocomplete"
    :aria-controls="listId"
    role="searchbox"
  />
</template>

<script>
export default {
  name: "search-input",
  data() {
    return {
      search: ""
    };
  },
  props: {
    events: {
      type: Object
    },
    placeholder: {
      type: String
    },
    value: {
      type: String,
      default: ""
    },
    autocomplete: {
      type: Boolean
    },
    id: {
      type: String,
      required: true
    },
    listId: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.$refs.search.focus();
  },
  methods: {
    onKeyUp(e) {
      this.events.keyup(e);
    },
    onFocus(e) {
      this.events.focus(e);
    },
    onBlur(e) {
      this.events.blur(e);
    }
  },
  beforeDestroy() {
    this.$refs.search.blur();
  },
  mounted() {
    if (this.value) {
      this.search = this.value;
    }
    this.$refs.search.focus();
  },
  watch: {
    search(newVal) {
      this.$emit("input", newVal);
    }
  }
};
</script>
