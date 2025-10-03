import React, { useState } from 'react';
import './App.css';

function App() { // Define o componente funcional principal 'App' que será renderizado na aplicação.

  const api = { // Dados da API
    key: "449ec6b40e0ccecd58af621da8ffa443",
    base: "https://api.openweathermap.org/data/2.5/"
  };

  const [query, setQuery] = useState(''); // Declara o estado 'query' para armazenar o nome da cidade digitada pelo usuário, inicializado como string vazia.
  const [weather, setWeather] = useState({}); // Declara o estado 'weather' para armazenar os dados de clima retornados pela API, inicializado como objeto vazio.

  const search = (evt) => { // Função 'search' que lida com o envio do formulário para buscar o clima.
    evt.preventDefault();
    if (query) {
      fetch(`${api.base}weather?q=${encodeURIComponent(query)}&lang=pt_br&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          console.log('Resposta da API:', result); // Depuração
          if (result.cod && result.cod !== 200) {
            console.error('Erro da API:', result.message);
          } else {
            setWeather(result);
            setQuery('');
          }
        })
        .catch(error => console.error('Erro na API:', error));
    }
  };

  const dateBuilder = (d) => { // Função 'dateBuilder' que formata a data atual em português.
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`; // Retorna a data formatada como string (ex.: "Sexta 3 Outubro 2025").
  };

  return ( // Renderiza o elemento principal da aplicação com uma classe dinâmica baseada na temperatura.
    <div className={
      (typeof weather.main !== "undefined")
        ? (weather.main.temp > 15 ? 'app warm' : 'app cold')
        : 'app'
    }>
      <main>
        <form onSubmit={search} className="search-form">
          <input
            type="text"
            className="search-bar"
            placeholder="Digite a cidade..."
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
          <button type="submit" className="search-button">Pesquisar</button>
        </form>
        {(typeof weather.main !== "undefined") ? (
          <div>
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="weather">{weather.weather[0].description}</div>
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Ícone do clima"
                className="weather-icon"
              />
            </div>
          </div>
        ) : ('')}
      </main>
    </div>
  );
}

export default App;