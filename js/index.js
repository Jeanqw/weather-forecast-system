const apiKey = '6d6e0b828048fa9addcc69d87912f5d9';
const cityInput = document.querySelector("#searchBar");
const temperatura = document.querySelector("#temp");
const nameCity = document.querySelector("#nameCity");
const weather = document.querySelector("#weather");
const tempMax = document.querySelector("#tempMax");
const tempMin = document.querySelector("#tempMin");
const vol1 = document.querySelector("#vol-1h");
const nebulosidade = document.querySelector("#nebulosidade");
const sensacao = document.querySelector("#sensacao");
const pressao = document.querySelector("#pressao");
const vento = document.querySelector("#vento");
const umidade = document.querySelector("#umidade");
const img_sun = document.querySelector("#img-sun");
const country_flag = document.querySelector("#country_flag");
const country_code = document.querySelector("#country_code");
const longitude = document.querySelector("#longitude");
const latitude = document.querySelector("#latitude");
const sea_level = document.querySelector("#sea_level");
const ground_level = document.querySelector("#ground_level");
const container_info_hide = document.querySelectorAll(".container-info-hide");
const menuMobile = document.querySelector(".mobile-menu-icon button");
const dropdown = document.querySelector(".dropdown-hide");

const principaisCidades = document.querySelector(".principaisCidades");

const paths = document.querySelectorAll('path');
const nameCountry = document.querySelector(".nameCountry");
const nameCountryDados = document.querySelector("#country");
const tempMedMapa = document.querySelector("#tempMedia-mapa span");
const valor_nebulosidade = document.querySelector("#valor_nebulosidade");
const valor_volume = document.querySelector("#valor_volume");
const valor_sensacao = document.querySelector("#valor_sensacao");




// FUNCOES

//funcao que pega os dados da API de clima
const getWeatherData = async (city) => {
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;


    const res = await fetch(apiWeatherURL); //guardando o resultado da api em uma const

    const data = await res.json(); //transformando no formato json

    return data; //retornando os dados em formato json
}

// ============= tela principal
const showWeatherData = async (city) => {
    const data = await getWeatherData(city);

    temperatura.innerHTML = parseInt(data.main.temp) + "° C";
    nameCity.innerHTML = data.name;
    weather.innerHTML = data.weather[0].description;
    tempMin.innerHTML = data.main.temp_min + "° C";
    tempMax.innerHTML = data.main.temp_max + "° C";

    if (data.rain != undefined) {
        vol1.innerHTML = data.rain["1h"] + "mm";
    } else {
        vol1.innerHTML = "0mm";
    }

    nebulosidade.innerHTML = data.clouds.all + "%";
    sensacao.innerHTML = data.main.feels_like + "° C";
    pressao.innerHTML = data.main.pressure + " hPa";
    vento.innerHTML = data.wind.speed + " km/h";
    umidade.innerHTML = data.main.humidity + " %";
    img_sun.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    country_flag.setAttribute("src", `https://countryflagsapi.netlify.app/flag/${data.sys.country}.svg`);
    country_code.innerHTML = data.sys.country;
    longitude.innerHTML = data.coord.lon;
    latitude.innerHTML = data.coord.lat;

    if (data.main["sea_level"] != undefined) {
        for (let i = 0; i < container_info_hide.length; i++) {
            container_info_hide[i].classList.remove("container-info-hide");
            container_info_hide[i].classList.add("container-info");

            sea_level.innerHTML = data.main.sea_level + " hPa";
            ground_level.innerHTML = data.main.grnd_level + " hPa";
        }
    } 
    else {
        for (let i = 0; i < container_info_hide.length; i++) {
            container_info_hide[i].classList.remove("container-info");
            container_info_hide[i].classList.add("container-info-hide");
        }
    }
}

