<script lang="ts">
import {defineComponent} from 'vue'

const BOTTOM = 1;
const TOP    = 0;

export default defineComponent({
  name: "DragAndDropTable",
  emits: ["mouseDownOnRearrange"],
  props: ['instance'],
  data() {
    return {
      mouseDownOnRearrange: false,
      draggingId: <any>null,
      data: <any>[],
      mouseY: <number>0,
      initialY: <number | null>null,
      initialYDifference: <number>0,
      startedDragging: false,
      cloneRowVisible: false,
      hoveringId: <number | null>null,
      hoveringPosition: <number>TOP,
    }
  },
  watch: {
    mouseDownOnRearrange() {
      this.$emit('mouseDownOnRearrange', this.mouseDownOnRearrange);
      this.$appUtil.setPreventSelect(this.mouseDownOnRearrange);
    }
  },
  methods: {
    actionMouseUp() {
      if (this.hoveringId) {
        this.rearrange();
      }

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

    rearrange() {
      let params = {
        instance: this.instance, source: this.draggingId, target: this.hoveringId, position: this.hoveringPosition
      };

      this.$appUtil.doAction('datatable/rearrange', params, (response: any) => {
        this.data = response.data;
      })
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
      const rows   = Array.from(this.getTableElement().querySelectorAll('tr'));
      const mouseY = e.clientY;

      this.hoveringId = null;

      rows.forEach((row, index) => {
        if (!row.dataset.id || row.classList.contains('dragclone')) return;

        const id = parseInt(row.dataset.id);
        if (id === this.draggingId) return;

        const {top, bottom, height} = row.getBoundingClientRect();
        const isMouseOverRow        = mouseY > top && mouseY < bottom;

        row.classList.remove('rearrange', 'rearrange--top', 'rearrange--bottom');

        if (isMouseOverRow) {
          this.setHoverState(row, id, mouseY < top + height / 2 ? 'top' : 'bottom');
        } else if (this.isNearRow(mouseY, top, height, index, rows.length)) {
          const position = mouseY < top ? 'top' : 'bottom';
          this.setHoverState(row, id, position);
        }
      });
    },

    setHoverState(row: HTMLElement, id: number, position: 'top' | 'bottom') {
      row.classList.add('rearrange', `rearrange--${position}`);
      this.hoveringId       = id;
      this.hoveringPosition = position === 'top' ? TOP : BOTTOM;
    },

    isNearRow(mouseY: number, top: number, height: number, index: number, totalRows: number): boolean {
      return (
          (index === 1 && mouseY < top && mouseY > top - height) ||
          (index === totalRows - 2 && mouseY > top + height && mouseY < top + 2 * height)
      );
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
});

</script>