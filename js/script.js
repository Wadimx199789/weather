const link =
  "http://api.weatherstack.com/current?access_key=9310f0a0db73a35d55566bb15a1330cc";

const root = document.getElementById("root");
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const close = document.querySelector(".close")


let store = {
    city:"Minsk",
    feelslike:0,
    temperature:0,
    isDay:"yes",
    humidity:0,
    observationTime:"00:00 AM",
    description:"",
    properties:{
        uvIndex:{},
        cloudcover:{}, 
        humidity:{},
        windSpeed:{}, 
        pressure:{},
        visibility:{},
    }

}
const fetchData = async ()=>{
    const result = await fetch(`${link}&query=${store.city}`);
    try{
        const data = await result.json();
    console.log(data);
    const {current:{visibility,wind_speed:windSpeed,temperature,cloudcover,feelslike,humidity,pressure,observation_time:observationTime,weather_descriptions:description,is_day:isDay,uv_index:uvIndex}} = data;
    store = {
        ...store,
        temperature,
        isDay,
        feelslike,
        humidity,
        observationTime,
        description:description[0],
        properties:{
            uvIndex:{
                title:'uv Index',
                value:`${uvIndex}%`,
                icon:"uv-index.png",
            },
            cloudcover:{
                title:'cloudcover',
                value:`${ cloudcover}%`,
                icon:"cloud.png"
            }, 
            humidity: {
                title:'humidity',
                value:`${humidity}%`,
                icon:"humidity.png"
            },
            windSpeed:{
                title:'wind speed',
                value:`${windSpeed}%`,
                icon:"wind.png"
            }, 
            pressure:{
                title:'pressure',
               value: `${pressure} %`,
               icon:"gauge.png"
            },
            visibility:{
                title:'visibility',
                value:`${visibility} %`,
                icon:"visibility.png"
            },
        }

    }
    console.log(store);
    renderComponent();
    city.addEventListener("click",hendleClick);
    }
    catch(err){
        console.log(err);
    }
}
const getImage = (description) =>{
    const value = description.toLowerCase();
    // if(description ==="Partly cloudy") return 'partly.png'
    switch(value){
        case "partly cloudy":return 'partly.png';
        case "cloud":return "cloud.png";
        case "fog":return "fog.png";
        case "sunny":return "sunny.png";
        default:return "the.png";
    }
}
const markup = () => {
   
    const {city,description,observationTime,temperature,isDay,properties} = store;
    const containerClass = isDay ==='yes'?'is-day':""
    return `<div class="container">
              <div class="top ${containerClass}">
                <div class="city">
                  <div class="city-subtitle">Weather Today in</div>
                    <div class="city-title" id="city">
                    <span>${city}</span>
                  </div>
                </div>
                <div class="city-info">
                  <div class="top-left">
                  <img class="icon" src="./img/${getImage(description)}" alt="" />
                  <div class="description">${description}</div>
                </div>
              
                <div class="top-right">
                  <div class="city-info__subtitle">as of ${observationTime}</div>
                  <div class="city-info__title">${temperature}°</div>
                </div>
              </div>
            </div>
          <div id="properties">${renderProperty(properties)}</div>
        </div>`;
  };
  const renderProperty = (properties) => {
      console.log(properties)
    return Object.values(properties)
      .map(({ title, value, icon }) => {
        return `<div class="property">
              <div class="property-icon">
                <img src="./img/icons/${icon}" alt="">
              </div>
              <div class="property-info">
                <div class="property-info__value">${value}</div>
                <div class="property-info__description">${title}</div>
              </div>
            </div>`;
      })
      .join("");
  };
  const renderComponent = ()=>{
      root.innerHTML = markup();
      const city=document.getElementById("city");
      city.addEventListener("click",toggleClass)
  }

const toggleClass = () =>{
    popup.classList.toggle("active");
}
const handleInput = () =>{
    store={
        ...store,
        city:textInput.value,
    }
}
const handleSubmit = (e)=>{
    e.preventDefault();
    handleInput();
    fetchData();
    toggleClass();
    
}
close.addEventListener("click",handleSubmit)
fetchData();