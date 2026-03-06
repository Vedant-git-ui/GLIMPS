// Glimps | Final Clean Production Script
const API_KEY = "pub_7ab94bdc84bf42958f75f00361a5f234"; 
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
    if(name && userDisplay) {
        userDisplay.innerText = name.toUpperCase();
        if(gold) userDisplay.classList.add('gold-user');
    }
}

function updateDate() {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateEl = document.getElementById('dateDisplay');
    if(dateEl) dateEl.innerText = new Date().toLocaleDateString('en-IN', options);
}

// THE NEWS ENGINE
async function fetchNews(category) {
    const feed = document.getElementById('newsFeed');
    feed.innerHTML = "<div class='shimmer'>SYNCING GLIMPS...</div>";
    
    let url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}`;
    if (category === 'world') url += `&language=en`; 
    else if (category === 'india') url += `&country=in&language=en`; 
    else url += `&q=${category}&language=en`; 

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "error") throw new Error("Limit Reached");
        if (!data.results || data.results.length === 0) {
            feed.innerHTML = "<p class='error'>No Glimps found for this region.</p>";
            return;
        }

        feed.innerHTML = ""; 
        
        data.results.forEach((art, i) => {
            const div = document.createElement('div');
            div.className = 'headline-item';
            div.style.animationDelay = `${i * 0.1}s`;
            
            // Image is inside the 'expanded' div so it stays hidden initially
            const img = art.image_url ? `<img src="${art.image_url}" class="news-img">` : "";
            const source = art.source_id ? art.source_id.toUpperCase() : "NEWS";

            div.innerHTML = `
                <div class="meta-row">
                    <span class="tag">${source}</span>
                    <span class="time">${new Date(art.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div class="title">${art.title}</div>
                <div class="expanded" style="display: none;"> ${img}
                    <p style="margin: 15px 0; line-height: 1.5; opacity: 0.8;">${art.description || "Reading deep into the story..."}</p>
                    <a href="${art.link}" target="_blank" class="read-btn">READ FULL STORY</a>
                </div>
            `;
            
            div.onclick = (e) => {
                if(e.target.tagName === 'A') return;
                const expand = div.querySelector('.expanded');
                const isCurrentlyVisible = expand.style.display === 'block';
                
                // Close all other open headlines first
                document.querySelectorAll('.expanded').forEach(el => el.style.display = 'none');
                
                // Toggle this one
                expand.style.display = isCurrentlyVisible ? 'none' : 'block';
            };
            feed.appendChild(div);
        });
    } catch (e) {
        feed.innerHTML = "<p class='error'>OFFLINE: API QUOTA REACHED</p>";
    }
}

// UI HANDLERS
function toggleSignup() {
    const m = document.getElementById('signupModal');
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
}

function triggerUPI() {
    const name = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    if(!name || !email) return alert("Details required!");
    localStorage.setItem('glimpsUser', name);
    localStorage.setItem('glimpsGold', 'true');
    window.location.href = `upi://pay?pa=vedantvamsi38@okaxis&pn=GlimpsGold&am=9&cu=INR`;
    setTimeout(() => location.reload(), 2000);
}

function openStateList() {
    const list = document.getElementById('stateList');
    list.innerHTML = "";
    states.forEach(s => {
        const li = document.createElement('li');
        li.innerText = s.toUpperCase();
        li.style.padding = "15px";
        li.onclick = () => { 
            fetchNews(s); 
            document.getElementById('stateOverlay').style.display='none'; 
            document.getElementById('currentState').innerText = s.toUpperCase();
        };
        list.appendChild(li);
    });
    document.getElementById('stateOverlay').style.display = 'flex';
}

window.onload = init;

