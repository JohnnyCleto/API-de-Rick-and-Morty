document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.getElementById('image-container');
    const favoritesContainer = document.getElementById('favorites-container');
    const characterSelect = document.getElementById('character-select');
    const filterBtn = document.getElementById('filter-btn');
    const limparBtn = document.getElementById('limpar-btn');
    const favoritosBtn = document.getElementById('favoritos-btn');
    const limparFavoritosBtn = document.getElementById('limpar-favoritos-btn');
  
    let characters = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let page = 1;
  

    async function buscarPersonagens(pageNum = 1) {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${pageNum}`);
      const data = await response.json();
  
      if (data.results) {
        characters.push(...data.results); 
        displayCharacters(characters);
  
        
        data.results.forEach(item => {
          const option = document.createElement('option');
          option.value = item.name;
          option.textContent = item.name;
          characterSelect.appendChild(option);
        });
      }
    }
  

    async function buscarPersonagemSelecionado(name) {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${name}`);
      const data = await response.json();
  
      if (data.results) {
        displayCharacters(data.results);
      } else {
        imageContainer.innerHTML = '<p>Nenhum personagem encontrado.</p>';
      }
    }
  

    function displayCharacters(images) {
      imageContainer.innerHTML = ''; 
      if (images.length > 0) {
        images.forEach(character => {
          const item = document.createElement('div');
          item.classList.add('image-item');
          item.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <button class="favorite-btn">❤️</button>
            <div class="details">Nome: ${character.name}<br>Status: ${character.status}<br>Espécie: ${character.species}</div>
          `;
  
               item.querySelector('.favorite-btn').onclick = (event) => {
            event.stopPropagation(); 
            addToFavorites(character);
            alert(`${character.name} foi adicionado aos favoritos!`);
          };
  

          item.onclick = () => alert(`Detalhes do personagem:\nNome: ${character.name}\nStatus: ${character.status}\nEspécie: ${character.species}`);
  
          imageContainer.appendChild(item);
        });
      } else {
        imageContainer.innerHTML = '<p>Nenhum personagem encontrado.</p>';
      }
    }
  
    function addToFavorites(character) {
      if (!favorites.some(fav => fav.id === character.id)) {
        favorites.push(character);
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
    }
  

    favoritosBtn.onclick = () => {
      if (favorites.length > 0) {
        favoritesContainer.innerHTML = favorites.map(fav => `<img src="${fav.image}" alt="${fav.name}" class="favorite">`).join('');
      } else {
        favoritesContainer.innerHTML = '<p>Nenhum favorito encontrado.</p>';
      }
    };
  

    limparFavoritosBtn.onclick = () => {
      favorites = [];
      localStorage.removeItem('favorites');
      favoritesContainer.innerHTML = '<p>Nenhum favorito encontrado.</p>'; 
    };
  
    
    filterBtn.onclick = () => {
      const selectedName = characterSelect.value;
      if (selectedName) {
        buscarPersonagemSelecionado(selectedName);
      } else {
        imageContainer.innerHTML = ''; 
        displayCharacters(characters); 
      }
    };
  

    limparBtn.onclick = () => {
      characterSelect.value = ''; 
      imageContainer.innerHTML = ''; 
      displayCharacters(characters); 
    };
  
    
    buscarPersonagens();
  
    
    window.onscroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !characterSelect.value) {
        page++;
        buscarPersonagens(page); 
      }
    };
  });
  
