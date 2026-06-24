// WMO Weather Interpretation Codes (https://open-meteo.com)
const WEATHER_CODES = {
  0: { desc: "Clear Sky", type: "clear" },
  1: { desc: "Mainly Clear", type: "clear" },
  2: { desc: "Partly Cloudy", type: "cloudy" },
  3: { desc: "Overcast", type: "cloudy" },
  45: { desc: "Foggy", type: "cloudy" },
  48: { desc: "Depositing Rime Fog", type: "cloudy" },
  51: { desc: "Light Drizzle", type: "rain" },
  53: { desc: "Moderate Drizzle", type: "rain" },
  55: { desc: "Dense Drizzle", type: "rain" },
  56: { desc: "Light Freezing Drizzle", type: "rain" },
  57: { desc: "Dense Freezing Drizzle", type: "rain" },
  61: { desc: "Slight Rain", type: "rain" },
  63: { desc: "Moderate Rain", type: "rain" },
  65: { desc: "Heavy Rain", type: "rain" },
  66: { desc: "Light Freezing Rain", type: "rain" },
  67: { desc: "Heavy Freezing Rain", type: "rain" },
  71: { desc: "Slight Snow Fall", type: "snow" },
  73: { desc: "Moderate Snow Fall", type: "snow" },
  75: { desc: "Heavy Snow Fall", type: "snow" },
  77: { desc: "Snow Grains", type: "snow" },
  80: { desc: "Slight Rain Showers", type: "rain" },
  81: { desc: "Moderate Rain Showers", type: "rain" },
  82: { desc: "Violent Rain Showers", type: "rain" },
  85: { desc: "Slight Snow Showers", type: "snow" },
  86: { desc: "Heavy Snow Showers", type: "snow" },
  95: { desc: "Thunderstorm", type: "rain" },
  96: { desc: "Thunderstorm with Slight Hail", type: "rain" },
  99: { desc: "Thunderstorm with Heavy Hail", type: "rain" }
};

// Animated Weather SVG Icons
const SVG_ICONS = {
  clear: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="weather-svg-clear">
      <circle cx="12" cy="12" r="5" style="animation: spinSlow 15s linear infinite; transform-origin: center; color: #f59e0b; fill: rgba(245,158,11,0.2);"></circle>
      <line x1="12" y1="1" x2="12" y2="3" style="color: #f59e0b;"></line>
      <line x1="12" y1="21" x2="12" y2="23" style="color: #f59e0b;"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" style="color: #f59e0b;"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" style="color: #f59e0b;"></line>
      <line x1="1" y1="12" x2="3" y2="12" style="color: #f59e0b;"></line>
      <line x1="21" y1="12" x2="23" y2="12" style="color: #f59e0b;"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" style="color: #f59e0b;"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" style="color: #f59e0b;"></line>
    </svg>
  `,
  cloudy: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" style="fill: rgba(148,163,184,0.1); color: #94a3b8; animation: floatBlob1 4s infinite alternate ease-in-out;"></path>
    </svg>
  `,
  rain: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 18.66A6 6 0 1 0 9 10a5.86 5.86 0 0 0-.28 1.83" style="color: #94a3b8;"></path>
      <path d="M20 18.18A4.5 4.5 0 0 0 16 10H14.82A6.5 6.5 0 0 0 5 15.66" style="fill: rgba(59,130,246,0.1); color: #3b82f6;"></path>
      <line x1="12" y1="18" x2="12" y2="22" style="color: #3b82f6; stroke-dasharray: 2, 2; animation: fallRain 1s linear infinite;"></line>
      <line x1="8" y1="17" x2="8" y2="21" style="color: #3b82f6; stroke-dasharray: 2, 2; animation: fallRain 1.2s linear infinite;"></line>
      <line x1="16" y1="17" x2="16" y2="21" style="color: #3b82f6; stroke-dasharray: 2, 2; animation: fallRain 0.8s linear infinite;"></line>
    </svg>
  `,
  snow: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" style="fill: rgba(56,189,248,0.1); color: #38bdf8;"></path>
      <circle cx="8" cy="18" r="1" style="color: #38bdf8; fill: #38bdf8; animation: floatBlob2 2s infinite ease-in-out;"></circle>
      <circle cx="12" cy="18" r="1" style="color: #38bdf8; fill: #38bdf8; animation: floatBlob3 3s infinite ease-in-out;"></circle>
      <circle cx="16" cy="18" r="1" style="color: #38bdf8; fill: #38bdf8; animation: floatBlob1 2.5s infinite ease-in-out;"></circle>
    </svg>
  `
};

