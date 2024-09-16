import { useEffect, useState } from 'react'
import server from './server'

const getCountryInf = (country, weatherData) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} style={{ width: '100px', height: '100px' }} />
      {weatherData ? (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Weather icon" />
        </div>
      ) : (
        <p>Loading weather information...</p>
      )}
    </div>
  )
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    server.getAll().then((countries) => setCountries(countries))
  }, [])

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value)
  }

  const foundCountries =
    searchQuery && countries.filter((country) => country.name.common.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    setSelectedCountry(null)
    setWeatherData(null)
  }, [searchQuery])

  useEffect(() => {
    if (foundCountries && foundCountries.length === 1) {
      setSelectedCountry(foundCountries[0])
    }
  }, [foundCountries])

  useEffect(() => {
    if (selectedCountry) {
      server
        .fetchWeatherData(selectedCountry.capital[0])
        .then((data) => setWeatherData(data))
        .catch((error) => console.error('Error fetching weather data', error))
    }
  }, [selectedCountry])

  const renderCountries = () => {
    if (!foundCountries) return null
    if (foundCountries.length === 1) {
      return null // Отображение происходит через selectedCountry
    }
    if (foundCountries.length <= 10) {
      return foundCountries.map((country) => (
        <p key={country.cca3}>
          {country.name.common}{' '}
          <button
            onClick={() => {
              setSelectedCountry(country)
              setWeatherData(null)
            }}
          >
            show
          </button>
        </p>
      ))
    }
    return <p>Too many matches, please narrow your search</p>
  }

  return (
    <>
      <input onChange={handleSearchInput} value={searchQuery} />
      {renderCountries()}
      {selectedCountry && getCountryInf(selectedCountry, weatherData)}
    </>
  )
}

export default App
