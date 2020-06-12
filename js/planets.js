//#region переменные
var container;
var camera, scene, renderer;
var cameraOrtho, sceneOrtho;
//var camera2, helper;

var loader = new THREE.TextureLoader();
var spaseArr = [9];
var moon;

var clock = new THREE.Clock();
var delta;

var keyboard = new THREEx.KeyboardState();
var keyDown = 0;
var cameraAngle = 0;

var width = window.innerWidth;
var height = window.innerHeight;

var infoArr = [];
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

    sceneOrtho = new THREE.Scene();
    cameraOrtho = new THREE.OrthographicCamera( -width /2, width /2, height /2,
                                                -height /2, 1, 10 );
    cameraOrtho.position.z = 10;

    //FOV камеры, соотношение сторон, полоскости отсечения
    camera = new THREE.PerspectiveCamera(
        45, width/height, 4, 4000 );
    // установка позиции камеры
    camera.position.set(0, 1398, -1398);
    
    // точка, на которую смотрит камера
    camera.lookAt(new THREE.Vector3(0, 0.0, 0));
    //camera.lookAt(new THREE.Vector3(94.5, 0.0, 0));
    
    //Создание отрисовщика
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize(window.innerWidth, window.innerWidth );

    container.appendChild( renderer.domElement );

    //#region хелпер
        // camera2 = new THREE.PerspectiveCamera(
        //     30, window.innerWidth / window.innerHeight, 1, 4000 );
        //     camera2.position.set(10, 1414, -1350);
        //     camera2.lookAt(new THREE.Vector3(0, 1414.0, -1414));
        // helper = new THREE.CameraHelper( camera );
        // helper.visible = true;
        // scene.add(helper);
    //#endregion

    //Добавление функции обработки события изменения размеров окна
    window.addEventListener( 'resize', onWindowResize, false );

    var spotlight = new THREE.PointLight(0xffff00);
    spotlight.position.set(0, 0, 0);
    spotlight.castShadow = true;
    spotlight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(45, 1, 10, 1000));
    spotlight.shadow.bias = 0.0001;
    spotlight.shadow.mapSize.width = 2048;
    spotlight.shadow.mapSize.height = 2048;
    scene.add(spotlight);
    
    renderer.autoClear = false;

    //var light = new THREE.AmbientLight( 0x202020 ); // soft white light
    //scene.add( light );

    AddSolarSystem();
    
    for(var i = 1; i < spaseArr.length-1; i++)
    {
        DrawOrbit(spaseArr[i]);
    }
}

// Обработка события изменения размеров окна
function onWindowResize()
{
    // Изменение соотношения сторон для виртуальной камеры
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    cameraOrtho.left = -width/2;
    cameraOrtho.right = width/2;
    cameraOrtho.top = height/2;
    cameraOrtho.bottom = height/2;
    cameraOrtho.updateProjectionMatrix();

    if (infoArr != null)
    {
        for (var i = 0; i < infoArr.length-1; i++)
        {
            console.log('какашка');
            updateHUDSprites(infoArr[i]);
        }
    }

    // Изменение соотношения сторон рендера
    renderer.setSize( window.innerWidth-30, window.innerHeight-30);
}

// В этой функции можно изменять параметры объектов и обрабатывать действия пользователя
function animate()
{
    delta = clock.getDelta();

    for (var i = 1; i < spaseArr.length-1; i++)
    {
        MovePlanet(spaseArr[i]);
    }
    
    for (var i = 0; i < 10; i += 9)
    {
        StarRotation(spaseArr[i]);
    }
    
    CameraLookAt();
    LookAtPlanet(keyDown);
    MoonMove();

    // Добавление функции на вызов, при перерисовки браузером страницы
    requestAnimationFrame( animate );
    render();
}