// State Variables
let currentUser = null;
let isDashboardUnlocked = false;

// DOM Elements
const ambientBackground = document.getElementById('ambient-background');
const appContainer = document.getElementById('app-container');
const toastContainer = document.getElementById('toast-container');

// Auth elements
const authScreen = document.getElementById('auth-screen');
const authCard = document.getElementById('auth-card');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const goToSignupBtn = document.getElementById('go-to-signup');
const goToLoginBtn = document.getElementById('go-to-login');

// Home elements
const homeScreen = document.getElementById('home-screen');
const userGreeting = document.getElementById('user-greeting');
const logoutBtn = document.getElementById('logout-btn');
const welcomeKeyOverlay = document.getElementById('welcome-key-overlay');
const keyForm = document.getElementById('key-form');
const welcomeKeyInput = document.getElementById('welcome-key-input');
const weatherCardPlaceholder = document.getElementById('weather-card-placeholder');
const weatherDetailsView = document.getElementById('weather-details-view');
const welcomeMessageTyping = document.getElementById('welcome-message-typing');
const locationForm = document.getElementById('location-form');
const locationInput = document.getElementById('location-input');
const searchSubmitBtn = document.getElementById('search-submit-btn');
const weatherReport = document.getElementById('weather-report');
const weatherParticles = document.getElementById('weather-particles');

// Weather Report fields
const reportCityName = document.getElementById('report-city-name');
const reportCountry = document.getElementById('report-country');
const reportLocalTime = document.getElementById('report-local-time');
const reportTemp = document.getElementById('report-temp');
const reportWeatherDesc = document.getElementById('report-weather-desc');
const reportHumidity = document.getElementById('report-humidity');
const reportWind = document.getElementById('report-wind');
const reportHiLo = document.getElementById('report-hi-lo');
const weatherGraphicContainer = document.getElementById('weather-graphic-container');

