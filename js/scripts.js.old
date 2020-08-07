//  This is the main IIFE function containing all data //

var photoRepository = (function () {
  var photoAlbum = [];
  var apiUrl = 'https://pixabay.com/api/?key=17795524-3cd93801424773114b97b5b02&q=landscape+monochrome&image_type=photo';
  var banner = $('.dataLoading');
  var modalContainer = $('#modalContainer');

  // essential functions to access data within IIFE
  function add(photo) {
    photoAlbum.push(photo);
  }

  function getAll() {
    return photoAlbum;
  }

  // add Photo buttons
    function addListItem(photo) {
      var heroList = document.querySelector('.photo_List')
      var heroItem = document.createElement('li');
      var button = document.createElement('button');
      button.innerText = pokemon.name;
      button.classList.add('photoButton')
      heroItem.appendChild(button);
      heroList.appendChild(heroItem);
      buttonListen(button, photo);
    }

  function addListItem(photo) {
    var photoList = $('.photo_List');
    var photoItem = $('<li></li>');
    var photoButton = $('<button class="photoButton">photo.id</button>');
    $('photo_Item').append(photoButton);
    $('photo_List').append(photoItem);
    buttonListen(button, photo);
  }

  function showLoadingMessage(banner) {
    $('.dataLoading')
      .addClass('hideDataLoading');
  }

  function hideLoadingMessage(banner) {
    $('.dataLoading')
      .addClass('hideDataLoading');
  }

  //'fetch' primary photo data (id, character url)

  function loadList() {
    showLoadingMessage(banner);
    $.getJSON(apiUrl, function(data) {
      if (parseInt(data.totalHits) > 0)
      $.each(data.hits, function(i, hit){
        console.log(hit.id, hit.tags, hit.previewURL, hit.webformatURL, hit.largeImageURL)
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
  };


  function showDetails(photo) {
    loadDetails(photo).then(function () {
      showModal(
        photo.webSize,
        'Pixabay.com ID: ' + photo.id,
        'Search Tags: ' + photo.tags,
        'View Larger Image: ' + photo.largeImageURL,
        'Leave Comments: ' + photo.pageURL
      )
      console.log(photo);
    });
  }

  //creates event listener for each button
  function buttonListen(button, photo) {
    $('button'.on('click', function (event) {
      showDetails(photo);
    }));
  }

  // --- Modal Functions within photoRepository --------------

  function showModal(img, tags, pixID, large, photoPage) {

    modalContainer.innerHTML = '';
    var modal = $('<div class="modal"></div>');
    var imgElement = $('<img class="photoImage" alt="thumbnail" src = img>');
    var titleElement = $('<h1 class="modalTitle">tags</div>');
    var listElement = $('<ul class="photoDetail"></ul>');
    var listElement__Item1 = $('<li class="photoID">pixID</li>');
    var listElement__Item2 = $('<li class="photoTags">large</li>');
    var listElement__Item3 = $('<li class="photoPage">photoPage"</li>');

    //create close button
    var closeButtonElement = $('<button class="modal-close">Close</button>');
    $(closeButtonElement.on('click', hideModal));

    $('listElement')
      .append(listElement__Item1)
      .append(listElement__Item2)
      .append(listElement__Item3);
    $('modal')
      .append(titleElement)
      .append(closeButtonElement)
      .append(listElement)
      .append(imgElement);
    $('modalContainer').append(modal);

    //focus closeButton so that user can simply press Enter
    closeButtonElement.focus();

    $('modalContainer').addClass('is-visible');
  }

  function hideModal() {
    $('modalContainer').removeClass('is-visible');
  }

  $('#show-modal').on('click', () => {
    showModal('Modal Title', 'This is the modal content' )
    console.log('click');
  });

  $('window').on('keydown', (e) => {                 //  'Esc' event closes modal
    if (e.key === 'Escape' && $('modalContainer').hasClass('is-visible')) {
      hideModal();
    }
  });


  // Click outside modal on modal overlay will close modal
  $('modalContainer').on('click', (e) => {
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
    loadList: loadList
    // loadDetails: loadDetails
  };
})();

// ----------------- END OF photoRepositoryIIFE -----------------

// ------------- Functions external to IIFE -----------------------

photoRepository.loadList().then(function() {            // this calls the data from API and then calls getAll
  photoRepository.getAll().forEach(function(photo){   //  getAll returns photo, followed by forEach loop, add to photoList array
    photoRepository.addListItem(photo);
  });
});



// -----------------Experiment --------------
