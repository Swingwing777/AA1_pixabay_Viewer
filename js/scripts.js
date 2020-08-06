//  This is the main IIFE function containing all data //

var pokemonRepository = (function () {
  var pokemonList = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var banner = document.querySelector('p');
  var modalContainer = document.querySelector('#modal-container');

  // essential functions to access data within IIFE
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  // add Pokemon buttons
  function addListItem(pokemon) {
    var heroList = document.querySelector('.pokemon-list')
    var heroItem = document.createElement('li');
    var button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('pokemonButton')
    heroItem.appendChild(button);
    heroList.appendChild(heroItem);
    buttonListen(button, pokemon);
  }

  function showLoadingMessage(banner) {
    banner.classList.remove('hideDataLoading');
  }

  function hideLoadingMessage(banner) {
    banner.classList.add('hideDataLoading');
  }

  //fetch primary pokemmon data (name, character url)
  function loadList() {
    showLoadingMessage(banner);
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
        hideLoadingMessage(banner);
      });
    }).catch(function (e) {
      hideLoadingMessage(banner);
      console.error(e);
    })
  }

  //fetch additional pokemon details
  function loadDetails(item) {
    showLoadingMessage(banner);
    var url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {

      // Add details to each Pokemon (aka item)
      item.imageUrl = details.sprites.front_default;
      item.types = details.types;
      item.height = details.height;
      item.abilities = details.abilities;
      item.healthPoint = details.stats[0].base_stat;
      hideLoadingMessage(banner);
    }).catch(function (e) {
      hideLoadingMessage(banner);
      console.error(e);
    });
  }

  /*
  function typeLoop(pokemon) {
    var pokemonTypes = pokemon.types;
    for (var i = 0; i < pokemonTypes.length; i++) {
      console.log(pokemonTypes[i].type.name);
      return (pokemonTypes[i].type.name);
    };
  }

  function abilityLoop(pokemon) {
    var pokemonAbilities = pokemon.abilities;
    for (var i = 0; i < pokemonAbilities.length; i++) {
      console.log(pokemonAbilities[i].ability.name);
      return (pokemonAbilities[i].ability.name);
    };
  } */

  function typeLoop(pokemon) {
    var pokemonTypes = pokemon.types;
    pokemonTypes.forEach(function(trait) {
      console.log(trait.type.name);
      return (trait.type.name);
    });
  }

  function abilityLoop(pokemon) {
    var pokemonAbilities = pokemon.abilities;
    pokemonAbilities.forEach(function(trait) {
      console.log(trait.ability.name);
      return (trait.ability.name);
    });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      var pokemonAbilities = pokemon.abilities;
      showModal(
        pokemon.imageUrl,
        'Character: " ' + pokemon.name + ' "',

        // Fallback: replace | 'Primary Type: ' + pokemon.types[0].type.name,
        'Type(s): ' + (typeLoop(pokemon)),

        // Fallback: replace | 'Primary Ability: ' + pokemon.abilities[0].ability.name,
        'Ability or Abilities: ' + (abilityLoop(pokemon)),
        'Height: ' + pokemon.height + ' metres',
        'Healthpoints: ' + pokemon.healthPoint
      )
      console.log(pokemon);
    });
  }

  //creates event listener for each button
  function buttonListen(button, pokemon) {
    button.addEventListener('click', function (event) {
      showDetails(pokemon);
    });
  }

  // --- Modal Functions within Pokemon Repository --------------

  function showModal(img, title, types, abilities, height, healthPoint) {

    // Clear the template modal of content, then rebuild as desired
    modalContainer.innerHTML = '';

    //create modal
    var modal = document.createElement('div');
    modal.classList.add('modal');

    //create title element
    var titleElement = document.createElement('h1');
    titleElement.innerText = title;


    //create image for modal
    var imgElement = document.createElement('img');
    imgElement.classList.add('pokemonImage');
    imgElement.src = img;

    //create content element as list
    var listElement = document.createElement('ul');
    listElement.classList.add('pokemonDetail')
    listElement.innerText = 'Statistics: ';

    var listElement__Item1 = document.createElement('li');
    listElement__Item1.classList.add('pokemonList__Type')
    listElement__Item1.innerText = types;

    var listElement__Item2 = document.createElement('li');
    listElement__Item2.classList.add('pokemonList__Abilities')
    listElement__Item2.innerText = abilities;

    var listElement__Item3 = document.createElement('li');
    listElement__Item3.classList.add('pokemonList__Height')
    listElement__Item3.innerText = height;

    var listElement__Item4 = document.createElement('li');
    listElement__Item4.classList.add('pokemonList__Health')
    listElement__Item4.innerText = healthPoint;

    //create close button
    var closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    listElement.appendChild(listElement__Item1);
    listElement.appendChild(listElement__Item2);
    listElement.appendChild(listElement__Item3);
    listElement.appendChild(listElement__Item4);
    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(listElement);
    modal.appendChild(imgElement);
    modalContainer.appendChild(modal);

    //focus closeButton so that user can simply press Enter
    closeButtonElement.focus();

    modalContainer.classList.add('is-visible');
  }

  function hideModal() {
    modalContainer.classList.remove('is-visible');
  }

/* document.querySelector('#show-modal').addEventListener('click', () => {
    showModal('Modal Title', 'This is the modal content' );
  });  */

  //arrow function – Esc to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });

  // Click outside modal on modal overlay will close modal
  modalContainer.addEventListener('click', (e) => {
    var target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });

// -------------- End of modal   --------------------

  // Return statement of pokemonRepository IIFE
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();   // ----------------- END OF pokemonRepositoryIIFE -----------------

// ------------- Functions external to IIFE -----------------------

pokemonRepository.loadList().then(function() {            // this calls the data from API and then calls getAll
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon){   //  getAll returns Pokemon, followed by forEach loop, add to pokemonList array
    pokemonRepository.addListItem(pokemon);
  });
});

function objectEquals(arr1){
//template array of keys
let arr2 = ["name", "type", "ability", "height", "healthPoint"];
  //check if both are arrays and have equal length
  if (Array.isArray(arr1) && Array.isArray(arr2) && arr1.length == arr2.length){
    let sortedArr1 = arr1.sort()
    let sortedArr2 = arr2.sort()
    return sortedArr1.every((val, index) => val == sortedArr2[index]);
  } else{
    return "cannot compare these";
  }
}

function checkChar(charDetail) {          // adds to pokemonList2.
  var charKeys = Object.keys(charDetail);
  if (objectEquals(charKeys)) {
    pokemonRepository.add(charDetail);
  } else {
    alert('Check List "New Character" input format');
    console.log(charkeys);
  }
}

// -----------------Experiment --------------
