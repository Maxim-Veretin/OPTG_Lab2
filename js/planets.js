// элемент веб страницы в котором будет отображаться графика
var container;

// переменные "камера", "сцена", "отрисовщик"
var camera, scene, renderer;

//#region   объявление переменных, доступных в любой функци

//#endregion

// функция инициализации камеры, отрисовщика, объектов сцены и т.д.
init();
// обновление данных по таймеру браузера
animate();

// в этой функции можно добавлять объекты и выполнять их первичную настройку
function init()
{
    // получение ссылки на элемент html страницы
    container = document.getElementById( 'container' );
    // создание сцены
    scene = new THREE.Scene();

    /*  параметры камеры
        45 - FOV камеры (угол обзора)
        window.innerWidth/window.innerHeiht - соотношение сторон
        1 - 4000 - ближняя и дальняя полоскости отсечения */
    camera = new THREE.PerspectiveCamere (45, window.innerWidth/window.innerHeiht, 1, 4000);

    // установка позиции камеры
    camera.position.set(5, 5, 5);
    // точка, на которую смотрит камера
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}