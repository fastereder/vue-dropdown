export default {
  computed: {
    filtered() {
      return this.options.filter(option => {
        let label = typeof option == "object" ? option.label : option;

        return label.toLowerCase().indexOf(this.search.toLowerCase()) != -1;
      });
    }
  }
};