//рисование кадра
function render()
{
    renderer.clear();
    renderer.render( scene, camera );
    renderer.clearDepth();
    renderer.render( sceneOrtho, cameraOrtho );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//создание планет
function AddSolarSystem()
{
    spaseArr[0] = AddStar(80, 0, "8k_sun", 0.1);
    
    spaseArr[1] = AddPlanet(2.5, 80+14.5, 'mercury', 4,8);
    spaseArr[2] = AddPlanet(6.1, 80+41, 'venus', 3.5);
    spaseArr[3] = AddPlanet(6.4, 80+70, 'earth', 2.978);
    spaseArr[4] = AddPlanet(3.4, 80+110, 'mars', 2.4);
    spaseArr[5] = AddPlanet(35, 80+200, 'jupiter', 1.307);
    spaseArr[6] = AddPlanet(30, 80+379.5, 'saturn', 0.969);
    spaseArr[7] = AddPlanet(21, 80+544.85, 'uranus', 0.681);
    spaseArr[8] = AddPlanet(20, 767.5, 'neptune', 0.435);
    
    spaseArr[9] = AddStar(2000, 0, "starmap", -0.001);

    moon = AddPlanet(2, 164, "moonmap1k", 1,023);

    infoArr[0] = AddSpriteInfo('mercury');
    infoArr[1] = AddSpriteInfo('venus');
    infoArr[2] = AddSpriteInfo('earth');
    infoArr[3] = AddSpriteInfo('mars');
    infoArr[4] = AddSpriteInfo('jupiter');
    infoArr[5] = AddSpriteInfo('saturn');
    infoArr[6] = AddSpriteInfo('uranus');
    infoArr[7] = AddSpriteInfo('neptune');
}

// радиус, координата по x, текстура
function AddPlanet(rad, x, thistex, vel)
{
    // создание сферы
    var geometry = new THREE.SphereGeometry( rad, 32, 32 );
    
    // загрузка текстуры
    var tex = loader.load( "textures/" + thistex + ".jpg" );
    tex.minFilter = THREE.NearestFilter;
    
    // создание материала
    var material = new THREE.MeshBasicMaterial({
        map: tex,
        //visible: false,
        //wireframe: true,
        side: THREE.DoubleSide
    });

    //создание сферы и его размещение в сцене
    var sphere = new THREE.Mesh( geometry, material );
    var posSphere = new THREE.Vector3(x, 0, 0);
    sphere.position.copy(posSphere);
    sphere.receiveShadow = true;
    scene.add(sphere);

    var nameSprt = AddSpriteName(thistex, posSphere, rad);

    //создание объекта планеты
    var planet = {
        body: sphere,
        posX: posSphere.x,
        angle: 0,
        velocity: vel/5,
        rad: rad,
        nameSprt: nameSprt
    };
    
    return planet;
}

//ф-я движения планет
function MovePlanet(planet)
{
    //создание набора матриц
    var m = new THREE.Matrix4();
    var m1 = new THREE.Matrix4();
    var m2 = new THREE.Matrix4();
    var m3 = new THREE.Matrix4();
    var m4 = new THREE.Matrix4();
    var m5 = new THREE.Matrix4();
    planet.angle += planet.velocity * delta;

    //создание матрицы поворота (вокруг оси Y) в m1 и матрицы перемещения в m2 
    m1.makeRotationY(planet.angle);
    m2.setPosition(new THREE.Vector3(planet.posX, 0, 0));

    //запись результата перемножения m1 и m2 в m 
    m.multiplyMatrices(m1, m2);
    m.multiplyMatrices(m, m1);

    //установка m в качестве матрицы преобразований объекта object 
    planet.body.matrix = m;
    planet.body.matrixAutoUpdate = false;

    m3.setPosition(new THREE.Vector3(0, planet.rad*1.5, 0));
    m5.makeScale(100.0, 30.0, 1.0);
    m4.multiplyMatrices(m1, m2);
    m4.multiplyMatrices(m4, m3);
    m4.multiplyMatrices(m4, m5);

    planet.nameSprt.matrix = m4;
    planet.nameSprt.matrixAutoUpdate = false;
}

//ф-я движения луны
function MoonMove()
{
    var m = new THREE.Matrix4();
    var m1 = new THREE.Matrix4();
    var m2 = new THREE.Matrix4();

    var pos = new THREE.Vector3(0, 0, 0);

    m.copyPosition(spaseArr[3].body.matrix);
    pos.setFromMatrixPosition(m);

    var x = pos.x + (spaseArr[3].rad*2 * Math.cos(spaseArr[3].angle));
    var z = pos.z + (spaseArr[3].rad*2 * Math.sin(spaseArr[3].angle));
        
    m1.makeRotationY(moon.angle);
    m2.setPosition(new THREE.Vector3(x, 0, z));

    m.multiplyMatrices(m1, m2);
    m.multiplyMatrices(m, m1);

    moon.body.matrix = m;
    moon.body.matrixAutoUpdate = false;
}

// радиус, координата по x, текстура
function AddStar(rad, x, thistex, vel)
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

    //создание сферы и его размещение в сцене
    var sphere = new THREE.Mesh( geometry, material );
    var posSphere = new THREE.Vector3(x, 0, 0);
    sphere.position.copy(posSphere);
    scene.add(sphere);

    //создание объекта планеты
    var star = {
        body: sphere,
        posX: posSphere.x,
        angle: 0,
        velocity: vel
    };

    return star;
}

