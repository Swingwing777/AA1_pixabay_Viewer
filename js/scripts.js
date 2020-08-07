//  This is the main IIFE function containing all data //

var photoRepository = (function () {
  var photoAlbum = [];
  var apiUrl = 'https://pixabay.com/api/?key=17795524-3cd93801424773114b97b5b02&q=landscape+monochrome&image_type=photo';
  var banner = $('.dataLoading');
  var modalContainer = $('#modal-container');

  // essential functions to access data within IIFE
  function add(photo) {
    photoAlbum.push(photo);
  }

  function getAll() {
    return photoAlbum;
  }

 // add Photo buttons

function addListItem(photo) {
  var photoList = $('.photo-list');
  var photoItem = $('<li></li>');
  var button = $('<button class="photoButton">Pixabay Photo ID + photo.pixID</button>');
  var thumbNail = $('<img class="thumb" src=photo.preview>');
  button.append(thumbNail);
  photoItem.append(button);
  photoList.append(photoItem);
  buttonListen(button, photo);
}

  function showLoadingMessage(banner) {
    banner.removeClass('hideDataLoading');
  }

  function hideLoadingMessage(banner) {
    banner.addClass('hideDataLoading');
  }

 //fetch photo data
 function loadList() {
    showLoadingMessage(banner);
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.hits.forEach(function (hit) {
        console.log(hit.id, hit.tags, hit.previewURL, hit.webformatURL, hit.largeImageURL);
        var photo = {
          pixID: hit.id,
          tags: hit.tags,
          preview: hit.previewURL,
          webSize: hit.webformatURL,
          image: hit.largeImageURL,
          pageURL: hit.pageURL
        };
        add(photo);
        hideLoadingMessage(banner);
      });
    }).catch(function (e) {
      hideLoadingMessage(banner);
      console.error(e);
    })
  }

/*function loadList(photo) {
  showLoadingMessage(banner);
  jQuery.getJSON(apiUrl, function(data) {
    if (parseInt(data.totalHits) > 0)
    jQuery.each(data.hits, function(i, hit){
      //console.log(hit.id, hit.tags, hit.previewURL, hit.webformatURL, hit.largeImageURL);
      var photo = {
        id: hit.id,
        tags: hit.tags,
        preview: hit.previewURL,
        webSize: hit.webformatURL,
        image: hit.largeImageURL,
        pageURL: hit.pageURL
      };
      add(photo);
      hideLoadingMessage(banner);
    })
    else {
      console.log('No hits');
    }
  })
}; */

  function showDetails(photo) {
    showLoadingMessage(banner);
    showModal(photo.image, photo.tags, photo.pixID, photo.webSize, photo.pageURL);
    hideLoadingMessage(banner);
  }

  //creates event listener for each button
  function buttonListen(button, photo) {
    button.on('click', function (event) {
      showDetails(photo);
    });
  }

  // --- Modal Functions within Photo Repository --------------

  function showModal(img, tags, pixID, large, photoPage) {

    // Clear the template modal of content, then rebuild as desired
    modalContainer.innerHTML = '';

    //create modal
    var modal = document.createElement('div');
    modal.classList.add('modal');

    //create title element
    var titleElement = document.createElement('h1');
    titleElement.innerText = tags;


    //create image for modal
    var imgElement = document.createElement('img');
    imgElement.classList.add('photoImage');
    imgElement.src = img;

    //create content element as list
    var listElement = document.createElement('ul');
    listElement.classList.add('photoDetail')
    listElement.innerText = 'Image Details: ';

    var listElement__Item1 = document.createElement('li');
    listElement__Item1.classList.add('photoID')
    listElement__Item1.innerText = pixID;

    var listElement__Item2 = document.createElement('li');
    listElement__Item2.classList.add('photoTags')
    listElement__Item2.innerText = large;

    var listElement__Item3 = document.createElement('li');
    listElement__Item3.classList.add('photoPage')
    listElement__Item3.innerText = photoPage;

    //create close button
    var closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    listElement.appendChild(listElement__Item1);
    listElement.appendChild(listElement__Item2);
    listElement.appendChild(listElement__Item3);
    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(listElement);
    modal.appendChild(imgElement);
    modalContainer.addClass(modal);

    hideLoadingMessage(banner);

    //focus closeButton so that user can simply press Enter
    closeButtonElement.focus();

    modalContainer.addClass('is-visible');
  }

  function hideModal() {
    modalContainer.removeClass('is-visible');
  }

/* document.querySelector('#show-modal').addEventListener('click', () => {
    showModal('Modal Title', 'This is the modal content' );
  });  */

  //arrow function – Esc to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

  // Click outside modal on modal overlay will close modal
  modalContainer.on('click', (e) => {
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
  };
})();   // ----------------- END OF photoRepositoryIIFE -----------------

// ------------- Functions external to IIFE -----------------------

photoRepository.loadList().then(function() {            // this calls the data from API and then calls getAll
  photoRepository.getAll().forEach(function(photo){     //  getAll returns photo, followed by forEach loop, add to photoList array
    photoRepository.addListItem(photo);
  });
});

// -----------------Experiment --------------
