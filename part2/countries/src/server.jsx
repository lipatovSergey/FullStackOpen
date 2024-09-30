import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const getAll = () => {
  const request = axios.get(`${baseUrl}/api/all`)
  return request.then((response) => response.data)
}

const fetchWeatherData = (capital) => {
  const apiKey = import.meta.env.VITE_WEATHER_API
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`

  const request = axios.get(weatherUrl)
  return request.then((response) => response.data)
}

export default { getAll, fetchWeatherData }
