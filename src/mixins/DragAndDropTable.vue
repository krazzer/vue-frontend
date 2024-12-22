<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "DragAndDropTable",
  emits: ["mouseDownOnRearrange"],
  data() {
    return {
      mouseDownOnRearrange: false,
      draggingId: <any>null,
      data: <any>[],
      mouseY: <number>0,
      initialY: <number | null>0,
      initialYDifference: <number>0,
      startedDragging: false,
      cloneRowVisible: false,
    }
  },
  watch: {
    mouseDownOnRearrange() {
      this.$emit('mouseDownOnRearrange', this.mouseDownOnRearrange);
    }
  },
  methods: {
    actionMouseUp() {
      this.removeClone();
      this.setMouseDownOnRearrange(false);

      this.startedDragging = false;
      this.cloneRowVisible = false;
    },

    actionMouseMove(e: MouseEvent) {
      // mouse is not down, so skip
      if (!this.mouseDownOnRearrange) {
        return;
      }

      // already started dragging, so just position
      if (this.startedDragging) {
        this.showHoverBar(e);
        this.positionClone(e);
        return;
      }

      // initialize dragging
      if (this.initialY && Math.abs(e.clientY - this.initialY) > 5) {
        this.startedDragging = true;
        this.addClone(e);
      }
    },

    getTableElement(): HTMLTableElement {
      return <HTMLTableElement>this.$refs.table;
    },

    getCloneRow(): HTMLTableRowElement | null {
      return this.getTableElement().querySelector(".dragclone")
    },

    getClonedRow(): HTMLTableRowElement | null {
      return this.getTableElement().querySelector('[data-id="' + this.draggingId + '"]');
    },

    addClone(e: MouseEvent) {
      let index = this.$appUtil.getIndexById(this.data, this.draggingId);
      let row   = Object.assign({}, this.data[index]);

      row.clone = true;

      this.data.push(row);

      setTimeout(() => this.setColumnWidth(e));
    },

    positionClone(e: MouseEvent) {
      this.mouseY = e.clientY - this.getTableElement().getBoundingClientRect().top;

      const cloneRow = this.getCloneRow();

      if (!cloneRow) {
        return;
      }

      cloneRow.style.top = (this.mouseY - this.initialYDifference) + 'px';

      this.cloneRowVisible = true;
    },

    removeClone() {
      const cloneIndex = this.data.findIndex((row: any) => row.clone === true);

      if (cloneIndex !== -1) {
        this.data.splice(cloneIndex, 1);
      }
    },

    setColumnWidth(e: MouseEvent) {
      const table     = this.getTableElement();
      const clonedRow = this.getCloneRow();

      if (!clonedRow) return;

      const originalCells = table.querySelectorAll("tbody tr:not(.dragclone) td");
      const specialCells  = clonedRow.querySelectorAll("td");

      originalCells.forEach((cell: any, index: any) => {
        if (specialCells[index]) {
          specialCells[index].style.width = `${cell.offsetWidth}px`;
        }
      });

      this.positionClone(e);
    },

    /**
     * @param mouseDownOnRearrange
     * @param rowId
     * @param initialY
     */
    setMouseDownOnRearrange(mouseDownOnRearrange: boolean, rowId: null | number = null, initialY: null | number = null) {
      this.mouseDownOnRearrange = mouseDownOnRearrange;
      this.initialY             = initialY;
      this.draggingId           = mouseDownOnRearrange ? rowId : null;

      let clonedRow = this.getClonedRow();

      if (rowId && this.initialY && clonedRow) {
        this.initialYDifference = this.initialY - clonedRow.getBoundingClientRect().top;
      }
    },

    showHoverBar(e: MouseEvent) {
      const rows = this.getTableElement().querySelectorAll('tr');

      rows.forEach((row, index) => {
        if (row.classList.contains('dragclone') || row.dataset.id == this.draggingId) return;

        const { top, bottom, height } = row.getBoundingClientRect();
        const isMouseOverRow = e.clientY > top && e.clientY < bottom;

        row.classList.remove('rearrange', 'rearrange--top', 'rearrange--bottom');

        if (isMouseOverRow) {
          row.classList.add('rearrange');
          const isTopHalf = e.clientY < top + height / 2;
          row.classList.add(isTopHalf ? 'rearrange--top' : 'rearrange--bottom');
        }

        if (index === 1 && e.clientY < top && e.clientY > top - height) {
          row.classList.add('rearrange', 'rearrange--top');
        }

        if (index === rows.length - 2 && e.clientY > bottom && e.clientY < bottom + height) {
          row.classList.add('rearrange', 'rearrange--bottom');
        }
      });
    }
  },

  mounted() {
    window.addEventListener('mouseup', this.actionMouseUp);
    window.addEventListener('mousemove', this.actionMouseMove);
  },

  beforeUnmount() {
    window.removeEventListener('mouseup', this.actionMouseUp);
    window.removeEventListener('mousemove', this.actionMouseMove);
  }
})
</script>