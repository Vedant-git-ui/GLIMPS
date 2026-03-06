// Glimps Final Script - Powered by GNews
const GNEWS_KEY = "9922daf5f9eb12b2befd1de4c6eb19dd"; 
const states = ["Odisha", "Maharashtra", "Delhi", "Bihar", "Karnataka", "Punjab", "West Bengal", "Tamil Nadu", "Gujarat", "Kerala", "Assam", "Rajasthan"];

function init() {
    updateDate();
    checkSession();
    fetchNews('india'); // Default load on startup
}

// 1. Memory Logic (LocalStorage)
function checkSession() {
    const name = localStorage.getItem('glimpsUser');
    const gold = localStorage.getItem('glimpsGold') === 'true';
    const userDisplay = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');

    if(name) {
        userDisplay.innerText = name.toUpperCase();
        logoutBtn.style.display = 'block';
        if(gold) userDisplay.classList.add('gold-user');
        else userDisplay.classList.remove('gold-user');
    } else {
        userDisplay.innerText = "SIGN UP";
        userDisplay.classList.remove('gold-user');
        logoutBtn.style.display = 'none';
    }
}

function updateDate() {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    document.getElementById('dateDisplay').innerText = new Date().toLocaleDateString('en-IN', options);
}

// 2. The GNews Fetch (Works on Live Links)
async function fetchNews(category) {
    const feed = document.getElementById('newsFeed');
    feed.innerHTML = "<p style='text-align:center; padding:50px; opacity:0.5;'>Scanning Horizons...</p>";
    
    // GNews Search Logic
    let query = category === 'india' ? 'India' : category;
    // Using GNews v4 Search Endpoint
    let url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=in&max=15&apikey=${GNEWS_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if(!data.articles || data.articles.length === 0) {
            feed.innerHTML = "<p style='text-align:center; padding:50px;'>No headlines found. GNews daily limit might be reached.</p>";
            return;
        }

        feed.innerHTML = "";
        data.articles.forEach((art, i) => {
            const div = document.createElement('div');
            div.className = 'headline-item';
            // Staggered entrance: each headline slides up 0.1s after the previous one
            div.style.animationDelay = `${i * 0.1}s`; 
            div.innerHTML = `<div style="font-family:'Lora', serif; font-weight:700;">${art.title}</div>`;
            div.onclick = () => window.open(art.url, '_blank');
            feed.appendChild(div);
        });
    } catch (e) {
        console.error(e);
        feed.innerHTML = "<p style='text-align:center; padding:50px;'>Error syncing with GNews. Check internet.</p>";
    }
}

// 3. Signup & Payment Logic
function saveUser(isGold) {
    const name = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    if(!name || !email) return alert("Please fill all details");
    
    localStorage.setItem('glimpsUser', name);
    localStorage.setItem('glimpsGold', isGold ? 'true' : 'false');
    
    if(isGold) {
        alert("Opening UPI... If you are on Desktop, please complete the payment on your mobile app to activate Gold Glow.");
        // Your Verified UPI ID
        window.location.href = `upi://pay?pa=vedantvamsi38@okaxis&pn=GlimpsGold&am=9&cu=INR&tn=GlimpsGoldStatus`;
    }
    
    setTimeout(() => {
        checkSession();
        toggleSignup();
    }, 1500);
}

function triggerUPI() { saveUser(true); }

function logout() {
    localStorage.clear();
    checkSession();
    toggleSignup();
}

// 4. UI Controls
function toggleSignup() {
    const m = document.getElementById('signupModal');
    m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}

function openStateList() {
    const list = document.getElementById('stateList');
    list.innerHTML = "";
    states.forEach(s => {
        const li = document.createElement('li');
        li.innerText = s.toUpperCase();
        li.style.padding = "20px";
        li.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
        li.style.fontWeight = "800";
        li.onclick = () => { fetchNews(s); closeStateList(); };
        list.appendChild(li);
    });
    document.getElementById('stateOverlay').style.display = 'flex';
}

function closeStateList() { 
    document.getElementById('stateOverlay').style.display = 'none'; 
}

window.onload = init;
