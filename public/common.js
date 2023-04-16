function _tile(id, _options = {}) {
    const options = {
        blocks: _options.blocks ? true : false,
        mineable: _options.mineable ? true : false,
        store: _options.store ? true : false,
    }
    if (id < 10)
        return ({ id, path: 'tile_000' + id, options })
    if (id < 100)
        return ({ id, path: 'tile_00' + id, options })
    if (id < 1000)
        return ({ id, path: 'tile_0' + id, options })
    return ({ id, path: 'tile_' + id, options })
}
const common = {
    GRID_W: 50,
    GRID_H: 50,

    tiles: {
        grass1: _tile(0),
        grass2: _tile(1),
        grass3: _tile(2),
        grass4: _tile(43),

        dirt_NW: _tile(12),
        dirt_N: _tile(13),
        dirt_NE: _tile(14),
        dirt_W: _tile(24),
        dirt_O: _tile(25, { mineable: true }),
        dirt_E: _tile(26),
        dirt_SW: _tile(36),
        dirt_S: _tile(37),
        dirt_SE: _tile(38),
        dirt_WN: _tile(39),
        dirt_EN: _tile(40),
        dirt_ES: _tile(41),
        dirt_WS: _tile(42),

        mushrooms: _tile(29),

        // house A
        roof_a_top_1: _tile(48, { blocks: true }),
        roof_a_top_2: _tile(49, { blocks: true }),
        roof_a_top_3: _tile(50, { blocks: true }),
        roof_a_top_4: _tile(51, { blocks: true }),
        roof_a_bot_1: _tile(60, { blocks: true }),
        roof_a_bot_2: _tile(61, { blocks: true }),
        roof_a_bot_3: _tile(62, { blocks: true }),
        roof_a_bot_4: _tile(63, { blocks: true }),
        wall_a_1: _tile(72, { blocks: true }),
        wall_a_2: _tile(73, { blocks: true }),
        wall_a_3: _tile(74, { blocks: true }),
        wall_a_4: _tile(75, { blocks: true }),

        // house B
        roof_b_top_1: _tile(52, { blocks: true }),
        roof_b_top_2: _tile(53, { blocks: true }),
        roof_b_top_3: _tile(54, { blocks: true }),
        roof_b_top_4: _tile(55, { blocks: true }),
        roof_b_bot_1: _tile(64, { blocks: true }),
        roof_b_bot_2: _tile(65, { blocks: true }),
        roof_b_bot_3: _tile(66, { blocks: true }),
        roof_b_bot_4: _tile(67, { blocks: true }),
        wall_b_1: _tile(72, { blocks: true }),
        wall_b_2: _tile(73, { blocks: true }),
        wall_b_3: _tile(75, { blocks: true }),
        wall_b_door_open: _tile(74, { blocks: true, store: true }),

        fence_SW: _tile(68, { blocks: true }),
        fence_H_gate: _tile(69),
        fence_SE: _tile(70, { blocks: true }),
        fence_V: _tile(71, { blocks: true }),
        fence_W: _tile(80, { blocks: true }),
        fence_E: _tile(81, { blocks: true }),
        fence_H: _tile(82, { blocks: true }),

        sign: _tile(83, { blocks: true }),
    },

    // constraints: []
}

Object.keys(common.tiles).forEach(key => {
    common.tiles[common.tiles[key].id] = common.tiles[key]
});

// function constraint(tile, arr) {
//     common.constraints[common.tiles[tile.trim()].id] = (tile + "," + arr).split(',').map(x => common.tiles[x.trim()].id)
// }

// constraint('grass1', 'grass2,grass3,grass4,mushrooms')
// constraint('grass2', 'grass1,grass3,grass4,mushrooms')
// constraint('grass3', 'grass1,grass2,grass3,mushrooms')
// constraint('grass4', 'grass1,grass2,grass3,mushrooms')

// constraint('dirt_NW', '')
// constraint('dirt_N ', '')
// constraint('dirt_NE', '')
// constraint('dirt_W ', '')
// constraint('dirt_O ', '')
// constraint('dirt_E ', '')
// constraint('dirt_SW', '')
// constraint('dirt_S ', '')
// constraint('dirt_SE', '')
// constraint('dirt_WN', '')
// constraint('dirt_EN', '')
// constraint('dirt_ES', '')
// constraint('dirt_WS', '')

console.log(common.constraints)

console.log("LOADED COMMON DATA")
module.exports = common