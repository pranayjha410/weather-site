const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[ data-searchWeather]");
const userContainer = document.querySelector(".weather-cotainer");
const grantAcessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAcessButton = document.querySelector("[data-grantAcess]");

let currTab = userTab; // by default
const API_KEY = "851f04246ad797fc84ed14eee7928ebe";
 currTab.classList.add("current-tab");

getfromSessionStorage();

 function switchTab(clickTab){
    if(clickTab != currTab)     //then switch
    {
        currTab.classList.remove("current-tab");        //remove from old tab
        currTab = clickTab;         //make required tab as current and add all css to it
        currTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //if search form is invisible then make it visible 
            userInfoContainer.classList.remove("active");
            grantAcessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //visible your weather
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //get the co-ordinate of your weather and save it 
            getfromSessionStorage();
           }
    }

 }

 userTab.addEventListener("click", () => {
    //switch the tab to search 
    switchTab(userTab);
 });

 searchTab.addEventListener("click", () => {
    switchTab(searchTab);
 });

 function getfromSessionStorage(){
   const localCoordinate = sessionStorage.getItem("user-coordinates");
   if(!localCoordinate){
      grantAcessContainer.classList.add("active");
   }
   else{
      const coordinates = JSON.parse(localCoordinate);
      fetchUserWeatherInfo (coordinates);
   }
 }

 async function fetchUserWeatherInfo(coordinates) {
   const {lat, lon} = coordinates;
   //make grantcontainer invisible
   grantAcessContainer.classList.remove("active");
   //make loader visible
   loadingScreen.classList.add("active");

   //api call
   try{
      const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

      const data = await result.json();

      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
   }
   catch(err)
   {
      loadingScreen.classList.remove("active");
      console.log("erro found",err);
   }
 }

 function renderWeatherInfo(weatherInfo) {
   const cityName = document.querySelector("[data-cityName]");
   const countryIcon = document.querySelector("[data-countryIcon]");
   const desc = document.querySelector("[data-weatherDesc]");
   const weatherIcon = document.querySelector("[ data-weatherIcon]");
   const temp = document.querySelector("[data-temp]");
   const windSpeed = document.querySelector("[data-windSpeed]");
   const humidity = document.querySelector("[data-humidity]");
   const cloudiness = document.querySelector("[data-cloudiness]");

   //fetch values from weatherInfo object and put it in UI elememnt
   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png` ;
   temp.innerText = `${weatherInfo?.main?.temp} ℃`;
   windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText =`${ weatherInfo?.main?.humidity} %`;
   cloudiness.innerText =`${ weatherInfo?.clouds?.all} %`;
 }

function getLocation(){
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Sorry, no position available.");
    }
}

function showPosition(position){
   const userCoordinate = {
      lat:  position.coords.latitude,
      lon: position.coords.longitude,
      
   }
   sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinate));
   
   // Fetch weather info immediately after getting coordinates
   fetchUserWeatherInfo(userCoordinate);
}


grantAcessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) =>{
   e.preventDefault();
   let cityName = searchInput.value;
   if(cityName === "")
      return;
   else{
      fetchSearchWeatherInfo(cityName);
   }
})

async function fetchSearchWeatherInfo(city){
   loadingScreen.classList.add("active");
   userInfoContainer.classList.remove("active");
   grantAcessContainer.classList.remove("active");

   try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
   }
   catch(err){
      console.log("error found",err);
   }
   
}