// элемент веб страницы в котором будет отображаться графика
var container;
// переменные "камера", "сцена", "отрисовщик"
var camera, scene, renderer;
//var sphere;
var loader = new THREE.TextureLoader();

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
    camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 1, 4000 );

    // установка позиции камеры
    camera.position.set(0, 0, 1000);
    // точка, на которую смотрит камера
    camera.lookAt(new THREE.Vector3(0, 0.0, 0));
    
    //Создание отрисовщика
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize(window.innerWidth, window.innerWidth );

    container.appendChild( renderer.domElement );

    //Добавление функции обработки события изменения размеров окна
    window.addEventListener( 'resize', onWindowResize, false );

    AddSolarSystem();
}


// Обработка события изменения размеров окна
function onWindowResize()
{
    // Изменение соотношения сторон для виртуальной камеры
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Изменение соотношения сторон рендера
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// В этой функции можно изменять параметры объектов и обрабатывать действия пользователя
function animate()
{
    // Добавление функции на вызов, при перерисовки браузером страницы
    requestAnimationFrame( animate );
    render();
}

//рисование кадра
function render()
{
    // Рисование кадра
    renderer.render( scene, camera );
}

function AddSolarSystem()
{  
    var planetsArr = [9];

    planetsArr[0] = AddPlanet(1500, 0, "starmap");
    planetsArr[1] = AddPlanet(80, 0, "8k_sun");
    planetsArr[2] = AddPlanet(2, 100, "mercurymap");
    planetsArr[3] = AddPlanet(3, 130, "venusmap");
    planetsArr[4] = AddPlanet(3.2, 163, "earthmap1k");
    planetsArr[5] = AddPlanet(2.5, 190, "marsmap1k");
    planetsArr[6] = AddPlanet(10, 250, "jupitermap");
    planetsArr[7] = AddPlanet(9, 320, "saturnmap");
    planetsArr[8] = AddPlanet(6.5, 360, "uranusmap");
    planetsArr[9] = AddPlanet(6.3, 400, "neptunemap");
}

// радиус, x, y, z
function AddPlanet(rad, x, thistex)
{
    // создание сферы
    var geometry = new THREE.SphereGeometry( rad, 32, 32 );
    
    // загрузка текстуры
    var tex = loader.load( "textures/" + thistex + ".jpg" );
    tex.minFilter = THREE.NearestFilter;
    
    // создание материала
    var material = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide
    });

    //создание объёкта
    var sphere = new THREE.Mesh( geometry, material );

    sphere.position.x = x;
    sphere.position.y = 0;
    sphere.position.z = 0;

    //размещение объекта в сцене
    scene.add( sphere );
}