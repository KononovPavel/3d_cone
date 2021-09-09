import React, {useEffect, useState} from "react";
import './App.css';

function App() {
    const [BigRadius, setBigRadius] = useState('');
    const [SmallRadius, setSmallRadius] = useState('')
    const [height, setHeight] = useState('');
    const [n, setN] = useState('');
    const [active, setActive] = useState(false)
    const options = ['draw', 'scale', 'rotate', 'move']
    const [action, setAction] = useState(options[0])

    useEffect(() => {
        drawCord();
    }, [])

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


    const drawCord = () => {
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
        context.fillText("У", 270, 20);
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
    let count = 0;
    const drawCircles = (BigRadiusCallBack, SmallRadiusCallBack, nCallback, height, startPoints) => {
        count ++;
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawCord();
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
        console.log(BigCircle)
        console.log(SmallCircle)

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
            context.moveTo(BigCircle.points[i].X,BigCircle.points[i].Y)
            //B
            context.lineTo(SmallCircle.points[i].X, SmallCircle.points[i].Y)
            context.strokeStyle = "red";
            //C
            context.lineTo(SmallCircle.points[i+1].X, SmallCircle.points[i+1].Y)
            context.strokeStyle = "red";
            //D
            context.lineTo(BigCircle.points[i+1].X, BigCircle.points[i+1].Y)
            //A
            context.lineTo(BigCircle.points[i].X,BigCircle.points[i].Y)
            context.closePath();
            context.lineWidth = 1;
            context.stroke();
        }




            //отрисовка маленького круга
        for (let i = 0; i < SmallCircle.points.length - 1; i++) {
            context.beginPath();
            context.moveTo(SmallCircle.points[i].X,SmallCircle.points[i].Y)
            context.lineTo(SmallCircle.points[i + 1].X,SmallCircle.points[i + 1].Y)
            context.closePath();
            context.strokeStyle = "blue";
            context.lineWidth = 1;
            context.stroke();
        }
        if(count === 2) return;
        drawCircles(BigRadius, SmallRadius, n, height, [0, 0, 0])

    }

    return (

        <React.Fragment>
            <div className="App">
                <canvas id='canvas' width={600} height={600}/>
            </div>
            <div className={'userForm'}>
                <p>Блок отрисовки модели</p>
                <input
                    type="number"
                    value={BigRadius}
                    onChange={e => setBigRadius(e.currentTarget.valueAsNumber)}
                    placeholder={'Введите радиус большей окружности'}
                />
                <input
                    type="number"
                    value={SmallRadius}
                    onChange={e => setSmallRadius(e.currentTarget.valueAsNumber)}
                    placeholder={'Введите радиус меньшей окружности'}
                />
                <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(e.currentTarget.valueAsNumber)}
                    placeholder={'Введите высоту конусов'}
                />
                <input
                    type="number"
                    value={n}
                    onChange={e => setN(e.currentTarget.valueAsNumber)}
                    placeholder={'Введите глубину аппроксимации '}
                />
                <button onClick={() => drawCircles(BigRadius, SmallRadius, n, height, [0, 0, 0])}> отрисовать модель
                </button>
            </div>
            {/* Вот тут добавить селект, где будет выбор между операциями над фигурой*/}
            {/*    <div className={'userForm'} style={{top:'342px', left:'60px'}}>*/}
            {/*        <p>Блок отрисовки модели</p>*/}
            {/*        <input*/}
            {/*            type="number"*/}
            {/*            value={rad1}*/}
            {/*            onChange={e=> setRad1(e.currentTarget.valueAsNumber)}*/}
            {/*            placeholder={'Введите радиус большей окружности'}*/}
            {/*        />*/}
            {/*        <input*/}
            {/*            type="number"*/}
            {/*            value={rad2}*/}
            {/*            onChange={e=> setRad2(e.currentTarget.valueAsNumber)}*/}
            {/*            placeholder={'Введите радиус второй окружности'}*/}
            {/*        />*/}
            {/*        <input*/}
            {/*            type="number"*/}
            {/*            value={height}*/}
            {/*            onChange={e=> setHeight(e.currentTarget.valueAsNumber)}*/}
            {/*            placeholder={'Введите высоту конусов'}*/}
            {/*        />*/}
            {/*        <input*/}
            {/*            type="number"*/}
            {/*            value={n}*/}
            {/*            onChange={e=> setN(e.currentTarget.valueAsNumber)}*/}
            {/*            placeholder={'Введите глубину аппроксимации '}*/}
            {/*        />*/}
            {/*        <button onClick={()=> alert(JSON.stringify({rad1, rad2, height}))}> отрисовать модель </button>*/}
            {/*    </div>*/}

        </React.Fragment>
    );
}


export default App;
