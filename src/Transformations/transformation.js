export const transformation = {
    multiplyMatrix: (A, B) => {
        let rowsA = A.length, colsA = A[0].length,
            rowsB = B.length, colsB = B[0].length,
            C = [];
        if (colsA !== rowsB) return false;
        for (let i = 0; i < rowsA; i = i + 1) C[i] = [];
        for (let k = 0; k < colsB; k = k + 1) {
            for (let i = 0; i < rowsA; i = i + 1) {
                let t = 0;
                for (let j = 0; j < rowsB; j = j + 1) t += A[i][j] * B[j][k];
                C[i][k] = t;
            }
        }
        return C;
    },

    //Горизонтальная проекция
    getHorizontalMatrix: () => {
        return [[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]];
    },
    //вертикльная проекция
    getProfileMatrix: () => {
        return [[0, 0, 1, 0], [0, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 1]];
    },

    getRotateMatrixOx: (angle) => {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(angle), Math.sin(angle), 0],
            [0, -Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 0, 1]];
    },

    getRotateMatrixOy: (angle) => {
        return [
            [Math.cos(angle), 0, -Math.sin(angle), 0],
            [0, 1, 0, 0],
            [Math.sin(angle), 0, Math.cos(angle), 0],
            [0, 0, 0, 1]];
    },

    getRotateMatrixOz: (angle) => {
        return [
            [Math.cos(angle), Math.sin(angle), 0, 0],
            [-Math.sin(angle), Math.cos(angle), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]];
    },

    getMoveMatrix: (dx, dy, dz) => {
        return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [dx, dy, dz, 1]];
    },

    getResizeMatrix: (sx, sy, sz) => {
        return [[sx, 0, 0, 0], [0, sy, 0, 0], [0, 0, sz, 0], [0, 0, 0, 1]];
    },

    getDefaultMatrix: (p) => {
        return [[p.x, p.y, p.z, 1]];
    },
}


