// Массив для хранения информации о маркерах
let markersData = [];

// Функция для получения текущих координат
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Создаем карту с центром на полученных координатах
            createMap(latitude, longitude);
        }, function(error) {
            alert('Не удалось получить ваше местоположение.');
        });
    } else {
        console.log("Ваш браузер не поддерживает Geolocation.");
    }
}

// Функция для создания карты
function createMap(lat, lng) {
    ymaps.ready(function () {
        var myMap = new ymaps.Map('map', {
            center: [lat, lng],
            zoom: 10,
            controls: ['zoomControl']
        });

        // Восстанавливаем маркеры из localStorage
        restoreMarkersFromLocalStorage(myMap);

        // Обрабатываем клик по карте для добавления нового маркера
        myMap.events.add('click', function(e) {
            var coords = e.get('coords');

            // Создаем новый маркер
            var marker = new ymaps.Placemark(coords, {
                hintContent: 'Нажмите, чтобы открыть балун',
                balloonContent: '<strong>Маркер</strong><br/>Координаты: ' + coords.join(', ')
            }, {
                preset: 'islands#blueDotIcon'
            });

            // Добавляем маркер на карту
            myMap.geoObjects.add(marker);

            // Привязываем событие открытия балуна при клике на маркер
            marker.events.add('click', function() {
                this.balloon.open();
            });

            // Сохраняем информацию о новом маркере в массив
            markersData.push({ lat: coords[0].toFixed(6), lng: coords[1].toFixed(6) });

            // Сохраняем маркеры в localStorage
            saveMarkersToLocalStorage();
        });
    });
}

// Функция для сохранения маркеров в localStorage
function saveMarkersToLocalStorage() {
    localStorage.setItem('markers', JSON.stringify(markersData));
}

// Функция для восстановления маркеров из localStorage
function restoreMarkersFromLocalStorage(map) {
    // Читаем данные из localStorage
    var storedMarkers = localStorage.getItem('markers');

    if (storedMarkers) {
        try {
            markersData = JSON.parse(storedMarkers);

            for (var i = 0; i < markersData.length; i++) {
                var marker = new ymaps.Placemark(
                    [markersData[i].lat, markersData[i].lng],
                    {
                        hintContent: 'Нажмите, чтобы открыть балун',
                        balloonContent: '<strong>Восстановленный маркер</strong>'
                    },
                    { preset: 'islands#blueDotIcon' }
                );

                // Привязываем открытие балуна к восстановленным маркерам
                marker.events.add('click', function() {
                    this.balloon.open();
                });

                map.geoObjects.add(marker);
            }
        } catch (e) {
            console.error('Ошибка при восстановлении маркеров:', e);
        }
    }
}

// Проверим, есть ли данные о предыдущих координатах в localStorage
let lat = localStorage.getItem('latitude');
let lng = localStorage.getItem('longitude');

if (lat && lng) {
    // Если есть данные, создаем карту сразу с ними
    createMap(parseFloat(lat), parseFloat(lng));
} else {
    getUserLocation(); // Иначе запрашиваем текущие координаты
}