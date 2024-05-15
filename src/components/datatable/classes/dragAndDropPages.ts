class DragAndDropPages {
    itemIdMouseDown: number | null;
    pixelsRequiredForDrag: number = 3;
    movedEnoughToStart: boolean   = false;
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
        this.itemIdMouseDown    = null;
        this.movedEnoughToStart = false;
        this.itemX              = null;
        this.itemY              = null;
    }

    setMouseMove(event: MouseEvent) {
        if (this.itemIdMouseDown != null) {
            if (this.movedEnoughToStart) {
                this.itemX = event.clientX - this.itemStartX;
                this.itemY = event.clientY - this.itemStartY;
            } else {
                if (Math.abs(event.clientX - this.itemStartX) > this.pixelsRequiredForDrag ||
                    Math.abs(event.clientY - this.itemStartY) > this.pixelsRequiredForDrag) {
                    this.movedEnoughToStart = true;
                }
            }
        }
    }
}

export default new DragAndDropPages();