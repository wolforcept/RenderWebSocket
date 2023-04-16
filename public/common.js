function _tile(id, blocks = false) {
    if (id < 10)
        return ({ id, path: 'tile_000' + id, blocks })
    if (id < 100)
        return ({ id, path: 'tile_00' + id, blocks })
    if (id < 1000)
        return ({ id, path: 'tile_0' + id, blocks })
    return ({ id, path: 'tile_' + id, blocks })
}
const common = {
    GRID_W: 10,
    GRID_H: 10,

    tiles: {
        grass1: _tile(0),
        grass2: _tile(1),
        grass3: _tile(2),

        // house A
        roof_a_top_1: _tile(48, true),
        roof_a_top_2: _tile(49, true),
        roof_a_top_3: _tile(50, true),
        roof_a_top_4: _tile(51, true),
        roof_a_bot_1: _tile(60, true),
        roof_a_bot_2: _tile(61, true),
        roof_a_bot_3: _tile(62, true),
        roof_a_bot_4: _tile(63, true),
        wall_a_1: _tile(72, true),
        wall_a_2: _tile(73, true),
        wall_a_3: _tile(74, true),
        wall_a_4: _tile(75, true),
    },
}

Object.keys(common.tiles).forEach(key => {
    common.tiles[common.tiles[key].id] = common.tiles[key]
});

console.log("LOADED COMMON DATA")
module.exports = common