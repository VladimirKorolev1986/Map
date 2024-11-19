function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Сохраняем в LocalStorage
    localStorage.setItem('latitude', latitude.toString());  
    localStorage.setItem('longitude', longitude.toString());

    createMap(latitude, longitude)
}

function error() {
    alert("Не удалось получить Ваше местоположение!")
}


let lat = localStorage.getItem('latitude');
        let lng = localStorage.getItem('longitude');

        if (lat && lng) {
            // Если есть данные, создаем карту сразу с ними
            createMap(parseFloat(lat), parseFloat(lng));
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                console.log('Ваш браузер не поддерживает геолокацию.');
            }
        }



function createMap(lat, log) {
    ymaps.ready(init);

    function init() {
        var myMap = new ymaps.Map('map', {
            center: [lat, log],
            zoom: 12,
            controls: ['zoomControl']
        });

        var myPlacemark = new ymaps.Placemark([lat, log], {}, {
            preset: 'islands#blueDotIcon'
        })
        myMap.geoObjects.add(myPlacemark);
    }
}