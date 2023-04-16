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
        dirt_O: _tile(25),
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

        // house B
        roof_b_top_1: _tile(52, true),
        roof_b_top_2: _tile(53, true),
        roof_b_top_3: _tile(54, true),
        roof_b_top_4: _tile(55, true),
        roof_b_bot_1: _tile(64, true),
        roof_b_bot_2: _tile(65, true),
        roof_b_bot_3: _tile(66, true),
        roof_b_bot_4: _tile(67, true),
        wall_b_1: _tile(72, true),
        wall_b_2: _tile(73, true),
        wall_b_3: _tile(74, true),
        wall_b_4: _tile(75, true),

        fence_SW: _tile(68, true),
        fence_H_gate: _tile(69),
        fence_SE: _tile(70, true),
        fence_V: _tile(71, true),
        fence_W: _tile(80, true),
        fence_E: _tile(81, true),
        fence_H: _tile(82, true),

        sign: _tile(83, true),
    },
}

Object.keys(common.tiles).forEach(key => {
    common.tiles[common.tiles[key].id] = common.tiles[key]
});

console.log("LOADED COMMON DATA")
module.exports = common