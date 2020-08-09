//  This is the main IIFE function containing all data //

var photoRepository = (function () {
  var photoAlbum = [];
  var API_KEY = '17795524-3cd93801424773114b97b5b02';
  var CHOICE = 'architecture';

  // 'https://pixabay.com/api/?key='+API_KEY+'&q=landscape+monochrome&image_type=photo?';
  var apiUrl =
<<<<<<< Updated upstream
    'https://pixabay.com/api/?key=17795524-3cd93801424773114b97b5b02&q=landscape+monochrome&image_type=photo';
=======
    'https://pixabay.com/api/?key='+API_KEY+'&q='+CHOICE+'&image_type=photo?';
>>>>>>> Stashed changes
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
    var button = $(
      `<button style="font-size: 14px" class="photoButton">Pixabay ID: ${photo.pixID}</button>`
    );
    var thumbNail = $(
      `<img style="height:70px; margin: 0 auto" class="thumb" src="${photo.preview}">`);
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

  //fetch photo data - conventional JavaScript
    function loadList() {
     showLoadingMessage(banner);
     return fetch(apiUrl)
       .then(function (response) {
         return response.json();
       })
       .then(function (json) {
         json.hits.forEach(function (hit) {
           var photo = {
             pixID: hit.id,
             tags: hit.tags,
             preview: hit.previewURL,
             webSize: hit.webformatURL,
             largeImage: hit.largeImageURL,
             pageURL: hit.pageURL,
         };
         add(photo);
         hideLoadingMessage(banner);
       });
     })
     .catch(function (e) {
       hideLoadingMessage(banner);
       console.error(e);
     });
   }

  // Ajax function - jQuery
  /*function loadList(photo) {
    showLoadingMessage(banner);
    $.ajax(apiUrl, {
      dataType: 'json'
    }).then(function (data){
      if (parseInt(data.totalHits) > 0)
      $.each(data.hits, function(i, hit){
        console.log(hit.id, hit.tags, hit.previewURL, hit.webformatURL, hit.largeImageURL, hit.pageURL);
        var photo = {
          pixID: hit.id,
          tags: hit.tags,
          preview: hit.previewURL,
          webSize: hit.webformatURL,
          largeImage: hit.largeImageURL,
          pageURL: hit.pageURL,
        };
        add(photo);
        //  hideLoadingMessage(banner);
      })
      else {
        hideLoadingMessage(banner);
        console.log('No hits');
      };
    })
  }*/


  function showDetails(photo) {
    console.log(photo);
    showLoadingMessage(banner);
    showModal(
      photo.preview,
      photo.tags,
      photo.pixID,
      photo.webSize,
      photo.largeImage,
      photo.pageURL,
    );
    hideLoadingMessage(banner);
  }


//creates event listener for each button

  function buttonListen(button, photo) {
    button.on('click', function (event) {
      showDetails(photo);
    });
  }

  // --- Modal Functions within Photo Repository --------------

  function showModal(preview, tags, pixID, webSize, largeImage, pageURL) {

    modalContainer.innerHTML = ("");
    var modal = $('<div class="modal"></div>');
    var imgElement = $(
      `<img style="max-width:700px; display:grid" class="photoImage" alt="thumbnail" src ="${webSize}">`
    );
    var titleElement = $(`<h1 class="modalTitle">Search Tags: ${tags}</div>`);
    var listElement = $(`<ul class="photoDetail"></ul>`);
    var imageLink = $(`<a href="${largeImage}" target="_blank">View fullsize image<a>`);
    var pageLink = $(`<a href="${pageURL}" target="_blank">Leave Comment<a>`)
    var listElement__Item1 = $(`<li style="color:white" class="photoID">Pixabay ID: ${pixID}</li>`);
    var listElement__Item2 = $('<li class="photoHD"></li>');
    var listElement__Item3 = $(`<li class="photoComment"></li>`);

    //create close button
    var closeButtonElement = $('<button class="modal-close">Close</button>');
    closeButtonElement.on('click', hideModal);
    listElement__Item2.append(imageLink);
    listElement__Item3.append(pageLink);
    listElement               // Already jQuery defined.  No need for further $
      .append(listElement__Item1)
      .append(listElement__Item2)
      .append(listElement__Item3);
    modal                     //ditto
      .append(titleElement)
      .append(closeButtonElement)
      .append(listElement)
      .append(imgElement);
    modalContainer.append(modal);   //ditto

    //focus closeButton so that user can simply press Enter
    closeButtonElement.focus();

    modalContainer.addClass('is-visible');
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

photoRepository.loadList().then(function(photo) {
  // this calls the data from API and then calls getAll
  photoRepository.getAll().forEach(function(photo){
    //  getAll returns photo, followed by forEach loop, add to photoList array
    photoRepository.addListItem(photo);
  });
});

// -----------------Experiment --------------
