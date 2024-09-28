document.addEventListener('DOMContentLoaded', () => {
  const imageContainer = document.getElementById('image-container');
  const favoritesContainer = document.getElementById('favorites-container');
  const filterInput = document.getElementById('filter');
  const filterBtn = document.getElementById('filter-btn');
  const limparBtn = document.getElementById('limpar-btn');
  const favoritosBtn = document.getElementById('favoritos-btn');
  const limparFavoritosBtn = document.getElementById('limpar-favoritos-btn');

  let characters = [];
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let currentName = '';
  let page = 1;

  // Função para buscar personagens da API
  async function BuscarCharacters(name = '', pageNum = 1) {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${name}&page=${pageNum}`);
      const data = await response.json();

      if (data.results) {
          characters = data.results.map(item => ({
              id: item.id,
              name: item.name,
              image: item.image,
              status: item.status,
              species: item.species,
          }));
          displayCharacters(characters);
      } else {
          imageContainer.innerHTML = '<p>Nenhum personagem encontrado.</p>';
      }
  }

  // Função para exibir personagens
  function displayCharacters(images) {
      imageContainer.innerHTML = ''; // Limpa o container
      if (images.length > 0) {
          images.forEach(character => {
              const item = document.createElement('div');
              item.classList.add('image-item');
              item.innerHTML = `
                  <img src="${character.image}" alt="${character.name}">
                  <button class="favorite-btn">❤️</button>
                  <div class="details">Nome: ${character.name}<br>Status: ${character.status}<br>Espécie: ${character.species}</div>
              `;

              // Eventos
              item.querySelector('.favorite-btn').onclick = (event) => {
                  event.stopPropagation(); // Impede que o clique dispare o evento do item
                  addToFavorites(character);
              };
              item.onclick = () => alert(`Detalhes do personagem:\nNome: ${character.name}\nStatus: ${character.status}\nEspécie: ${character.species}`);

              imageContainer.appendChild(item);
          });
      } else {
          imageContainer.innerHTML = '<p>Nenhum personagem encontrado.</p>';
      }
  }

  // Adiciona personagem aos favoritos
  function addToFavorites(character) {
      if (!favorites.some(fav => fav.id === character.id)) {
          favorites.push(character);
          localStorage.setItem('favorites', JSON.stringify(favorites));
      }
  }

  // Exibe os favoritos quando o botão é clicado
  favoritosBtn.onclick = () => {
      if (favorites.length > 0) {
          favoritesContainer.innerHTML = favorites.map(fav => `<img src="${fav.image}" alt="${fav.name}" class="favorite">`).join('');
      } else {
          favoritesContainer.innerHTML = '<p>Nenhum favorito encontrado.</p>';
      }
  };

  // Limpa os favoritos
  limparFavoritosBtn.onclick = () => {
      favorites = [];
      localStorage.removeItem('favorites');
      favoritesContainer.innerHTML = '<p>Nenhum favorito encontrado.</p>'; // Limpa a exibição de favoritos
  };

  // Filtra os personagens
  filterBtn.onclick = () => {
      currentName = filterInput.value.trim();
      page = 1;
      characters = [];
      if (currentName) {
        BuscarCharacters(currentName, page);
      } else {
          imageContainer.innerHTML = ''; // Limpa o container se o filtro estiver vazio
      }
  };

  // Limpa o filtro
  limparBtn.onclick = () => {
      filterInput.value = '';
      currentName = '';
      page = 1;
      characters = [];
      imageContainer.innerHTML = ''; // Limpa o container
  };

  // Scroll infinito
  window.onscroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
          page++;
          BuscarCharacters(currentName, page);
      }
  };


});
