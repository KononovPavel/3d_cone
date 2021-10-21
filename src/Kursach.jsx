import React, { Component } from 'react';
import {transformation as Transformations} from "./Transformations/transformation";

export class Kursach extends Component {
    static displayName = Kursach.name;

    constructor(props) {
        super(props);
        this.state = {
            smallRadius: 100,
            bigRadius: 200,
            height: 400,
            approximationDegree: 24,
            numberOfPoints: 0,
            inputs: [],
            points: this.createPoints(),
            perenosX: 0,
            perenosY: 0,
            perenosZ: 0,
            coord: false,
            sx: 0,
            sy: 0,
            sz: 0,
            rx: 0,
            ry: 0,
            rz: 0,
            angleX: 0,
            angleY: 0,
            angleZ: 0,
            psi: 45,
            fi: 60,
            alpha: 45,
            l: 1,
            gamma: 90,
            p: 400,
            d: 300,
            viewPoint: {
                x: 0, y: 0, z: 5000
            },
            lightPoint: {
                x: 0, y: 0, z: 500
            },
        };
    }

    createPoints() {
        let points = [];
        let smallPoints = [];
        let bigPoints = [];
        let approximationDegree = this.state?.approximationDegree ? this.state.approximationDegree : 24;
        let smallRadius = this.state?.smallRadius ? this.state.smallRadius : 50;
        let bigRadius = this.state?.bigRadius ? this.state.bigRadius : 100;
        let height = this.state?.height ? this.state.height : 50;

        let alpha = 360 / approximationDegree;
        smallPoints.push(
            {
                x: 0,
                y: height,
                z: 0
            }
        )
        for (let i = 0; i < approximationDegree; i++) {
            smallPoints.push(
                {
                    x: smallRadius * Math.cos(Math.PI * alpha / 180),
                    y: 0,
                    z: smallRadius * Math.sin(Math.PI * alpha / 180)
                }
            )
            bigPoints.push(
                {
                    x: bigRadius * Math.cos(Math.PI * alpha / 180),
                    y: 0,
                    z: bigRadius * Math.sin(Math.PI * alpha / 180)
                }
            )
            alpha += 360 / approximationDegree
        }
        points = [...smallPoints, ...bigPoints];
        return points;
    }
    //видовое преобразование 23 страница методички- изменение положения взгляда
    getVMatrix() {
        let p = this.state.p;
        let psi = this.state.psi * Math.PI / 180;
        let theta = this.state.gamma * Math.PI / 180;
        console.log(psi, theta)
        return [
            [-Math.sin(theta), -Math.cos(psi) * Math.cos(theta), -Math.sin(psi) * Math.cos(theta), 0],
            [Math.cos(theta), -Math.cos(psi) * Math.sin(theta), -Math.sin(psi) * Math.sin(theta), 0],
            [0, Math.sin(psi), -Math.cos(psi), 0],
            [0, 0, p, 1]];
    }
    //косоугольная матрица
    getObliqueMatrix() {
        let alpha = this.state.alpha * Math.PI / 180;
        let l = this.state.l;
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [l * Math.cos(alpha), l * Math.sin(alpha), 1, 0], // 1 - z умирает
            [0, 0, 0, 1]];
    }
    //аксонометрическая матрица
    getAxonometricMatrix() {
        let psi = this.state.psi * Math.PI / 180;
        let fi = this.state.fi * Math.PI / 180;

        return [
            [Math.cos(psi), Math.sin(psi) * Math.sin(fi), 0, 0],
            [0, Math.cos(fi), 0, 0],
            [Math.sin(psi), -Math.sin(fi) * Math.cos(psi), 1, 0],
            [0, 0, 0, 1]];
    }

    drawCoord() {
        var myCanvas = document.getElementById("my_canvas");
        var ctx = myCanvas.getContext("2d");
        function draw(startX, startY, stepX, stepY) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + stepX, startY + stepY);
            var text = (startX - 500 == 0) ? (startY - 500) : (startX - 500);
            ctx.fillText(text, startX, startY);
            ctx.strokeStyle = '#343a40';
            ctx.lineWidth = 1;
            ctx.moveTo(0, startY);
            ctx.lineTo(1000, startY);
            ctx.moveTo(startX, 0);
            ctx.lineTo(startX, 1000);
            ctx.strokeStyle = '#919191';
            ctx.stroke();
            ctx.closePath();
        }

        for (let index = 0; index <= 500; index += 20) {
            draw(500, 500 + index, 0, 20)
            draw(500, 500 - index, 0, -20)
            draw(500 + index, 500, 20, 0)
            draw(500 - index, 500, -20, 0)
        }

        ctx.beginPath();
        ctx.moveTo(0, 500);
        ctx.lineTo(1000, 500);
        ctx.moveTo(500, 0);
        ctx.lineTo(500, 1000);
        ctx.strokeStyle = '#343a40';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    // получение центральной точки у грани
    getCentralPoint(edge) {
        let point1 = edge[0].lineStart;
        let point2 = edge[0].lineEnd;
        let point3 = edge[1].lineEnd;
        if (edge.length === 4) {
            let point4 = edge[2].lineEnd;
            let x0 = (point1.x + point2.x + point3.x + point4.x) / 4;
            let y0 = (point1.y + point2.y + point3.y + point4.y) / 4;
            let z0 = (point1.z + point2.z + point3.z + point4.z) / 4;
            return {
                x: x0, y: y0, z: z0
            }
        } else {
            let x0 = (point1.x + point2.x + point3.x) / 3;
            let y0 = (point1.y + point2.y + point3.y) / 3;
            let z0 = (point1.z + point2.z + point3.z) / 3;
            return {
                x: x0, y: y0, z: z0
            }
        }
    }
    //получение нормали к плоскости, координаты вычисляются
    getNormal(edge) {
        let point1 = edge[0].lineStart;
        let point2 = edge[0].lineEnd;
        let point3 = edge[1].lineEnd;
        let x = point1.y * point2.z + point2.y * point3.z + point3.y * point1.z
            - point2.y * point1.z - point3.y * point2.z - point1.y * point3.z;
        let y = point1.z * point2.x + point2.z * point3.x + point3.z * point1.x
            - point2.z * point1.x - point3.z * point2.x - point1.z * point3.x;
        let z = point1.x * point2.y + point2.x * point3.y + point3.x * point1.y
            - point2.x * point1.y - point3.x * point2.y - point1.x * point3.y;
        return {
            x: x, y: y, z: z
        }
    }
    //получение косинуса по
    getCos(a, b) {
        //для вычисления косинуса по формулам с листика
        let ab = a.x * b.x + a.y * b.y + a.z * b.z;
        let aLength = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
        let bLength = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);
        let cos = ab === 0 ? 0 : ab / (aLength * bLength);
        return cos
    }
    //получение угла для отрисовки линии
    getAngle(edge) {
        let centralPoint = this.getCentralPoint(edge);
        let normal = this.getNormal(edge);
        let b = {
            x: this.state.viewPoint.x - centralPoint.x,
            y: this.state.viewPoint.y - centralPoint.y,
            z: this.state.viewPoint.z - centralPoint.z
        };
        let a = { x: normal.x, y: normal.y, z: normal.z };
        let cos = this.getCos(a, b);
        let angle = Math.acos(cos) * (180 / Math.PI);
        return angle;
    }
    //возвращает число в байтовом значении 0 - ....    55страница
    getBrightness(edge, il, kl, ia, ka) {
        let centralPoint = this.getCentralPoint(edge);
        let normal = this.getNormal(edge);
        let vector = {
            x: this.state.lightPoint.x - centralPoint.x,
            y: this.state.lightPoint.y - centralPoint.y,
            z: this.state.lightPoint.z - centralPoint.z
        };
        let cos = this.getCos(normal, vector);
        let brightness = il * kl + ia * ka * cos;
        return this.numberToByte(brightness);
    }
        // для яркости из за rgb, нужно переводить число в байты (ctr c -> ctr v)
    numberToByte(x) {
        let bytes = [];
        let i = 8;
        do {
            bytes[--i] = x & (255);
            x = x>>8;
        } while (i)
        let num = +bytes.join('');
        return num;
    };

    draw(e) {
        var myCanvas = document.getElementById("my_canvas");
        var ctx = myCanvas.getContext("2d");
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        this.drawCoord();
        let points = this.state.points;
        let edges = [];
        let approximationDegree = this.state.approximationDegree;
        let top = points[0];
        for (let i = 1; i < approximationDegree; i++) {
            let line1 = {
                lineStart: points[i], lineEnd: top
            }
            let line2 = {
                lineStart: top, lineEnd: points[i + 1]
            }
            let line3 = {
                lineStart: points[i + 1], lineEnd: points[i]
            }
            edges.push([line1, line2, line3])
            edges[edges.length - 1].internal = true; // внутренний конус треугольники
        }
        //костыль для внутренней
        let line1 = {
            lineStart: points[approximationDegree], lineEnd: top
        }
        let line2 = {
            lineStart: top, lineEnd: points[1]
        }
        let line3 = {
            lineStart: points[1], lineEnd: points[approximationDegree]
        }
        edges.push([line1, line2, line3])
        edges[edges.length - 1].internal = true;
        //внешние треугольники
        for (let i = approximationDegree + 1; i < approximationDegree * 2; i++) {
            let line1 = {
                lineStart: points[i], lineEnd: top
            }
            let line2 = {
                lineStart: top, lineEnd: points[i + 1]
            }
            let line3 = {
                lineStart: points[i + 1], lineEnd: points[i]
            }
            edges.push([line1, line2, line3])
        }
        //костыль
        line1 = {
            lineStart: points[approximationDegree * 2], lineEnd: top
        }
        line2 = {
            lineStart: top, lineEnd: points[approximationDegree + 1]
        }
        line3 = {
            lineStart: points[approximationDegree + 1], lineEnd: points[approximationDegree * 2]
        }
        edges.push([line1, line2, line3])
        //трапеции
        for (let i = 1; i < approximationDegree; i++) {
            let line1 = {
                lineStart: points[i], lineEnd: points[i + approximationDegree]
            }
            let line2 = {
                lineStart: points[i + approximationDegree], lineEnd: points[i + approximationDegree + 1]
            }
            let line3 = {
                lineStart: points[i + approximationDegree + 1], lineEnd: points[i + 1]
            }
            let line4 = {
                lineStart: points[i + 1], lineEnd: points[i]
            }
            edges.push([line1, line2, line3, line4])
        }
        line1 = {
            lineStart: points[1], lineEnd: points[approximationDegree]
        }
        line2 = {
            lineStart: points[approximationDegree], lineEnd: points[approximationDegree * 2]
        }
        line3 = {
            lineStart: points[approximationDegree * 2], lineEnd: points[approximationDegree + 1]
        }
        let line4 = {
            lineStart: points[approximationDegree + 1], lineEnd: points[approximationDegree]
        }
        edges.push([line1, line2, line3, line4])
        
        //z-буфер
        // edges.sort((edgeA, edgeB) => {
        //     let za = this.getCentralPoint(edgeA).z
        //     let zb = this.getCentralPoint(edgeB).z
        //     if (za > zb) {
        //         return 1;
        //     }
        //     if (za < zb) {
        //         return -1;
        //     }
        //     return 0;
        // })
        edges.forEach((edge, key) => {
            let angle = this.getAngle(edge);
            edge.brightness = this.getBrightness(edge, 128, 1, 127, 1);
            ctx.beginPath();
            let point1 = edge[0].lineStart;
            let point2 = edge[0].lineEnd;
            let point3 = edge[1].lineEnd;
            if ((!edge.internal && angle < 90) || (edge.internal && angle > 90)) {
                if (edge.length === 4) {
                    let point4 = edge[2].lineEnd;
                    ctx.moveTo(point1.x + 500, -point1.y + 500);
                    ctx.lineTo(point2.x + 500, -point2.y + 500);
                    ctx.lineTo(point3.x + 500, -point3.y + 500);
                    ctx.lineTo(point4.x + 500, -point4.y + 500);
                    ctx.lineTo(point1.x + 500, -point1.y + 500);
                } else {
                    ctx.moveTo(point1.x + 500, -point1.y + 500);
                    ctx.lineTo(point2.x + 500, -point2.y + 500);
                    ctx.lineTo(point3.x + 500, -point3.y + 500);
                    ctx.lineTo(point1.x + 500, -point1.y + 500);
                }
            }
            ctx.strokeStyle = `rgb(${Math.floor(edge.brightness)},${Math.floor(edge.brightness)},${Math.floor(edge.brightness)})`;
            //внутренняя часть
            if (edge.internal) {
                ctx.strokeStyle = `rgb(255,0,0)`;
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = `rgb(${Math.floor(edge.brightness)},${Math.floor(edge.brightness)},${Math.floor(edge.brightness)})`;
            if (edge.internal) {
                ctx.fillStyle = `rgb(0,0,${Math.floor(edge.brightness)})`;
            }
            ctx.fill();
            //точки наши
            // ctx.beginPath();
            // let abc = this.getCentralPoint(edge);
            // ctx.moveTo(abc.x + 500, -abc.y + 500);
            // ctx.lineTo(abc.x + 501, -abc.y + 501);
            // ctx.strokeStyle = `rgb(0,255,0)`;
            // ctx.closePath();
            // ctx.stroke();
            // let cbd = this.getNormal(edge)
            // ctx.moveTo(cbd.x + 500, -cbd.y + 500);
            // ctx.lineTo(cbd.x + 501, -cbd.y + 501);
            // ctx.strokeStyle = `rgb(255,0,0)`;
            // ctx.closePath();
            // ctx.stroke();
        })
    }
    //перемещение
    move() {
        let points = []
        for (let index = 0; index < this.state.points.length; index++) {
            let a = Transformations.getDefaultMatrix(this.state.points[index]);
            let b = Transformations.getMoveMatrix(this.state.perenosX, this.state.perenosY, this.state.perenosZ)
            let c = Transformations.multiplyMatrix(a, b);
            console.log(c)
            points.push({ x: c[0][0], y: c[0][1], z: c[0][2] })
        }
        this.setState({ points: points }, () => this.draw())
    }
    //масштаб
    resize() {
        let sz = this.state.sz;
        let sy = this.state.sy;
        let sx = this.state.sx;
        var a = Transformations.getMoveMatrix(-this.state.points[0].x, -this.state.points[0].y, -this.state.points[0].z);
        var b = Transformations.getResizeMatrix(sx, sy, sz);
        var c = Transformations.getMoveMatrix(this.state.points[0].x, this.state.points[0].y, this.state.points[0].z);
        var result = Transformations.multiplyMatrix(Transformations.multiplyMatrix(a, b), c);
        let points = []
        for (let i = 0; i < this.state.points.length; i++) {
            points.push({
                x: Transformations.multiplyMatrix(Transformations.getDefaultMatrix(this.state.points[i]), result)[0][0],
                y: Transformations.multiplyMatrix(Transformations.getDefaultMatrix(this.state.points[i]), result)[0][1],
                z: Transformations.multiplyMatrix(Transformations.getDefaultMatrix(this.state.points[i]), result)[0][2],
            })
        }
        this.setState({ points: points }, () => this.draw())
    }
    //поворот
    rotate(angleX, angleY, angleZ) {
        angleX = angleX * Math.PI / 180;
        angleY = angleY * Math.PI / 180;
        angleZ = angleZ * Math.PI / 180;
        let x = this.state.rx;
        let y = this.state.ry;
        let z = this.state.rz;
        var a = Transformations.getMoveMatrix(-x, -y, -z);
        var b = Transformations.getRotateMatrixOy(angleY);
        let bb = Transformations.getRotateMatrixOx(angleX);
        let bbb = Transformations.getRotateMatrixOz(angleZ);
        let rotatedMatrixes = Transformations.multiplyMatrix(Transformations.multiplyMatrix(b, bb), bbb);
        var c = Transformations.getMoveMatrix(x, y, z);

        let points = []
        for (let i = 0; i < this.state.points.length; i++) {
            let def = Transformations.getDefaultMatrix(this.state.points[i]);
            let res = Transformations.multiplyMatrix(Transformations.multiplyMatrix(Transformations.multiplyMatrix(def, a), rotatedMatrixes), c);
            points.push({
                x: res[0][0],
                y: res[0][1],
                z: res[0][2]
            })
        }
        this.setState({ points: points }, () => this.draw())
    }
    //принимаем матрицу которую нужно и делаем преобразования
    getView(func) {
        let a = func();
        let pointsBefore = this.createPoints();
        let points = []
        for (let i = 0; i < pointsBefore.length; i++) {
            let def = Transformations.getDefaultMatrix(pointsBefore[i]);
            let res = Transformations.multiplyMatrix(def, a);
            points.push({
                x: res[0][0],
                y: res[0][1],
                z: -res[0][2]
            })
        }
        this.setState({ points: points }, () => this.draw())
    }
    //аксонометрическая проекция
    viewAxonometricProjection() {
        let pointsXY = this.createPoints();
        let oxonometricMatrix = this.getAxonometricMatrix();
        let points = []
        for (let i = 0; i < pointsXY.length; i++) {
            let def = Transformations.getDefaultMatrix(pointsXY[i]);
            let res = Transformations.multiplyMatrix(def, oxonometricMatrix);
            points.push({
                x: res[0][0],
                y: res[0][1],
                z: res[0][2]
            })
        }
        this.setState({ points: points }, () => this.draw())
    }
    //угольная проекция
    viewObliqueProjection() {
        let pointsXY = this.createPoints();
        let obliqueMatrix = this.getObliqueMatrix();
        let points = []
        for (let i = 0; i < pointsXY.length; i++) {
            let def = Transformations.getDefaultMatrix(pointsXY[i]);
            let res = Transformations.multiplyMatrix(def, obliqueMatrix);
            points.push({
                x: res[0][0],
                y: res[0][1],
                z: res[0][2]
            })
        }
        this.setState({ points: points }, () => this.draw())
    }
    // перспективная проекция
    viewPerspectiveProjection() {
        let pointsXY = this.createPoints();
        let vMatrix = this.getVMatrix();
        console.log(vMatrix)
        let points = []
        for (let i = 0; i < pointsXY.length; i++) {
            let def = Transformations.getDefaultMatrix(pointsXY[i]);
            let res = Transformations.multiplyMatrix(def, vMatrix);
            let z = Math.abs(res[0][2]);
            let d = this.state.d
            points.push({
                x: res[0][0] * d / z,
                y: res[0][1] * d / z,
                z: d
            })
        }
        this.setState({ points: points }, () => this.draw())
    }

    render() {
        if (!this.state.coord) {
            setTimeout(this.drawCoord, 500)
            this.setState({ coord: true })
        }
        return (
            <div>
                <div className={'main-block'}>
                    <div className={'left form'}>
                        <div>
                            <input type="number" onChange={(ev) => this.setState({ perenosX: ev.target.value })} />
                            <label>Move x</label>
                        </div>
                        <div>
                            <input type="number" onChange={(ev) => this.setState({ perenosY: ev.target.value })} />
                            <label>Move y</label>
                        </div>
                        <div>
                            <input type="number" onChange={(ev) => this.setState({ perenosZ: ev.target.value })} />
                            <label>Move z</label>
                        </div>
                        <div>
                            <button onClick={this.move.bind(this)}>Move</button>
                        </div>

                        <div>
                            <input type="number" onChange={(ev) => this.setState({ sx: ev.target.value })} />
                            <label>Resize x</label>
                        </div>
                        <div>
                            <input type="number" onChange={(ev) => this.setState({ sy: ev.target.value })} />
                            <label>Resize y</label>
                        </div>
                        <div>
                            <input type="number" onChange={(ev) => this.setState({ sz: ev.target.value })} />
                            <label>Resize z</label>
                        </div>
                        <div>
                            <button onClick={(e) => this.resize()}>Resize</button>
                        </div>
                        
                        <div>
                            <input type="number" onChange={(ev) => this.setState({ angleX: ev.target.valueAsNumber })} />
                            <label>Angle X</label>
                        </div>
                        <div>
                            <input type="number" onChange={(ev) => this.setState({ angleY: ev.target.valueAsNumber })} />
                            <label>Angle Y</label>
                        </div>
                        <div>
                            <input type="number" onChange={(ev) => this.setState({ angleZ: ev.target.valueAsNumber })} />
                            <label>Angle Z</label>
                        </div>
                        <div>
                            <button onClick={(e) => this.rotate(this.state.angleX, this.state.angleY, this.state.angleZ)}>Rotatte</button>
                        </div>

                        <div>
                            <input type="number" value={this.state.psi} onChange={(ev) => this.setState({ psi: ev.target.valueAsNumber })} />
                            <label>psi</label>
                        </div>
                        <div>
                            <input type="number" value={this.state.fi} onChange={(ev) => this.setState({ fi: ev.target.valueAsNumber })} />
                            <label>fi</label>
                        </div>
                        <div>
                            <button onClick={(e) => this.viewAxonometricProjection()}>Axonometric</button>
                        </div>
                        
                        <div>
                            <input type="number" value={this.state.alpha} onChange={(ev) => this.setState({ alpha: ev.target.valueAsNumber })} />
                            <label>Alpha</label>
                        </div>
                        <div>
                            <input type="number" value={this.state.l} onChange={(ev) => this.setState({ l: ev.target.valueAsNumber })} />
                            <label>L</label>
                        </div>
                        <div>
                            <button onClick={(e) => this.viewObliqueProjection()}>Oblique</button>
                        </div>
                        
                    </div>
                    <canvas id="my_canvas" width="1000" height="1000"></canvas>
                    <div className={'right form'}>
                        <div>
                            <input type="number" value={this.state.gamma} onChange={(ev) => this.setState({ gamma: ev.target.valueAsNumber })} />
                            <label>gamma</label>
                        </div>
                        <div>
                            <input type="number" value={this.state.psi} onChange={(ev) => this.setState({ psi: ev.target.valueAsNumber })} />
                            <label>psi</label>
                        </div>
                        <div>
                            <input type="number" value={this.state.p} onChange={(ev) => this.setState({ p: ev.target.valueAsNumber })} />
                            <label>p</label>
                        </div>
                        <div>
                            <input type="number" value={this.state.d} onChange={(ev) => this.setState({ d: ev.target.valueAsNumber })} />
                            <label>d</label>
                        </div>
                        <div>
                            <button onClick={(e) => this.viewPerspectiveProjection()}>Perspective</button>
                        </div>

                        <div>
                            <input type="number" value={this.state.viewPoint.x}
                                   onChange={(ev) =>{
                                       ev.persist();
                                       this.setState(prevState => ({ viewPoint: {...prevState.viewPoint, x: (ev.target.valueAsNumber)} }))
                                   }} />
                            <label>view X</label>
                        </div>
                        <div>
                            <input type="number" value={this.state.viewPoint.y}
                                   onChange={(ev) =>{
                                       ev.persist();
                                       this.setState(prevState => ({ viewPoint: {...prevState.viewPoint, y: (ev.target.valueAsNumber)} }))
                                   }} />
                            <label>view Y</label>
                        </div>
                        <div>
                            <input type="number" value={this.state.viewPoint.z}
                                   onChange={(ev) =>{
                                       ev.persist();
                                       this.setState(prevState => ({ viewPoint: {...prevState.viewPoint, z: (ev.target.valueAsNumber)} }))
                                   }} />
                            <label>view Z</label>
                        </div>
                        <div>
                            <button onClick={(e) => this.draw()}>Change Distance</button>
                        </div>


                        <div>
                            <input type="number" value={this.state.lightPoint.x}
                                   onChange={(ev) =>{
                                       ev.persist();
                                       this.setState(prevState => ({ lightPoint: {...prevState.lightPoint, x: (ev.target.valueAsNumber)} }))
                                   }} />
                            <label>light X</label> 
                        </div>
                        <div>
                            <input type="number" value={this.state.lightPoint.y}
                                   onChange={(ev) =>{
                                       ev.persist();
                                       this.setState(prevState => ({ lightPoint: {...prevState.lightPoint, y: ev.target.valueAsNumber} }))
                                   }} />
                            <label>light Y</label>
                        </div>
                        <div>
                            <input type="number" value={this.state.lightPoint.z}
                                   onChange={(ev) =>{
                                       ev.persist();
                                       this.setState(prevState => ({ lightPoint: {...prevState.lightPoint, z: ev.target.valueAsNumber} }))
                                   }} />
                            <label>light Z</label>
                        </div>
                        <div>
                            <button onClick={(e) => this.draw()}>Light</button>
                        </div>

                        <div>
                            <input type="number" value={this.state.approximationDegree} onChange={(ev) => this.setState({ approximationDegree: Number(ev.target.valueAsNumber) })} />
                            <label>App. degree</label>
                        </div>
                        <div>
                            <button className={'draw-btn'} onClick={(ev) => {
                                this.setState({ points: this.createPoints() }, () => this.draw())
                            }}>Draw</button>
                        </div>
                        
                        <div>
                            <button className={'draw-btn'} onClick={(ev) => this.getView(Transformations.getHorizontalMatrix)}>Horizontal</button>
                        </div>

                        <div>
                            <button className={'draw-btn'} onClick={(ev) => this.getView(Transformations.getProfileMatrix)}>Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