//отрисовка орбит
function DrawOrbit(planet)
{
    var lineGeometry = new THREE.Geometry();
    var vertArray = lineGeometry.vertices;

    for(var i = 0; i < 360; i++)
    {
        var x = planet.body.position.x*Math.cos(i/57);
        var z = planet.body.position.x*Math.sin(i/57);

        //начало сегмента линии
        vertArray.push(new THREE.Vector3(x, 0, z));
        //конец сегмента линии
        vertArray.push(new THREE.Vector3(x, 0, z));
    }

    var lineMaterial = new THREE.LineDashedMaterial({
        //параметры: цвет, размер черты, размер промежутка
        color: 0xff0000, dashSize: 20, gapSize: 20 });

    var line = new THREE.Line( lineGeometry, lineMaterial );
    line.computeLineDistances();
    scene.add(line);
}

//перемещение камеры
function LookAtPlanet(keyDown)
{
    if (keyDown == 0)
    {
        camera.position.set(0, 1398, -1398);
        camera.lookAt(new THREE.Vector3(0, 0.0, 0));
    }
    else if (keyDown == "M")
    {
        var m = new THREE.Matrix4();
        var pos = new THREE.Vector3(0, 0, 0);

        m.copyPosition(moon.body.matrix);
        pos.setFromMatrixPosition(m);

        var x = pos.x + (moon.rad*4 * Math.cos(-moon.angle * 2 + cameraAngle));
        var z = pos.z + (moon.rad*4 * Math.sin(-moon.angle * 2 + cameraAngle));
        
        camera.position.set(x, 0, z); 
        camera.lookAt(pos);
    }
    else
    {
        var m = new THREE.Matrix4();
        var pos = new THREE.Vector3(0, 0, 0);

        m.copyPosition(spaseArr[keyDown].body.matrix);
        pos.setFromMatrixPosition(m);

        var x = pos.x + (spaseArr[keyDown].rad*4 * Math.cos(-spaseArr[keyDown].angle * 2 + cameraAngle));
        var z = pos.z + (spaseArr[keyDown].rad*4 * Math.sin(-spaseArr[keyDown].angle * 2 + cameraAngle));
        
        camera.position.set(x, 0, z); 
        camera.lookAt(pos);
    }
}

