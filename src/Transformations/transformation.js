export const transformation = {
    //просто перегон из координат в матрицу
    getDefaultMatrix : (X, Y, Z, F) => {
        return [X, Y, Z, F];
    },

    //поворот относительно X
    getRotateMatrixRelativeX : (angle) => {
        return [[1, 0, 0, 0], [0, Math.cos(angle), Math.sin(angle), 0], [0, -Math.sin(angle), Math.cos(angle), 0], [0, 0, 0, 1]]
    },

    //поворот относительно Y
    getRotateMatrixRelativeY : (angle) => {
        return [[Math.cos(angle), 0, -Math.sin(angle), 0], [0, 1, 0, 0], [Math.sin(angle), 0, Math.cos(angle), 0], [0, 0, 0, 1]]
    },

    //поворот относительно Z
    getRotateMatrixRelativeZ : (angle) => {
        return [[Math.cos(angle), Math.sin(angle), 0, 0], [-Math.sin(angle), Math.cos(angle), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
    },

    //перемещение
    getMoveMatrix : (dx, dy, dz) => {
        return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [dx, dy, dz, 1]];
    },

    // Масштaб
    getScaleMatrix : (sx, sy, sz) => {
        return [[sx, 0, 0, 0], [0, sy, 0, 0], [0, 0, sz, 0], [0, 0, 0, 1]];
    },

}
