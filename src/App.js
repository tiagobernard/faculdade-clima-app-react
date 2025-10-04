import React, { useState } from 'react';
import './App.css';

function App() {
  // Define o componente funcional principal 'App' que será renderizado na aplicação.

  const api = {
    key: "449ec6b40e0ccecd58af621da8ffa443", // Nova chave API para autenticação.
    base: "https://api.openweathermap.org/data/2.5/" // URL base da API do OpenWeatherMap para consultas de clima.
  };

  const [query, setQuery] = useState('');
  // Declara o estado 'query' para armazenar o nome da cidade digitada pelo usuário, inicializado como string vazia.

  const [weather, setWeather] = useState({});
  // Declara o estado 'weather' para armazenar os dados de clima retornados pela API, inicializado como objeto vazio.

  const [error, setError] = useState(''); // Novo estado para armazenar mensagens de erro, inicializado como string vazia.

  const search = (evt) => {
    // Função 'search' que lida com o envio do formulário para buscar o clima.
    evt.preventDefault();
    // Previne o comportamento padrão de recarregar a página ao submeter o formulário.
    if (!query.trim()) {
      // Verifica se o campo 'query' está vazio ou contém apenas espaços após remoção de espaços extras.
      setError('Erro: O campo de cidade está vazio. Por favor, digite uma cidade.');
      setWeather({}); // Limpa os dados de clima anteriores para remover a interface anterior.
      return; // Interrompe a execução se o campo estiver vazio.
    }
    // Se o campo não estiver vazio, prossegue com a requisição.
    fetch(`${api.base}weather?q=${encodeURIComponent(query)}&lang=pt_br&units=metric&APPID=${api.key}`)
      // Faz uma requisição GET à API do OpenWeatherMap com os parâmetros: cidade, idioma (português), unidades métricas e chave API.
      .then(res => res.json())
      // Converte a resposta da API para formato JSON.
      .then(result => {
        // Processa o resultado da API.
        console.log('Resposta da API:', result); // Depuração: exibe a resposta no console para verificar dados.
        if (result.cod && result.cod !== 200) {
          // Verifica se a resposta contém um código de erro diferente de 200.
          let mensagemErro = '';
          switch (result.cod) {
            case 401:
              mensagemErro = 'Erro: Chave API inválida. Por favor, verifique sua chave ou gere uma nova.';
              break;
            default:
              mensagemErro = 'Erro: Cidade não encontrada. Verifique o nome digitado.';
          }
          setError(mensagemErro); // Define a mensagem de erro personalizada.
          setWeather({}); // Limpa o estado 'weather' para evitar renderização de dados inválidos.
        } else {
          setWeather(result); // Atualiza o estado 'weather' com os dados da API se a requisição for bem-sucedida.
          setError(''); // Limpa qualquer mensagem de erro anterior.
        }
        setQuery(''); // Limpa o campo de entrada após a busca.
      })
      .catch(error => console.error('Erro na API:', error));
    // Captura e exibe qualquer erro na requisição (ex.: problemas de rede).
  };

  const clearAll = () => {
    // Função 'clearAll' que redefinir todos os estados para o estado inicial da aplicação.
    setWeather({}); // Limpa os dados de clima.
    setError(''); // Limpa a mensagem de erro.
    setQuery(''); // Limpa o campo de entrada.
  };

  const dateBuilder = (d) => {
    // Função 'dateBuilder' que formata a data atual em português.
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    // Array com os nomes dos meses em português.
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    // Array com os nomes dos dias da semana em português.

    let day = days[d.getDay()];
    // Obtém o dia da semana com base no índice retornado por getDay() (0-6).
    let date = d.getDate();
    // Obtém o dia do mês (1-31).
    let month = months[d.getMonth()];
    // Obtém o mês com base no índice retornado por getMonth() (0-11).
    let year = d.getFullYear();
    // Obtém o ano completo (ex.: 2025).

    return `${day}, ${date} de ${month} de ${year}`;
    // Retorna a data formatada como string (ex.: "Quarta 1 Outubro 2025").
  };

  return (
    // Renderiza o elemento principal da aplicação com uma classe dinâmica baseada na temperatura ou estado.
    // Aplica 'app gray' se não houver 'weather.main' ou se houver erro; caso contrário, aplica 'app warm' ou 'app cold' se houver dados.
    <div className={
      (typeof weather.main === "undefined" || error)
        ? 'app gray'
        : (typeof weather.main !== "undefined")
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
        {error && <div className="error-message">{error}</div>}
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
        {(typeof weather.main !== "undefined" || error) && (
          <button onClick={clearAll} className="clear-button">Limpar Tudo</button>
        )}
      </main>
    </div>
  );
}
export default App;