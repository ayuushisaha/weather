const apiKey = 'api_key';

const countries = {
  IN: "India", US: "United States", GB: "United Kingdom", FR: "France", DE: "Germany",
  CN: "China", JP: "Japan", BR: "Brazil", RU: "Russia", AU: "Australia",
  CA: "Canada", IT: "Italy", ES: "Spain", MX: "Mexico", ID: "Indonesia",
  SA: "Saudi Arabia", KR: "South Korea", ZA: "South Africa", AE: "United Arab Emirates",
  NL: "Netherlands", CH: "Switzerland", SE: "Sweden", NG: "Nigeria"
};

function getLocalTime(offsetSec) {
  const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
  const localTime = new Date(utc + offsetSec * 1000);
  return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return;

  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await res.json();

  const { main, weather, wind, sys, name, timezone } = data;

  document.getElementById('heroLoc').textContent = name;
  document.getElementById('heroTemp').textContent = `${Math.round(main.temp)}°C`;
  document.getElementById('heroDesc').textContent = weather[0].main + ' - ' + weather[0].description;
  document.getElementById('heroTime').textContent = getLocalTime(timezone);

  document.getElementById('todayTemp').textContent = `${main.temp}°C`;
  document.getElementById('todayHumidity').textContent = `${main.humidity}%`;
  document.getElementById('todayWind').textContent = `${wind.speed} m/s`;
  document.getElementById('todayCountry').textContent = countries[sys.country] || sys.country;

  updateBackground(weather[0].main.toLowerCase(), timezone);
  populateHourly(main.temp, timezone);
  populateFakeForecast(main.temp);
}

function updateBackground(condition, offsetSec) {
  const utc = Date.now() + (new Date().getTimezoneOffset() * 60000);
  const localHour = new Date(utc + offsetSec * 1000).getHours();
  const isDay = localHour >= 6 && localHour <= 18;

  const bg = document.getElementById('background-animation');
  let bgColor = isDay ? '#fddb92' : '#274046';

  if (condition.includes('cloud')) bgColor = isDay ? '#bdc3c7' : '#2c3e50';
  if (condition.includes('rain')) bgColor = '#3a6073';
  if (condition.includes('snow')) bgColor = '#e6dada';
  if (condition.includes('clear')) bgColor = isDay ? '#ffe259' : '#2c3e50';

  bg.style.background = `linear-gradient(to top, ${bgColor}, #000)`;
}

function populateHourly(baseTemp, offsetSec) {
  const utc = Date.now() + (new Date().getTimezoneOffset() * 60000);
  const hourlyEl = document.getElementById('hourlyScroll');
  hourlyEl.innerHTML = '<h3>Hourly Forecast</h3>';

  for (let i = 1; i <= 6; i++) {
    const date = new Date(utc + offsetSec * 1000 + i * 3600000);
    const hour = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const temp = Math.round(baseTemp + (Math.random() * 4 - 2));

    const block = document.createElement('div');
    block.className = 'hour-block';
    block.innerHTML = `<p>${hour}</p><p>${temp}°</p>`;
    hourlyEl.appendChild(block);
  }
}

function populateFakeForecast(baseTemp) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyEl = document.getElementById('dailyList');
  dailyEl.innerHTML = '';

  for (let i = 1; i <= 7; i++) {
    const date = new Date(Date.now() + i * 86400000);
    const hi = Math.round(baseTemp + Math.random() * 5);
    const lo = Math.round(baseTemp - Math.random() * 5);

    const dayBlock = document.createElement('div');
    dayBlock.className = 'day-block';
    dayBlock.innerHTML = `
      <div class="day-label">${days[date.getDay()]}</div>
      <div class="day-info">High: ${hi}°C / Low: ${lo}°C</div>
    `;
    dailyEl.appendChild(dayBlock);
  }
}


const fallbackPosts = [
  {
    title: "Sometimes we must act or choose the best way to avoid problems",
    body: "We take on responsibilities, respond to challenges quickly, and handle issues with care. What we build is thoughtful and well-crafted."
  },
  {
    title: "Who is this person?",
    body: "This is someone living in the moment, not seeking anything fake or painful. They avoid trouble and handle problems directly. They’re honest and capable, with nothing to hide."
  },
  {
    title: "Avoiding trouble is nearly an exercise in itself",
    body: "Doing what’s right takes effort, and choosing wisely matters. We protect others from harm, even when work feels painful or unfair."
  },
  {
    title: "He faces what others avoid",
    body: "Even when rejected, he accepts responsibility without blaming others. He knows what’s right, and he does it without expecting rewards."
  },
  {
    title: "Some people fear what they don’t understand",
    body: "They reject ideas out of fear. They avoid things that seem unfamiliar. But even difficult truths are worth facing. Pain comes not from knowledge, but from ignoring it."
  }
];

async function loadSamplePosts() {
  const postsList = document.getElementById('postsList');
  postsList.innerHTML = '<h3>Sample Posts</h3>';

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    if (!res.ok) throw new Error('API error');
    const posts = await res.json();

    posts.forEach((post, index) => {
      const translated = fallbackPosts[index];
      const div = document.createElement('div');
      div.className = 'post-block';
      div.innerHTML = `
        <h4>${translated.title}</h4>
        <p>${translated.body}</p>
      `;
      postsList.appendChild(div);
    });
  } catch (error) {
    console.error('Failed to fetch posts, using fallback:', error);
    fallbackPosts.forEach(post => {
      const div = document.createElement('div');
      div.className = 'post-block';
      div.innerHTML = `
        <h4>${post.title}</h4>
        <p>${post.body}</p>
      `;
      postsList.appendChild(div);
    });
  }
}

window.addEventListener('DOMContentLoaded', loadSamplePosts);
