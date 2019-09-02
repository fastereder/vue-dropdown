export default {
  data() {
    return {
      selectedIndex: -1
    };
  },
  methods: {
    // select option with keyup.ARROWUP
    onArrowUp() {
      if (this.filtered.length == 0) return;

      if (this.selectedIndex == -1 || this.selectedIndex == 0) {
        this.selectedIndex = this.filtered.length - 1;
        return;
      }

      this.selectedIndex -= 1;
    },
    // select option with keyup.ARROWDOWN
    onArrowDown() {
      if (this.filtered.length == 0) return;

      if (
        this.selectedIndex == -1 ||
        this.selectedIndex == this.filtered.length - 1
      ) {
        this.selectedIndex = 0;
        return;
      }

      this.selectedIndex += 1;
    },
    // triggered when searc input has focus and keyup.ENTER is pressed
    // when no option is selected nothing happens
    onEnter() {
      if (this.selectedIndex == -1) return;
      let option = this.filtered[this.selectedIndex];
      this.select(option);
    }
  },
  watch: {
    // when filtered elements is updated reset selectedIndex to avoid out of bound index
    filtered() {
      this.selectedIndex = -1;
    }
  }
};