//проверки нажатия клавиш
function CameraLookAt()
{
    for(var i = 0; i < spaseArr.length; i++)
    {
        if (keyboard.pressed(i.toString()))
        {
            switch(i)
            {
                // look at Solar System
                case 0:
                    keyDown = 0;
                    for (var i = 1; i < 9; i++)
                    {
                        spaseArr[i].nameSprt.visible = true;
                        infoArr[i-1].visible = false;
                    }
                    break;
                
                // look at Mercury    
                case 1:
                    keyDown = 1;
                    for (var i = 1; i < 9; i++)
                    {
                        spaseArr[i].nameSprt.visible = false;
                        infoArr[i-1].visible = false;
                        infoArr[keyDown-1].visible = true;
                    }
                    break;
                
                // look at Venus    
                case 2:
                    keyDown = 2;
                    for (var i = 1; i < 9; i++)
                    {
                        spaseArr[i].nameSprt.visible = false;
                        infoArr[i-1].visible = false;
                        infoArr[keyDown-1].visible = true;
                    }
                    break;

                // look at Earth    
                case 3:
                    keyDown = 3;
                    for (var i = 1; i < 9; i++)
                    {
                        spaseArr[i].nameSprt.visible = false;
                        infoArr[i-1].visible = false;
                        infoArr[keyDown-1].visible = true;
                    }
                    break;

                // look at Mars    
                case 4:
                    keyDown = 4;
                    for (var i = 1; i < 9; i++)
                    {
                        spaseArr[i].nameSprt.visible = false;
                        infoArr[i-1].visible = false;
                        infoArr[keyDown-1].visible = true;
                    }
                    break;

                // look at Jupiter    
                case 5:
                    keyDown = 5;
                    for (var i = 1; i < 9; i++)
                    {
                        spaseArr[i].nameSprt.visible = false;
                        infoArr[i-1].visible = false;
                        infoArr[keyDown-1].visible = true;
                    }
                    break;

                // look at Saturn    
                case 6:
                    keyDown = 6;
                    for (var i = 1; i < 9; i++)
                    {
                        spaseArr[i].nameSprt.visible = false;
                        infoArr[i-1].visible = false;
                        infoArr[keyDown-1].visible = true;
                    }
                    break;

                // look at Uranus    
                case 7:
                    keyDown = 7;
                    for (var i = 1; i < 9; i++)
                    {
                        spaseArr[i].nameSprt.visible = false;
                        infoArr[i-1].visible = false;
                        infoArr[keyDown-1].visible = true;
                    }
                    break;

                // look at Neptun    
                case 8:
                    keyDown = 8;
                    for (var i = 1; i < 9; i++)
                    {
                        spaseArr[i].nameSprt.visible = false;
                        infoArr[i-1].visible = false;
                        infoArr[keyDown-1].visible = true;
                    }
                    break;

                default: break;
            }
        }
    }

    if (keyboard.pressed("A"))
    {
        cameraAngle += 0.01;
    }
    
    if (keyboard.pressed("D"))
    {
        cameraAngle -= 0.01;
    }

    if (keyboard.pressed("M"))
    {
        keyDown = "M";
    }
}

//вращение Солнца
function StarRotation(star)
{
    //создание набора матриц
    var m = new THREE.Matrix4();
    var m1 = new THREE.Matrix4();
    var m2 = new THREE.Matrix4();
    star.angle += star.velocity * delta;

    //создание матрицы поворота (вокруг оси Y) в m1 и матрицы перемещения в m2 
    m1.makeRotationY(star.angle);
    m2.setPosition(new THREE.Vector3(star.posX, 0, 0));

    //запись результата перемножения m1 и m2 в m 
    m.multiplyMatrices(m1, m2);
    m.multiplyMatrices(m, m1);

    //установка m в качестве матрицы преобразований объекта object 
    star.body.matrix = m;
    star.body.matrixAutoUpdate = false;
}

function updateHUDSprites(sprite)
{
    // левый верхний угол экрана
    //sprite.position.set(width/2, height/2, 1);
    sprite.position.set(window.innerWidth/2, window.innerHeight/2, 1);
    console.log(sprite.position);
}

function AddSpriteName(planet, pos, rad)
{
    //загрузка текстуры спрайта
    var texture = loader.load("textures/names/" + planet + ".png");
    var material = new THREE.SpriteMaterial( { map: texture } );

    //создание спрайта
    var sprite = new THREE.Sprite(material);

    //центр и размер спрайта
    sprite.center.set(0.5, 1);

    scene.add(sprite);

    //console.log('add name' + ' ' + planet);

    return sprite;
}

function AddSpriteInfo(name)
{
    //загрузка текстуры спрайта
    var texture = loader.load("textures/info/" + name + ".png");
    var material = new THREE.SpriteMaterial( { map: texture } );

    //создание спрайта
    var sprite = new THREE.Sprite(material);
    //центр и размер спрайта
    sprite.center.set( 1, 1 );
    sprite.scale.set( 700, 250, 1 );
    //sprite.position.set(width/2, height/2, 1);
    sprite.position.set(window.innerWidth/2, window.innerHeight/2, 1);
    sprite.visible = false;

    sceneOrtho.add(sprite);
    //updateHUDSprites(sprite);
    //var width = window.innerWidth;
    //var height = window.innerHeight;
    console.log('add info ' + name);

    return sprite;
}