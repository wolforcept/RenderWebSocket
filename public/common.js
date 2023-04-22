const common = { tiles: [], tilesByName: {} }

function _tile(id, name, options = {}) {
    const tile = { id, name, ...options };
    common.tiles[id] = tile;
    common.tilesByName[name] = tile;
}

_tile(0, 'empty')
_tile(1, 'base1')
_tile(2, 'sand')

console.log("LOADED COMMON DATA")
module.exports = common