<template>
  <div
    class="v-dropdown-container"
    :class="{ 'v-dropdown-disabled': disabled }"
    role="combobox"
    :aria-expanded="open"
    :aria-activedescendant="selected ? selectedId : false"
    :aria-owns="searchBoxId"
    aria-haspopup="dialog"
  >
    <div class="v-dropdown">
      <!-- rename class -->
      <div class="v-dropdown-head">
        <div class="d-flex align-items-center h-100">
          <!-- search input -->
          <search-input
            :placeholder="placeholderSearch"
            :events="events"
            v-model="search"
            :value="search"
            :autocomplete="filterable"
            :id="searchBoxId"
            :listId="listId"
            v-if="open && filterable"
          />
          <!-- slot for selected option-->
          <slot name="option-selected" v-bind="selected" v-if="!open">
            <div
              class="selected-value"
              v-if="selected"
            >{{ typeof selected == "object" ? selected.label : selected }}</div>
            <!-- Nothing selected -->
            <div v-else class="v-dropdown-placeholder">{{ placeholder }}</div>
          </slot>
        </div>
        <!-- dropwdown indicator -->
        <slot name="button" v-bind="open">
          <button class="v-dropdown-button" @mousedown.prevent="toggle">
            <img src="../../assets/images/caret-down-solid.svg" v-if="!open" />
            <img src="../../assets/images/caret-up-solid.svg" v-else />
          </button>
        </slot>
      </div>

      <!-- dropdown popup -->
      <ul class="v-dropdown-menu" :class="{ open: open }" role="dialog" ref="v-dropdown-menu">
        <li
          v-for="(option, index) in filtered"
          :key="index"
          @mousedown="select(option)"
          :class="{ highlighted: index == selectedIndex, selected: isOptionSelected(option) }"
          :id="isOptionSelected(option) ? selectedId : false"
          :ref="`v-dropdown-opt-${index}`"
        >
          <!-- slot for options in dropdown list  -->
          <slot
            name="option"
            v-bind="option"
          >{{ typeof option == "object" ? option.label : option }}</slot>
        </li>
      </ul>
    </div>

    <select
      class="v-dropdown-select d-block d-md-none"
      ref="native-select"
      v-model="nativeValue"
      @change="selectNative"
      v-if="isNativeOnMobile"
      :id="listId"
    >
      <option value></option>
      <option
        :value="option"
        v-for="(option, index) in filtered"
        :key="index"
      >{{ typeof option == "object" ? option.label : option }}</option>
    </select>
  </div>
</template>

<script>
import Vue from "vue";
import SearchInput from "./SearchInput";
import FilterMixin from "../../mixins/filter";
import SelectMixin from "../../mixins/select";

export default Vue.component("vue-dropdown", {
  components: {
    SearchInput
  },
  data() {
    return {
      open: false,
      search: "",
      selected: null,
      nativeValue: {},
      id: null
    };
  },
  mixins: [FilterMixin, SelectMixin],
  props: {
    options: {
      type: Array
    },
    placeholder: {
      type: String,
      default: "Please select"
    },
    placeholderSearch: {
      type: String,
      default: "Search ..."
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isNativeOnMobile: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    value: {
      type: Object,
      default: null
    }
  },
  computed: {
    events() {
      return {
        focus: this.onFocus,
        blur: this.onBlur,
        keyup: this.onKeyUp
      };
    },
    searchBoxId() {
      return `searchbox-${this.id}`;
    },
    listId() {
      return `list-${this.id}`;
    },
    selectedId() {
      return `selected-${this.id}`;
    }
  },
  methods: {
    toggle() {
      if (this.disabled) return;

      this.open = !this.open;
    },
    show() {
      if (this.open) return;
      this.open = true;
    },
    close() {
      if (!this.open) return;
      this.open = false;
    },
    onBlur() {
      if (this.open) this.toggle();
    },
    onFocus() {
      if (!this.open) this.show();
    },
    onKeyUp(e) {
      if (this.open) {
        switch (e.keyCode) {
          case 13:
            this.onEnter();
            break;
          case 27:
            this.close();
            break;
          case 38:
            this.onArrowUp();
            break;
          case 40:
            this.onArrowDown();
            break;
        }

        const input = String.fromCharCode(e.keyCode).toLowerCase();

        if (!this.filterable && /[a-zA-Z0-9-_ ]/.test(input)) {
          this.jumpTo(input);
        }
      }
    },
    select(option) {
      this.close();
      this.selected = option;
      this.nativeValue = option;
    },
    selectNative() {
      if (JSON.stringify(this.selected !== this.nativeValue)) {
        this.selected = this.nativeValue;
      }
    },
    isOptionSelected(option) {
      if (this.selected == null) return;

      if (typeof option == "object") {
        return JSON.stringify(this.selected) == JSON.stringify(option);
      }

      return this.selected == option;
    },
    jumpTo(input) {
      for (let index in this.options) {
        let label =
          typeof this.options[index] == "object"
            ? this.options[index].label.toLowerCase()
            : this.options[index].toLowerCase();

        if (label.startsWith(input)) {
          this.selectedIndex = index;
          this.scrollTo(index);
          return;
        }
      }
    },
    scrollTo(index) {
      const el = this.$refs[`v-dropdown-opt-${index}`][0];
      const parent = el.parentElement;
      const offset = el.offsetTop - el.scrollHeight;

      parent.scrollTop = offset;
    }
  },
  watch: {
    open(newVal) {
      if (this.filterable) return;

      if (newVal) {
        document.addEventListener("keyup", this.onKeyUp, false);
      } else {
        document.removeEventListener("keyup", this.onKeyUp);
      }
    }
  },
  mounted() {
    if (this.value != null) this.select(this.value);

    this.id = this._uid;
  }
});
</script>
