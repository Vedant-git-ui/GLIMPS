const API_KEY = "653d45089e8d448eb27e5693780a86ca";
const states = ["Odisha", "Maharashtra", "Delhi", "Bihar", "Karnataka", "Punjab", "West Bengal", "Tamil Nadu", "Gujarat", "Kerala"];

function init() {
    updateDate();
    checkSession();
    fetchNews('india');
}

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

async function fetchNews(category) {
    const feed = document.getElementById('newsFeed');
    feed.innerHTML = "<p style='text-align:center; padding:50px; opacity:0.5;'>Scanning Horizons...</p>";
    
    let query = category === 'india' ? 'India' : category;
    let url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        feed.innerHTML = "";
        data.articles.slice(0, 15).forEach((art, i) => {
            const div = document.createElement('div');
            div.className = 'headline-item';
            div.style.animationDelay = `${i * 0.1}s`;
            div.innerHTML = `<span>${art.title}</span>`;
            div.onclick = () => window.open(art.url, '_blank');
            feed.appendChild(div);
        });
    } catch (e) {
        feed.innerHTML = "<p style='text-align:center; padding:50px;'>Offline. Check connection.</p>";
    }
}

function saveUser(isGold) {
    const name = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    if(!name || !email) return alert("Please fill all details");
    
    localStorage.setItem('glimpsUser', name);
    localStorage.setItem('glimpsGold', isGold ? 'true' : 'false');
    
    if(isGold) {
        window.location.href = `upi://pay?pa=vedantvamsi38@okaxis&pn=GlimpsGold&am=9&cu=INR`;
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
function closeStateList() { document.getElementById('stateOverlay').style.display = 'none'; }

window.onload = init;