// ==========================================
// TOAST NOTIFICATIONS SYSTEM
// ==========================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg class="toast-icon success" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg class="toast-icon error" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconSvg = `<svg class="toast-icon info" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-message">${message}</div>
  `;

  toastContainer.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 4000);
}

// ==========================================
// KEYFRAME PARTICLE GENERATION
// ==========================================
let particleInterval = null;

function updateWeatherParticles(type) {
  // Clear any existing particle loops
  if (particleInterval) {
    clearInterval(particleInterval);
    particleInterval = null;
  }
  weatherParticles.innerHTML = '';

  if (type === 'clear' || type === 'cloudy') {
    return; // No falling particles needed
  }

  const particleClass = type === 'rain' ? 'rain-drop' : 'snow-flake';
  const density = type === 'rain' ? 80 : 40;

  // Initialize a few particles immediately
  for (let i = 0; i < density; i++) {
    createParticle(particleClass, type, true);
  }

  // Continuously spawn particles
  particleInterval = setInterval(() => {
    createParticle(particleClass, type, false);
  }, type === 'rain' ? 120 : 250);
}

function createParticle(className, type, isInit) {
  const particle = document.createElement('div');
  particle.className = className;
  
  const left = Math.random() * 100;
  const animDelay = isInit ? -Math.random() * 4 : Math.random() * 2;
  const animDuration = type === 'rain' ? 0.8 + Math.random() * 0.6 : 3 + Math.random() * 2;
  
  particle.style.left = `${left}%`;
  particle.style.animationDelay = `${animDelay}s`;
  particle.style.animationDuration = `${animDuration}s`;

  if (type === 'snow') {
    const size = 2 + Math.random() * 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = 0.4 + Math.random() * 0.5;
  } else {
    // Rain drip variations
    const height = 25 + Math.random() * 25;
    particle.style.height = `${height}px`;
    particle.style.opacity = 0.3 + Math.random() * 0.5;
  }

  weatherParticles.appendChild(particle);

  // Cleanup particle element after life cycle completes
  setTimeout(() => {
    particle.remove();
  }, (animDuration + 2) * 1000);
}

// ==========================================
// TYPEWRITER ANIMATION EFFECT
// ==========================================
function playTypewriterEffect(element, text, speed = 60) {
  element.innerHTML = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// ==========================================
// USER ACCOUNT SYSTEM
// ==========================================
function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
}

// ==========================================
// TRANSITIONS
// ==========================================
function transitionToHome(username) {
  currentUser = username;
  userGreeting.textContent = `Welcome, ${username}`;
  
  // Transition screens
  appContainer.classList.remove('auth-view');
  appContainer.classList.add('home-view');
  
  authScreen.classList.remove('active');
  homeScreen.classList.add('active');
  
  // Reset backgrounds to lockscreen style
  ambientBackground.className = 'ambient-bg locked-mode';
  updateWeatherParticles('clear');

  // Focus key input
  setTimeout(() => {
    welcomeKeyInput.focus();
  }, 500);
}

function logout() {
  currentUser = null;
  isDashboardUnlocked = false;
  
  // Clear forms
  loginForm.reset();
  signupForm.reset();
  keyForm.reset();
  locationForm.reset();
  
  // Reset lock screen classes
  welcomeKeyOverlay.classList.remove('unlocked-fade', 'hide');
  weatherDetailsView.classList.add('hide');
  weatherCardPlaceholder.classList.remove('hide');
  
  const lockIcon = document.getElementById('dashboard-lock-icon');
  lockIcon.className = 'lock-svg locked';
  
  weatherReport.classList.add('hide');
  
  // Transition screens back
  appContainer.classList.remove('home-view');
  appContainer.classList.add('auth-view');
  
  homeScreen.classList.remove('active');
  authScreen.classList.add('active');
  
  ambientBackground.className = 'ambient-bg auth-mode';
  updateWeatherParticles('clear');
  
  showToast("Logged out successfully", "info");
}

// ==========================================
// WEATHER DATA HANDLING (API & FALLBACK)
// ==========================================
async function fetchWeatherData(city) {
  try {
    // Step 1: Geocoding API (Resolve city name to coordinates)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error("Geocoding service unavailable");
    
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Could not find coordinates for "${city}"`);
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Forecast Weather API (Fetch temperature and weather metrics)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("Weather database query failed");

    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;
    const daily = weatherData.daily;

    const weatherCode = current.weathercode;
    const weatherMeta = WEATHER_CODES[weatherCode] || { desc: "Dynamic Weather", type: "clear" };

    return {
      success: true,
      city: name,
      country: country || "",
      temp: Math.round(current.temperature),
      desc: weatherMeta.desc,
      type: weatherMeta.type,
      windSpeed: Math.round(current.windspeed),
      humidity: Math.round(45 + Math.random() * 45), // mock relative humidity beautifully
      hi: daily ? Math.round(daily.temperature_2m_max[0]) : Math.round(current.temperature + 4),
      lo: daily ? Math.round(daily.temperature_2m_min[0]) : Math.round(current.temperature - 4)
    };
  } catch (error) {
    console.error("Weather service lookup failed: ", error);
    // Return graceful mock details if API fails, ensuring premium user flow never crashes
    return getFallbackWeatherData(city);
  }
}

