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

/*  //fetch photo data - conventional JavaScript
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
   }*/

  function loadList(photo) {
    showLoadingMessage(banner);
    $.ajax(apiUrl, {
      dataType: 'json'
    }).then(function (data){
      if (parseInt(data.totalHits) > 0)
      $.each(data.hits, function(i, hit){
        console.log(hit.id, hit.tags, hit.previewURL, hit.webformatURL, hit.largeImageURL);
        var photo = {
          id: hit.id,
          tags: hit.tags,
          preview: hit.previewURL,
          webSize: hit.webformatURL,
          image: hit.largeImageURL,
          pageURL: hit.pageURL
        };
        add(photo);
        //  hideLoadingMessage(banner);
      })
      else {
        hideLoadingMessage(banner);
        console.log('No hits');
      };
    })
  }


  function showDetails(photo) {
    showLoadingMessage(banner);
    showModal(photo.image, photo.tags, photo.pixID, photo.webSize, photo.pageURL);
    hideLoadingMessage(banner);
  }


//creates event listener for each button

  function buttonListen(button, photo) {
    $('modalContainer').on("click", 'button', function(e) {
      button.on('click', function (event) {
        showDetails(photo);
      });
    });
  };

  // --- Modal Functions within Photo Repository --------------

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
    modalContainer.removeClass('is-visible');
  }

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

photoRepository.loadList().then(function(photo) {            // this calls the data from API and then calls getAll
  photoRepository.getAll().forEach(function(photo){     //  getAll returns photo, followed by forEach loop, add to photoList array
    photoRepository.addListItem(photo);
  });
});

// -----------------Experiment --------------
