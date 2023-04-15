import { addObjectToScene, removeObjectFromScene } from "./main.js"

class Data {
    grid = []

    setPos(i, x, y, type) {
        if (this.grid[i]) {
            removeObjectFromScene(this.grid[i].obj)
        }
        this.grid[i] = { obj: addObjectToScene(x, y, type), type }
    }

    setGrid(grid) {
        for (let i = 0; i < grid.length; i++) {
            const { x, y, type } = grid[i]
            if (!this.grid[i] || this.grid[i].type !== type)
                this.setPos(i, x, y, type)
        }
        this.grid = grid
    }
}

export const DATA = new Data()
window.DATA = DATA