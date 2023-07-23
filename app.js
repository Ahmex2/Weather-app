$(document).ready(function () {

    const API_KEY = 'f7dadc25af794351a7b162844232307';

    const searchInput = $('#search-input');
    const searchButton = $('#search-btn');
    const notFound = $('.not-found');
    const weatherBox = $('.weather-box');
    const weatherIcon = $('#weather-icon');
    const temperature = $('#temperature');
    const description = $('#description');
    const humidity = $('#humidity');
    const windSpeed = $('#wind-speed');
    const forecast = $('#forecast');
    const forecastList = $('#forecast-list');

    searchButton.on('click', function () {
        const location = searchInput.val().trim();
        if (location !== '') {
            getWeatherData(location);
        }
    });

    searchInput.on('keyup', function (event) {
        if (event.key === 'Enter') {
            const location = searchInput.val().trim();
            if (location !== '') {
                getWeatherData(location);
            }
        }
    });

    function getWeatherData(location) {
        showLoadingIndicator();

        $.ajax({
            url: `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`,
            dataType: 'json',
            success: function (data) {
                hideLoadingIndicator();

                if (data.error) {
                    showNotFound();
                    return;
                }

                updateWeatherData(data);

                $.ajax({
                    url: `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=5&aqi=no&alerts=no`,
                    dataType: 'json',
                    success: function (data) {
                        updateForecastData(data);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    function showLoadingIndicator() {
        weatherBox.addClass('hidden');
        notFound.addClass('hidden');
        forecast.addClass('hidden');
        $('.loader').removeClass('hidden');
    }

    function hideLoadingIndicator() {
        $('.loader').addClass('hidden');
    }

    function showNotFound() {
        notFound.removeClass('hidden');
    }

    function updateWeatherData(data) {
        const weather = data.current.condition;
        weatherIcon.attr('src', `https:${weather.icon}`);
        temperature.text(`${data.current.temp_c}°C`);
        description.text(weather.text);
        humidity.text(`${data.current.humidity}%`);
        windSpeed.text(`${data.current.wind_kph} km/h`);
        weatherBox.removeClass('hidden');
    }

    function updateForecastData(data) {
        forecastList.empty();
        data.forecast.forecastday.forEach(function (forecastData) {
            const forecastItem = createForecastItem(forecastData);
            forecastList.append(forecastItem);
        });

        forecast.removeClass('hidden');
    }

    function createForecastItem(forecastData) {
        const forecastItem = $('<li></li>');
        const date = new Date(forecastData.date);
        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
        const time = date.toLocaleString('en-US', { hour: 'numeric', hour12: true });
        const temperature = forecastData.day.avgtemp_c;
        const icon = $('<img>').attr('src', `https:${forecastData.day.condition.icon}`);
        const description = forecastData.day.condition.text;
        const forecastContent = `<span>${dayOfWeek} ${time}</span>
                                 <span>${temperature}°C</span>
                                 <span>${description}</span>`;
        forecastItem.html(icon).append(forecastContent);
        return forecastItem;
    }

});