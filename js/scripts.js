//  This is the main IIFE function containing all data //

var photoRepository = (function () {
  var photoList = [];
  var apiUrl = 'https://pixabay.com/api/?key=17795524-3cd93801424773114b97b5b02&q=landscape+monochrome&image_type=photo';
  var banner = document.querySelector('p');
  var modalContainer = document.querySelector('#modal-container');

  // essential functions to access data within IIFE
  function add(photo) {
    photoList.push(photo);
  }

  function getAll() {
    return photoList;
  }

  // add Photo buttons
  function addListItem(photo) {
    var scapeList = document.querySelector('.photo-list')
    var scapeItem = document.createElement('li');
    var button = document.createElement('button');
    button.innerText = photo.name;
    button.classList.add('photoButton')
    heroItem.appendChild(button);
    heroList.appendChild(heroItem);
    buttonListen(button, photo);
  }

  function showLoadingMessage(banner) {
    banner.classList.remove('hideDataLoading');
  }

  function hideLoadingMessage(banner) {
    banner.classList.add('hideDataLoading');
  }

  //fetch primary photo data (name, character url)
  // var API_KEY = '17795524-3cd93801424773114b97b5b02';
  // var URL = 'https://pixabay.com/api/?key="+API_KEY+"&q=landscape+monochrome&image_type=photo'

    $.getJSON('https://pixabay.com/api/?key=17795524-3cd93801424773114b97b5b02&q=landscape+monochrome&image_type=photo', function(data) {
    if (parseInt(data.totalHits) > 0)
      $.each(data.hits, function(i, hit){console.log(hit.id, hit.pageURL); });
    else {
      console.log('No hits');
    }
    });





/*  function loadList() {
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
} */

  /*//fetch additional photo details
  function loadDetails(item) {
    showLoadingMessage(banner);
    var url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {

      // Add details to each Photo (aka item)
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
  } */

  /*
  function typeLoop(photo) {
    var photoTypes = photo.types;
    for (var i = 0; i < photoTypes.length; i++) {
      console.log(photoTypes[i].type.name);
      return (photoTypes[i].type.name);
    };
  }

  function abilityLoop(photo) {
    var photoAbilities = photo.abilities;
    for (var i = 0; i < photoAbilities.length; i++) {
      console.log(photoAbilities[i].ability.name);
      return (photoAbilities[i].ability.name);
    };
  } */

  /* function typeLoop(photo) {
    var photoTypes = photo.types;
    photoTypes.forEach(function(trait) {
      console.log(trait.type.name);
      return (trait.type.name);
    });
  } */

  /* function showDetails(photo) {
    loadDetails(photo).then(function () {
      var photoAbilities = photo.abilities;
      showModal(
        photo.imageUrl,
        'Character: " ' + photo.name + ' "',

        // Fallback: replace | 'Primary Type: ' + photo.types[0].type.name,
        'Type(s): ' + (typeLoop(photo)),

        // Fallback: replace | 'Primary Ability: ' + photo.abilities[0].ability.name,
        'Ability or Abilities: ' + (abilityLoop(photo)),
        'Height: ' + photo.height + ' metres',
        'Healthpoints: ' + photo.healthPoint
      )
      console.log(photo);
    });
  } */

  //creates event listener for each button
  function buttonListen(button, photo) {
    button.addEventListener('click', function (event) {
      showDetails(photo);
    });
  }

  // --- Modal Functions within photoRepository --------------

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
    imgElement.classList.add('photoImage');
    imgElement.src = img;

    //create content element as list
    var listElement = document.createElement('ul');
    listElement.classList.add('photoDetail')
    listElement.innerText = 'Statistics: ';

    var listElement__Item1 = document.createElement('li');
    listElement__Item1.classList.add('photoList__Type')
    listElement__Item1.innerText = types;

    var listElement__Item2 = document.createElement('li');
    listElement__Item2.classList.add('photoList__Abilities')
    listElement__Item2.innerText = abilities;

    var listElement__Item3 = document.createElement('li');
    listElement__Item3.classList.add('photoList__Height')
    listElement__Item3.innerText = height;

    var listElement__Item4 = document.createElement('li');
    listElement__Item4.classList.add('photonList__Health')
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

  // Return statement of photoRepository IIFE
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    // loadDetails: loadDetails
  };
})();   // ----------------- END OF photoRepositoryIIFE -----------------

// ------------- Functions external to IIFE -----------------------

photoRepository.loadList().then(function() {            // this calls the data from API and then calls getAll
  // Now the data is loaded!
  photoRepository.getAll().forEach(function(photo){   //  getAll returns photo, followed by forEach loop, add to photoList array
    photoRepository.addListItem(photo);
  });
});



// -----------------Experiment --------------
