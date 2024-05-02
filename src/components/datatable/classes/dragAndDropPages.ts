class DragAndDropPages {
    itemIdMouseDown: number | null;
    handleMouseUp: any;
    handleMouseMove: any;

    init() {
        this.handleMouseUp = () => {
            this.setMouseUp();
        };

        this.handleMouseMove = () => {
            this.setMouseMove();
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

    setMouseMove() {
        if (this.itemIdMouseDown != null) {
            console.log('moving ' + this.itemIdMouseDown);
        }
    }
}

export default new DragAndDropPages();