//============= tela de cidades
const showCityData = async (city) => {
    const data = await getWeatherData(city);

    //=========== criando a estrutura html
    let link = document.createElement("a");
    let container = document.createElement("div");
    container.classList.add("city");//adicionando uma classe a div principal
    let h3 = document.createElement("h3");

    let container_country = document.createElement("div");
    let img = document.createElement("img");
    let p = document.createElement("p");

    let container_temp = document.createElement("div");
    let min = document.createElement("span");
    let max = document.createElement("span");
    let separator = document.createElement("span");

    container.appendChild(h3);

    container_country.appendChild(img);
    container_country.appendChild(p);

    container_temp.appendChild(min);
    container_temp.appendChild(separator);
    container_temp.appendChild(max);

    container.appendChild(container_country);
    container.appendChild(container_temp);

    //========== jogando os resultados da API no html
    h3.innerHTML = data.name;

    img.setAttribute("src", `https://countryflagsapi.netlify.app/flag/${data.sys.country}.svg`)
    p.innerHTML = data.sys.country;

    min.innerHTML = parseInt(data.main.temp_min) + "°";
    max.innerHTML = parseInt(data.main.temp_max) + "°";
    separator.innerHTML = "/";

    //terminando a estrutura html
    link.appendChild(container);
    link.setAttribute("href", "index.html")
    principaisCidades.appendChild(link)

    //guardando o nome da cidade em uma sessao quando houver um click 
    link.addEventListener("click", () => {
        sessionStorage.setItem("city", data.name);
    })
}
//se tiver alguma coisa na sessao city, irá pesquisar e logo apos limpar o cache
if (sessionStorage.getItem("city") != undefined) {
    cityInput.value = sessionStorage.getItem("city");
    const city = cityInput.value;
    if (city != "") {
        showWeatherData(city);
    }
    sessionStorage.clear();
}

// chamando a função showCityData
if (principaisCidades != undefined) {
    showCityData("moscou");
    showCityData("sao paulo");
    showCityData("munique");
    showCityData("manchester");
    showCityData("new york");
}


// ================ tela do mapa

//funcao para transformar o nome do pais em seu codigo
const getCountryCode = async (city) =>{
    const data = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=5af116f7d592468bbb13694754786c92&q=${city}`);
   
    const dataCountry = await data.json(); 

    const countryCodeMap = dataCountry.results[0].components["ISO_3166-1_alpha-2"];
    const countryName = dataCountry.results[0].components["country"];

    showMapData(countryCodeMap, countryName);
    
}

//funcao para mostrar os valores na tela do mapa
const showMapData = async (countryCodeMap, countryName) => {
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=,${countryCodeMap}&units=metric&appid=${apiKey}&lang=pt_br`;


    const res = await fetch(apiWeatherURL); //guardando o resultado da api em uma const

    const data = await res.json(); //transformando no formato json

    nameCountryDados.innerHTML = countryName;

    tempMedMapa.innerHTML = data.main.temp + "° C";

    valor_nebulosidade.innerHTML = data.clouds.all + "%";
    valor_sensacao.innerHTML = data.main.feels_like + "°C";

    if (data.rain != undefined) {
        valor_volume.innerHTML = data.rain["1h"] + "mm";
    } else {
        valor_volume.innerHTML = "0mm";
    }

}



//==========================EVENTOS

// ================= tela principal

//keyup na pesquisa de cidades
if (cityInput != undefined) {

    cityInput.addEventListener('keyup', (e) => {
        if (e.key === "Enter") {
            const city = cityInput.value;
            if (city != "") {
                showWeatherData(city);
            }
        }
    })

}

// =============responsividade 
//click para abrir o menu dropdown (mobile)
menuMobile.addEventListener('click', () => {
    dropdown.classList.toggle("dropdown")
})


// ================ tela do mapa

if(paths[0] != undefined){ //condicao para rodar esse script apenas na tela de mapas
    
//evento para mostrar o nome do país do mapa no nameCountry (espaco acima da seta q indica o nome do pais)
paths.forEach((el) =>
    el.addEventListener('mouseover', (event) => {
        event.target.className = ("enabled");
        nameCountry.classList.add("active");

        if (event.target.id == "") {
            nameCountry.innerHTML = event.target.getAttribute("class");
        } else {
            nameCountry.innerHTML = event.target.getAttribute("name");
        }
    }));

    paths.forEach((el) =>
    el.addEventListener("mouseout", () => {
        nameCountry.classList.remove("active");
    })
);

//colocando o nameCountry acima da seta do mouse
document.onmousemove = function (e) {
    nameCountry.style.left = e.pageX + "px";
    nameCountry.style.top = (e.pageY - 70) + "px";
}

//quando houver o click em uma parte do mapa, ira pegar o nome do do pais
paths.forEach((el) =>
    el.addEventListener('click', (event) => {
        if (event.target.id == "") {
            city = event.target.getAttribute("class");
        } else {
            city = event.target.getAttribute("name");
        }

        getCountryCode(city)

    }));
}


