class DragAndDropPages {
    itemIdMouseDown: number | null;
    handleMouseUp: any;
    handleMouseMove: any;
    itemX: number | null;
    itemY: number | null;

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

    setMouseDown(id: number) {
        this.itemIdMouseDown = id;
    }

    setMouseUp() {
        this.itemIdMouseDown = null;
    }

    setMouseMove(event: MouseEvent) {
        if (this.itemIdMouseDown != null) {
            this.itemX = event.clientX;
            this.itemY = event.clientY;
        }
    }
}

export default new DragAndDropPages();