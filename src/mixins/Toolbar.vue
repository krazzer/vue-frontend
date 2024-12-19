<script lang="ts">
export default {
  data() {
    return {
      isWrapped: false,
    };
  },
  methods: {
    checkIfWrapped() {
      const container = <any> this.$refs.toolbarButtons;
      if (!container) return;

      const items = container.children;

      if (items.length < 2) {
        this.isWrapped = false;
        return;
      }

      this.isWrapped = container.offsetHeight > items[0].offsetHeight;
    },

    onResize() {
      this.checkIfWrapped();
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  updated() {
    this.checkIfWrapped();
  },
}
</script>