// Book Wizard: Search and manage your favorite books
let favorites = JSON.parse(localStorage.getItem('favoriteBooks') || '[]');
let darkMode = false;

document.getElementById('toggleMode').onclick = function() {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.style.background = '#222';
        document.body.style.color = '#eee';
        document.getElementById('toggleMode').textContent = 'Switch to Light Mode';
        document.querySelectorAll('.book').forEach(function(el){el.style.background='#333';el.style.color='#eee';});
        document.querySelector('footer').style.background = '#222';
        document.querySelector('footer').style.color = '#eee';
        document.querySelector('h1').style.color = '#fff';
    } else {
        document.body.style.background = '#f5f5f5';
        document.body.style.color = '#333';
        document.getElementById('toggleMode').textContent = 'Switch to Dark Mode';
        document.querySelectorAll('.book').forEach(function(el){el.style.background='white';el.style.color='#333';});
        document.querySelector('footer').style.background = '#f0f0f0';
        document.querySelector('footer').style.color = '#555';
        document.querySelector('h1').style.color = '#333';
    }
};

async function searchBooks() {
    const query = document.getElementById("searchInput").value;
    const results = document.getElementById("results");
    if (!query) {
        results.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }
    results.innerHTML = "<p>Loading...</p>";
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}`
        );
        const data = await response.json();
        if (!data.items) {
            results.innerHTML = "<p>No results found.</p>";
            return;
        }
        results.innerHTML = "";
        data.items.forEach(function(book) {
            const info = book.volumeInfo;
            const thumbnail = (info.imageLinks && info.imageLinks.thumbnail) ? info.imageLinks.thumbnail : "https://via.placeholder.com/120x160";
            results.innerHTML += `
                <div class="book">
                    <img src="${thumbnail}">
                    <div>
                        <h2>${info.title}</h2>
                        <p><strong>Author:</strong> ${info.authors ? info.authors.join(", ") : "Unknown"}</p>
                        <p><strong>Published:</strong> ${info.publishedDate || "N/A"}</p>
                        <p>${info.description ? info.description.substring(0, 200) : "No description available."}...</p>
                        <p><a href="${info.infoLink || '#'}" target="_blank" style="color:#007bff;text-decoration:underline;">View Book</a></p>
                        <button onclick='saveFavorite(${JSON.stringify(info)})' style="margin-top:8px;">Add to Favorites</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        results.innerHTML = "<p>Error fetching data. Try again later.</p>";
    }
}

function saveFavorite(bookInfo) {
    favorites.push(bookInfo);
    localStorage.setItem('favoriteBooks', JSON.stringify(favorites));
    alert('Book saved to favorites!');
    loadFavorites();
}

function removeFavorite(index) {
    favorites.splice(index, 1);
    localStorage.setItem('favoriteBooks', JSON.stringify(favorites));
    loadFavorites();
}

function loadFavorites() {
    const favDiv = document.getElementById('favorites');
    favDiv.innerHTML = '<h2>Favorite Books</h2>';
    const favs = JSON.parse(localStorage.getItem('favoriteBooks') || '[]');
    if (favs.length === 0) {
        favDiv.innerHTML += '<p>No favorites yet.</p>';
        return;
    }
    favs.forEach(function(info, idx) {
        var thumbnail = (info.imageLinks && info.imageLinks.thumbnail) ? info.imageLinks.thumbnail : "https://via.placeholder.com/120x160";
        favDiv.innerHTML += `
            <div class="book">
                <img src="${thumbnail}">
                <div>
                    <h2>${info.title}</h2>
                    <p><strong>Author:</strong> ${info.authors ? info.authors.join(", ") : "Unknown"}</p>
                    <p><strong>Published:</strong> ${info.publishedDate || "N/A"}</p>
                    <p>${info.description ? info.description.substring(0, 200) : "No description available."}...</p>
                    <p><a href="${info.infoLink || '#'}" target="_blank" style="color:#007bff;text-decoration:underline;">View Book</a></p>
                    <button onclick="removeFavorite(${idx})" style="margin-top:8px;background:#b00020;">Remove from Favorites</button>
                </div>
            </div>
        `;
    });
}

loadFavorites();
