# OPTG_Lab2

Визуализировать упрощённую модель солнечной системы, которая будет включать:

* звёздное небо
* солнце
* меркурий
* венеру
* землю и луну
* марс 
* остальные планеты

Звёздное небо - сфера, внутри которой будет всё происходить.
Солнце - находится в ценрте звёздного неба.
Орбиты всех планет происходит по окружности, в кач-ве центра - центр звёздного неба.
Спутники вращаются вокруг своих планет, в кач-ве центра вращения - центр планеты.

Расстояния между планетами, их скорость вращения вокруг собственной оси и солнца должны отражать реальные отношения размеров, расстояний и скоростей (Марс меньше Земли,Меркурий меньше Марса и т.д.).

Реализовать режим слежения за планетой для камеры. По нажатию на клавиши 1 – 4, фокус камеры должен смещаться вслед за позицией соответствующей номеру планеты. По нажатию кнопки 0, должен включаться “общий” вид на модель. По нажатию “стрелок”, камера должна поворачиваться вокруг планеты.

Радиус тел делим на 10.000 и округляем до ближайшего целого значения
    Солнце 696340 -> 70
    Меркурий 2439 -> 0.24
    Венера 6052 -> 0.61
    Земля 6378 -> 0.63
    Марс
    Юпитер
    Сатурн
    Нептун
    Плутон