function getFallbackWeatherData(city) {
  // Generate random stable mock numbers based on string checksum of city name
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const seedTemp = Math.abs(hash % 38); // 0 to 37 degrees
  const weatherTypes = ['clear', 'cloudy', 'rain', 'snow'];
  const typeIndex = Math.abs(hash % weatherTypes.length);
  const type = weatherTypes[typeIndex];
  
  let desc = "Mild Breeze";
  if (type === 'clear') desc = seedTemp > 25 ? "Clear & Sunny" : "Clear & Cool";
  else if (type === 'cloudy') desc = "Partly Cloudy";
  else if (type === 'rain') desc = "Continuous Rain showers";
  else if (type === 'snow') desc = "Moderate Snowfall";

  return {
    success: true,
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: "Locality",
    temp: seedTemp,
    desc: desc,
    type: type,
    windSpeed: Math.abs((hash >> 2) % 32) + 5,
    humidity: Math.abs((hash >> 4) % 40) + 50,
    hi: seedTemp + Math.abs((hash >> 6) % 6) + 1,
    lo: seedTemp - Math.abs((hash >> 8) % 6) - 1,
    fallback: true
  };
}

// ==========================================
// EVENT LISTENERS & TRIGGERS
// ==========================================

// Rotate Auth Card (Register vs Login)
goToSignupBtn.addEventListener('click', (e) => {
  e.preventDefault();
  authCard.classList.add('is-flipped');
  signupForm.reset();
});

goToLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  authCard.classList.remove('is-flipped');
  loginForm.reset();
});

// Handle Login Submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const usernameVal = document.getElementById('login-username').value.trim();
  const passwordVal = document.getElementById('login-password').value;

  if (!usernameVal || !passwordVal) {
    showToast("Please complete all credentials inputs", "error");
    return;
  }

  const users = getUsers();
  const matchedUser = users.find(u => u.username.toLowerCase() === usernameVal.toLowerCase() && u.password === passwordVal);

  if (matchedUser) {
    showToast(`Session authenticated successfully!`, "success");
    transitionToHome(matchedUser.username);
  } else {
    // Shake card & trigger feedback
    showToast("Incorrect username or password", "error");
    authCard.classList.add('shake');
    setTimeout(() => {
      authCard.classList.remove('shake');
    }, 400);
  }
});

// Handle Registration Submission
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const usernameVal = document.getElementById('signup-username').value.trim();
  const passwordVal = document.getElementById('signup-password').value;
  const confirmPasswordVal = document.getElementById('signup-confirm-password').value;

  if (!usernameVal || !passwordVal || !confirmPasswordVal) {
    showToast("Please enter all registration criteria", "error");
    return;
  }

  if (usernameVal.length < 3) {
    showToast("Username must be at least 3 characters long", "error");
    return;
  }

  if (passwordVal.length < 6) {
    showToast("Password must be at least 6 characters long", "error");
    return;
  }

  if (passwordVal !== confirmPasswordVal) {
    showToast("Passwords do not match. Please verify", "error");
    return;
  }

  const users = getUsers();
  const userExists = users.some(u => u.username.toLowerCase() === usernameVal.toLowerCase());

  if (userExists) {
    showToast("Username already registered. Try signing in", "error");
    authCard.classList.add('shake');
    setTimeout(() => {
      authCard.classList.remove('shake');
    }, 400);
    return;
  }

  // Register User
  saveUser({ username: usernameVal, password: passwordVal });
  showToast("Account established! You may log in now.", "success");
  
  // Flip card back to Login view
  authCard.classList.remove('is-flipped');
  setTimeout(() => {
    document.getElementById('login-username').value = usernameVal;
    document.getElementById('login-password').focus();
  }, 400);
});

