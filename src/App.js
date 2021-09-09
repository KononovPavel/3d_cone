import React, {useEffect, useState} from "react";
import './App.css';

function App() {
    const [rad1, setRad1] = useState('');
    const [rad2, setRad2] = useState('')
    const [height, setHeight] = useState('');
    const [n, setN] = useState('');
    const [active, setActive] = useState(false)

    useEffect(() => {
        drawCord();
    }, [])

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


    return (

        <React.Fragment>
            <div className="App">
                <canvas id='canvas' width={600} height={600}/>
            </div>
            <div className={'userForm'}>
                <p>Блок отрисовки модели</p>
                <input
                    type="number"
                    value={rad1}
                    onChange={e=> setRad1(e.currentTarget.valueAsNumber)}
                    placeholder={'Введите радиус первой окружности'}
                />
                <input
                    type="number"
                    value={rad2}
                    onChange={e=> setRad2(e.currentTarget.valueAsNumber)}
                    placeholder={'Введите радиус второй окружности'}
                />
                <input
                    type="number"
                    value={height}
                    onChange={e=> setHeight(e.currentTarget.valueAsNumber)}
                    placeholder={'Введите высоту конусов'}
                />
                <input
                    type="number"
                    value={n}
                    onChange={e=> setN(e.currentTarget.valueAsNumber)}
                    placeholder={'Введите глубину аппроксимации '}
                />
                <button onClick={()=> alert(JSON.stringify({rad1, rad2, height}))}> отрисовать модель </button>
            </div>
            {/* Вот тут добавить селект, где будет выбор между операциями над фигурой*/}
                <div className={'userForm'} style={{top:'342px', left:'60px'}}>
                    <p>Блок отрисовки модели</p>
                    <input
                        type="number"
                        value={rad1}
                        onChange={e=> setRad1(e.currentTarget.valueAsNumber)}
                        placeholder={'Введите радиус первой окружности'}
                    />
                    <input
                        type="number"
                        value={rad2}
                        onChange={e=> setRad2(e.currentTarget.valueAsNumber)}
                        placeholder={'Введите радиус второй окружности'}
                    />
                    <input
                        type="number"
                        value={height}
                        onChange={e=> setHeight(e.currentTarget.valueAsNumber)}
                        placeholder={'Введите высоту конусов'}
                    />
                    <input
                        type="number"
                        value={n}
                        onChange={e=> setN(e.currentTarget.valueAsNumber)}
                        placeholder={'Введите глубину аппроксимации '}
                    />
                    <button onClick={()=> alert(JSON.stringify({rad1, rad2, height}))}> отрисовать модель </button>
                </div>

        </React.Fragment>
    );
}


export default App;
