class DragAndDropPages {
    itemIdMouseDown: number | null;
    handleMouseUp: any;
    handleMouseMove: any;
    itemX: number | null;
    itemY: number | null;
    itemStartX: number;
    itemStartY: number;

    init() {
        this.handleMouseUp = () => {
            this.setMouseUp();
        };

        this.handleMouseMove = (event: MouseEvent) => {
            this.setMouseMove(event);
        };

        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    unload() {
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    setMouseDown(id: number, event: MouseEvent) {
        this.itemIdMouseDown = id;

        this.itemStartX = event.clientX;
        this.itemStartY = event.clientY;
    }

    setMouseUp() {
        this.itemIdMouseDown = null;
        this.itemX = null;
        this.itemY = null;
    }

    setMouseMove(event: MouseEvent) {
        if (this.itemIdMouseDown != null) {
            this.itemX = event.clientX - this.itemStartX;
            this.itemY = event.clientY - this.itemStartY;
        }
    }
}

export default new DragAndDropPages();