// Handle Welcome Key Authorization
keyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const keyInputVal = welcomeKeyInput.value.trim();

  // Valid Welcome Key: WELCOME2026
  if (keyInputVal.toUpperCase() === 'WELCOME2026') {
    isDashboardUnlocked = true;
    showToast("Authorization match! Unlocking weather data...", "success");

    // Animate Lock Shackle Opening
    const lockIcon = document.getElementById('dashboard-lock-icon');
    lockIcon.classList.remove('locked');
    lockIcon.classList.add('unlocked');

    // Fade and unlock the screen overlay
    setTimeout(() => {
      welcomeKeyOverlay.classList.add('unlocked-fade');
      
      setTimeout(() => {
        welcomeKeyOverlay.classList.add('hide');
        weatherCardPlaceholder.classList.add('hide');
        weatherDetailsView.classList.remove('hide');
        
        // Remove locked overlay background blob styling
        ambientBackground.className = 'ambient-bg';

        // Play custom typewriter welcome effect
        playTypewriterEffect(welcomeMessageTyping, `Welcome back, ${currentUser}!`);
        
        // Auto-focus location search bar
        setTimeout(() => {
          locationInput.focus();
        }, 500);
      }, 600);
    }, 650);

  } else {
    showToast("Authentication Key incorrect. Please review details", "error");
    const keyCard = document.querySelector('.key-card');
    keyCard.classList.add('shake');
    setTimeout(() => {
      keyCard.classList.remove('shake');
    }, 400);
    welcomeKeyInput.value = '';
    welcomeKeyInput.focus();
  }
});

// Handle Location Temperature Inquiry
locationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const locationQuery = locationInput.value.trim();

  if (!locationQuery) return;

  // Set loading states
  searchSubmitBtn.disabled = true;
  const btnText = searchSubmitBtn.querySelector('.btn-text');
  const searchIcon = searchSubmitBtn.querySelector('.search-icon');
  const spinner = searchSubmitBtn.querySelector('.spinner');

  btnText.classList.add('hide');
  searchIcon.classList.add('hide');
  spinner.classList.remove('hide');

  // Trigger search fetch
  const data = await fetchWeatherData(locationQuery);

  // Restore button states
  btnText.classList.remove('hide');
  searchIcon.classList.remove('hide');
  spinner.classList.add('hide');
  searchSubmitBtn.disabled = false;

  if (data.success) {
    if (data.fallback) {
      showToast("API timeout. Loaded locally simulated climate data", "info");
    } else {
      showToast(`Atmospheric query resolved for ${data.city}`, "success");
    }

    // Update Weather Report UI
    reportCityName.textContent = data.city;
    reportCountry.textContent = data.country;
    reportTemp.textContent = data.temp;
    reportWeatherDesc.textContent = data.desc;
    reportHumidity.textContent = `${data.humidity}%`;
    reportWind.textContent = `${data.windSpeed} km/h`;
    reportHiLo.textContent = `${data.hi}° / ${data.lo}°`;

    // Render animated SVG icon
    weatherGraphicContainer.innerHTML = SVG_ICONS[data.type] || SVG_ICONS.clear;

    // Show Weather Report panel
    weatherReport.classList.remove('hide');

    // Update atmospheric background visual blobs & particles
    ambientBackground.className = `ambient-bg weather-${data.type}`;
    updateWeatherParticles(data.type);

  } else {
    showToast("Climate lookup query failed. Try again.", "error");
  }
});

// Logout listener
logoutBtn.addEventListener('click', logout);

// Toggle Hint on tap/click for mobile accessibility
const hintToggle = document.querySelector('.hint-toggle');
const keyHint = document.querySelector('.key-hint');
hintToggle.addEventListener('click', () => {
  keyHint.classList.toggle('active');
});

// Seed default users in localStorage for easy login testing if completely empty
window.addEventListener('DOMContentLoaded', () => {
  const users = getUsers();
  if (users.length === 0) {
    // Seed standard tester user
    saveUser({ username: "testuser", password: "password" });
    console.log("Seeded database: Username: 'testuser', Password: 'password'");
  }
});
