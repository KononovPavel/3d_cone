export const transformation = {
    //просто перегон из координат в матрицу
    getDefaultMatrix: (X, Y, Z, F) => {
        return [[X, Y, Z, F]];
    },

    //поворот относительно X
    getRotateMatrixRelativeX: (angle) => {
        return [[1, 0, 0, 0], [0, Math.cos(angle), Math.sin(angle), 0], [0, -Math.sin(angle), Math.cos(angle), 0], [0, 0, 0, 1]]
    },

    //поворот относительно Y
    getRotateMatrixRelativeY: (angle) => {
        return [[Math.cos(angle), 0, -Math.sin(angle), 0], [0, 1, 0, 0], [Math.sin(angle), 0, Math.cos(angle), 0], [0, 0, 0, 1]]
    },

    //поворот относительно Z
    getRotateMatrixRelativeZ: (angle) => {
        return [[Math.cos(angle), Math.sin(angle), 0, 0], [-Math.sin(angle), Math.cos(angle), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
    },

    //перемещение
    getMoveMatrix: (dx, dy, dz) => {
        return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [dx, dy, dz, 1]];
    },

    // Масштaб
    getScaleMatrix: (sx, sy, sz) => {
        return [[sx, 0, 0, 0], [0, sy, 0, 0], [0, 0, sz, 0], [0, 0, 0, 1]];
    },

    //Горизонтальная проекция
    getHorizontalMatrix: () => {
        return [[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]];
    },
    //вертикльная проекция
    getProfileMatrix: () => {
        return [[0, 0, 1, 0], [0, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 1]];
    },
    //умножение матриц
    multiplyMatrix : (A, B) => {
        debugger
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
    }

}


