import React, {useEffect, useState} from "react";
import './App.css';

function App() {
    const options = ['draw', 'scale', 'rotate', 'move']
    const [BigRadius, setBigRadius] = useState('');
    const [SmallRadius, setSmallRadius] = useState('')
    const [height, setHeight] = useState('');
    const [n, setN] = useState('');
    const [action, setAction] = useState(options[0])
    const [errorText, setErrorText] = useState(false)
    const [errorRadius, setErrorRadius] = useState(false)
    const [errorApprox, setErrorApprox] = useState(false)
    const [moveX, setMoveX] = useState('')
    const [moveY, setMoveY] = useState('')
    const [moveZ, setMoveZ] = useState('')
    const [rotateXY, setRotateXY] = useState('')
    const [rotateZ, setRotateZ] = useState('')
    const [scaleX, setScaleX] = useState('')
    const [scaleY, setScaleY] = useState('')
    const [scaleZ, setScaleZ] = useState('')
    let axis = 'Y';

    useEffect(() => {
        drawCord(axis);
    }, [])
    //наши исходные данные
    const SmallCircle = {
        points: [],
        startPoint: {
            x: 0,
            y: 0,
            z: height,
            flat: 1
        }
    }
    const BigCircle = {
        points: [],
        startPoint: {
            x: 0,
            y: 0,
            z: height,
            flat: 1
        }
    }
    const startPoints = [0,0,0];


    const drawCord = (axis) => {
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");
        //Рисование координатных осей
        ///----------------------///
        context.beginPath();
        context.moveTo(300, 300);
        context.lineTo(300, 0);
        context.lineTo(300, 600);
        context.moveTo(0, 300);
        context.lineTo(600, 300);
        context.moveTo(300, 0);
        context.lineTo(310, 20);
        context.moveTo(300, 0);
        context.lineTo(290, 20);
        context.moveTo(600, 300);
        context.lineTo(580, 310);
        context.moveTo(600, 300);
        context.lineTo(580, 290);
        context.font = "22px Verdana";
        context.fillText(axis, 270, 20);
        context.font = "22px Verdana";
        context.fillText("0", 280, 320);
        context.font = "22px Verdana";
        context.fillText("Х", 580, 330);
        context.closePath();
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.stroke();

        //рисование сетки
        context.beginPath();
        context.lineWidth = 0.2;
        for (let i = 30; i < 600; i += 30) {
            context.moveTo(i, 0);
            context.lineTo(i, 600);
        }
        for (let i = 30; i < 600; i += 30) {
            context.moveTo(0, i);
            context.lineTo(600, i);
        }
        context.closePath();
        context.stroke();
        //Цифры значений под осями
        context.beginPath();

        for (let i = 330; i < 600; i += 30) {
            context.moveTo(i, 295);
            context.lineTo(i, 305);
            context.font = "10px Verdana";
            context.fillText(i - 300, i - 5, 320);
        }
        for (let i = 0; i < 300; i += 30) {
            context.moveTo(i, 295);
            context.lineTo(i, 305);
            context.font = "10px Verdana";
            context.fillText(i - 300, i - 10, 320);
        }
        context.lineWidth = 1;
        context.closePath();
        context.stroke();
    }
    // радиус1, радиус2, аппроксимация, высота, массив координат вершины
    //вид спереди
    const drawCircles = (BigRadiusCallBack, SmallRadiusCallBack, nCallback, height, startPoints) => {
        axis = 'Y'
        if (BigRadiusCallBack.toString().length === 0 || SmallRadiusCallBack.toString().length === 0 || nCallback.toString().length === 0 || height.toString().length === 0) {
            setErrorText(true)
            setTimeout(() => {
                setErrorText(false)
            }, 2000)
            return;
        }
        if (BigRadiusCallBack <= SmallRadiusCallBack) {
            setErrorRadius(true)
            setTimeout(() => {
                setErrorRadius(false)
            }, 2000)
            return;
        }
        if (nCallback <= 2) {
            setErrorApprox(true)
            setTimeout(() => {
                setErrorApprox(false)
            }, 2000)
            return;
        }
        if (height >= 300) return;

        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawCord(axis);
        let alpha = 360 / nCallback;
        for (let i = 0; i < nCallback; i++) {
            //получение координат малого круга
            // X: SmallRadiusCallBack * Math.cos(Math.PI * alpha / 180) < 0.0005 ? 0 : (SmallRadiusCallBack * Math.cos(Math.PI * alpha / 180)),
            //     Y: SmallRadiusCallBack * Math.sin(Math.PI * alpha / 180) < 0.0005 ? 0 : (SmallRadiusCallBack * Math.sin(Math.PI * alpha / 180)),
            SmallCircle.points.push(
                {
                    X: SmallRadiusCallBack * Math.cos(Math.PI * alpha / 180) + 300,
                    Y: 300 - SmallRadiusCallBack * Math.sin(Math.PI * alpha / 180),
                    Z: height,
                    F: 1
                }
            )
            //получение координат большего круга
            // X: BigRadiusCallBack * Math.cos(Math.PI * alpha / 180) < 0.0005 ? 0 : (BigRadiusCallBack * Math.cos(Math.PI * alpha / 180)),
            //     Y: BigRadiusCallBack * Math.sin(Math.PI * alpha / 180) < 0.0005 ? 0 : (BigRadiusCallBack * Math.sin(Math.PI * alpha / 180)),
            BigCircle.points.push(
                {
                    X: BigRadiusCallBack * Math.cos(Math.PI * alpha / 180) + 300,
                    Y: 300 - BigRadiusCallBack * Math.sin(Math.PI * alpha / 180),
                    Z: height,
                    F: 1
                }
            )
            alpha += 360 / nCallback
        }
        //рисуем круги

        //большой круг
        // for (let i = 0; i < BigCircle.points.length - 1; i++) {
        //     context.beginPath();
        //     context.moveTo(BigCircle.points[i].X,BigCircle.points[i].Y)
        //     context.lineTo(BigCircle.points[i + 1].X,BigCircle.points[i + 1].Y)
        //     context.closePath();
        //     context.strokeStyle = "red";
        //     context.lineWidth = 1;
        //     context.stroke();
        // }

        //два цикла в одном)
        for (let i = 0; i < BigCircle.points.length - 1; i++) {
            context.beginPath();
            context.strokeStyle = "blue";
            //A
            context.moveTo(BigCircle.points[i].X, BigCircle.points[i].Y)
            //B
            context.lineTo(SmallCircle.points[i].X, SmallCircle.points[i].Y)
            context.strokeStyle = "red";
            //C
            context.lineTo(SmallCircle.points[i + 1].X, SmallCircle.points[i + 1].Y)
            context.strokeStyle = "red";
            //D
            context.lineTo(BigCircle.points[i + 1].X, BigCircle.points[i + 1].Y)
            //A
            context.lineTo(BigCircle.points[i].X, BigCircle.points[i].Y)
            context.closePath();
            context.lineWidth = 1;
            context.stroke();
        }
        //простая отрисовка начальной и конечных точек
        context.beginPath();
        context.strokeStyle = "red";
        context.moveTo(BigCircle.points[0].X, BigCircle.points[0].Y);
        context.lineTo(BigCircle.points[BigCircle.points.length - 1].X, BigCircle.points[BigCircle.points.length - 1].Y);
        context.closePath();
        context.lineWidth = 1;
        context.stroke();


        //отрисовка маленького круга синей линией, типо как внутренняя часть
        for (let i = 0; i < SmallCircle.points.length - 1; i++) {
            context.beginPath();
            context.moveTo(startPoints[0] + 300, 300 - startPoints[1])
            context.lineTo(SmallCircle.points[i].X, SmallCircle.points[i].Y)
            context.lineTo(SmallCircle.points[i + 1].X, SmallCircle.points[i + 1].Y)

            context.closePath();
            context.strokeStyle = "blue";
            context.lineWidth = 0.5;
            context.stroke();
        }
        context.beginPath();
        context.strokeStyle = "blue";
        context.moveTo(SmallCircle.points[0].X, SmallCircle.points[0].Y);
        context.lineTo(SmallCircle.points[SmallCircle.points.length - 1].X, SmallCircle.points[SmallCircle.points.length - 1].Y);
        context.closePath();
        context.lineWidth = 1;
        context.stroke();
    }
    // вид сбоку
    const drawRectangle = (height, startPoints) => {
        axis = 'Z';
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawCord(axis);
        context.beginPath()
        for (let i = 0; i < BigCircle.points.length / 2; i++) {
            context.moveTo(300 + startPoints[0], 300 - startPoints[2]);
            context.lineTo(BigCircle.points[i].X, 300 - height);
            context.lineTo(BigCircle.points[i + 1].X, 300 - height);
            context.closePath();
            context.strokeStyle = "red";
            context.lineWidth = 1;
            context.stroke();
        }
        //аналогично и здесь соединяем центр с последней точкой
        context.beginPath();
        context.moveTo(300 + startPoints[0], 300 - startPoints[2]);
        context.lineTo(BigCircle.points[BigCircle.points.length - 2].X, 300 - height);
        context.lineTo(BigCircle.points[BigCircle.points.length - 1].X, 300 - height);
        context.closePath();
        context.strokeStyle = "red";
        context.lineWidth = 1;
        context.stroke();
    }

    //вид сверху
    const drawOnHigh = (height, startPoints) => {
        axis = 'Z';
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawCord(axis);
        context.beginPath();
        for (let i = 0; i < BigCircle.points.length - 1; i++) {
            context.moveTo(300 + startPoints[0], 300 - startPoints[2]);
            context.lineTo(BigCircle.points[i].X, 300 + height);
            context.lineTo(BigCircle.points[i + 1].X, 300 + height);
            context.closePath();
            context.strokeStyle = "red";
            context.lineWidth = 1;
            context.stroke();
        }
    }

    //Logic about
    //просто перегон из координат в матрицу
    const getDefaultMatrix = (X, Y, Z, F) => {
        return [X, Y, Z, F];
    }
    //поворот относительно X
    const getRotateMatrixRelativeX = (angle) => {
        return [[1, 0, 0, 0], [0, Math.cos(angle), Math.sin(angle), 0], [0, -Math.sin(angle), Math.cos(angle), 0], [0, 0, 0, 1]]
    }
    //поворот относительно Y
    const getRotateMatrixRelativeY = (angle) => {
        return [[Math.cos(angle), 0, -Math.sin(angle), 0], [0, 1, 0, 0], [Math.sin(angle), 0, Math.cos(angle), 0], [0, 0, 0, 1]]
    }
    //поворот относительно Z
    const getRotateMatrixRelativeZ = (angle) => {
        return [[Math.cos(angle), Math.sin(angle), 0, 0], [-Math.sin(angle), Math.cos(angle), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
    }
    const getMoveMatrix = (dx, dy, dz) => {
        return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [dx, dy, dz, 1]];
    }

    const getScaleMatrix = (sx, sy, sz) => {
        return [[sx, 0, 0, 0], [0, sy, 0, 0], [0, 0, sz, 0], [0, 0, 0, 1]];
    }


    // just work with UI
    const onClickEnterHandler = (e) => {
        if (e.key === 'Enter') {
            drawCircles(BigRadius, SmallRadius, n, height, startPoints)
            e.preventDefault();
            e.stopPropagation();
        }
    }

    const mappesOptions = options.map(option => <option key={option} value={option}>{option}</option>)
    return (

        <React.Fragment>
            <div className={'select'}>
                <span>Выберите режим работы : </span>
                <select value={action} onChange={(e) => {
                    setAction(e.currentTarget.value);
                    console.log(action)
                }}>
                    {mappesOptions}
                </select>
            </div>
            <div className={'view'}>

                <button onClick={() => drawCircles(BigRadius, SmallRadius, n, height, startPoints)}>Вид спереди</button>
                <button onClick={() => drawRectangle(height, startPoints)}>Вид сбоку</button>
                <button onClick={() => drawOnHigh(height, startPoints)}>вид сверху</button>
            </div>
            <div className="App">
                <canvas id='canvas' width={600} height={600}/>
            </div>


            {
                action === 'draw' && <div className={'userForm'}>
                    <p>Блок отрисовки модели</p>
                    <input
                        type="number"
                        value={BigRadius}
                        onChange={e => setBigRadius(e.currentTarget.valueAsNumber)}
                        placeholder={'Введите радиус большей окружности'}
                        onKeyPress={onClickEnterHandler}
                    />
                    <input
                        type="number"
                        value={SmallRadius}
                        onChange={e => setSmallRadius(e.currentTarget.valueAsNumber)}
                        placeholder={'Введите радиус меньшей окружности'}
                        onKeyPress={onClickEnterHandler}
                    />
                    <input
                        type="number"
                        value={height}
                        onChange={e => setHeight(e.currentTarget.valueAsNumber)}
                        placeholder={'Введите высоту конусов'}
                        onKeyPress={e => onClickEnterHandler(e)}
                    />
                    <input
                        type="number"
                        value={n}
                        onChange={e => setN(e.currentTarget.valueAsNumber)}
                        placeholder={'Введите глубину аппроксимации '}
                        onKeyPress={onClickEnterHandler}
                    />
                    {
                        errorText
                            ? <span style={{color: 'red', marginBottom: '10px'}}>Упс, но вы что то не ввели....</span>
                            : ''
                    }
                    {
                        errorRadius
                            ?
                            <span style={{color: 'red', marginBottom: '10px'}}>Несоответствуют параметры радиусов</span>
                            : ''
                    }
                    {
                        errorApprox
                            ? <span style={{color: 'red', marginBottom: '10px'}}>Недопустимо значение глубины аппроксимации равной {n}</span>
                            : ''
                    }
                    <button onClick={() => drawCircles(BigRadius, SmallRadius, n, height, [0, 0, 0])}> отрисовать модель
                    </button>

                </div>
            }
            {
                action === 'move' && <div className={'userForm'}>
                    <p>Блок перемещения модели</p>
                    <input type="number" placeholder={'Перемещение по оси Х'} value={moveX}
                           onChange={e => setMoveX(e.currentTarget.valueAsNumber)}/>
                    <input type="number" placeholder={'Перемещение по оси Y'} value={moveY}
                           onChange={e => setMoveY(e.currentTarget.valueAsNumber)}/>
                    <input type="number" placeholder={'Перемещение по оси Z'} value={moveZ}
                           onChange={e => setMoveZ(e.currentTarget.valueAsNumber)}/>
                    <button onClick={() => alert(JSON.stringify({moveX, moveY, moveZ}))}>Переместить</button>
                </div>
            }
            {
                action === 'rotate' && <div className={'userForm'}>
                    <p>Блок поворота модели</p>
                    <input type="number" placeholder={'Поворот относительно плоскости XY'} value={rotateXY}
                           onChange={e => setRotateXY(e.currentTarget.valueAsNumber)}/>
                    <input type="number" placeholder={'Поворот относительно плоскости Z'} value={rotateZ}
                           onChange={e => setRotateZ(e.currentTarget.valueAsNumber)}/>
                    <button onClick={() => alert(JSON.stringify({rotateXY, rotateZ}))}>повернуть</button>
                </div>
            }
            {
                action === 'scale' && <div className={'userForm'}>
                    <p>Блок масштабирования модели</p>
                    <input type="number" placeholder={'Масштаб по оси Х'} value={scaleX}
                           onChange={e => setScaleX(e.currentTarget.valueAsNumber)}/>
                    <input type="number" placeholder={'Масштаб по оси Y'} value={scaleY}
                           onChange={e => setScaleY(e.currentTarget.valueAsNumber)}/>
                    <input type="number" placeholder={'Масштаб по оси Z'} value={scaleZ}
                           onChange={e => setScaleZ(e.currentTarget.valueAsNumber)}/>
                    <button onClick={() => alert(JSON.stringify({scaleX, scaleY, scaleZ}))}>отмасшабировать</button>
                </div>
            }
        </React.Fragment>
    );
}


export default App;
