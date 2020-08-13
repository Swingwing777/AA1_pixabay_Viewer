//  This is the main IIFE function containing all data //

var photoRepository = (function () {
  var photoAlbum = [];
  var API_KEY = '17795524-3cd93801424773114b97b5b02';
  var userChoice = $('#userChoice').val();        // Ebere, why am I failing to use input field value in apiUrlChoice?  Browser just goes straight to default.
  //userChoice = 'mountains';                     // Hard-wiring userChoice to a string works.
  var apiUrlDefault =
   'https://pixabay.com/api/?key='+API_KEY+'&per_page=40&q=landscape+monochrome&image_type=photo?';
  var apiUrlChoice =
    'https://pixabay.com/api/?key='+API_KEY+'&per_page=40&q='+`${userChoice}`+'&image_type=photo?';
  var banner = $('.dataLoading');
  var modalContainer = $('.modalHere');


  // essential functions to access data within IIFE
  function add(photo) {
    photoAlbum.push(photo);
  }

  function getAll() {
    return photoAlbum;
  }

  // add Photo buttons

  function addListItem(photo){
    var photoRow = $('.row')
    var photoButton = $(
      `<button
      style="background-image: url(${photo.preview});
        background-size:contain;
        background-repeat: no-repeat;"
      type="button"
      data-toggle="modal"
      data-target="#photoModal"
      class="btn photoButton
       text-right
       col-sm-2
       m-lg-3">
      Pixabay ID:<br>${photo.pixID}
      </button>`
    );
    photoRow.append(photoButton);
    buttonListen(photoButton, photo);
  }

  function showLoadingMessage(banner) {
    banner.removeClass('hideDataLoading');
  }

  function hideLoadingMessage(banner) {
    banner.addClass('hideDataLoading');
  }

  // Ajax function - jQuery
  function loadList(userChoice) {
    showLoadingMessage(banner);

    // if (userChoice === undefined) - causes
    // API to download its own defaul selection rather than my default choice?
    if (!userChoice) {
      return $.ajax(apiUrlDefault, {
        dataType: 'json'
      }).then(function (data){
        if (parseInt(data.totalHits) > 0)
        $.each(data.hits, function(i, hit){
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
        })
        else {
          hideLoadingMessage(banner);
          console.log('No hits');
        };
      })
    }else{
      return $.ajax(apiUrlChoice, {
        dataType: 'json'
      }).then(function (data){
        if (parseInt(data.totalHits) > 0)
        $.each(data.hits, function(i, hit){
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
        })
        else {
          hideLoadingMessage(banner);
          console.log('No hits');
        };
      })
    }
  }

  function showDetails(photo) {
    console.log(photo);
    hideModal();
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


  //Function needed to clean out modal between consecutive showDetails requests
  function hideModal() {
    modalContainer.removeClass('is-visible');
    modalContainer.empty();
  }

//creates event listener for each button.  Cannot use Bootstrap built-in as loads all with addListitem

  function buttonListen(button, photo) {
    button.on('click', function (event) {
      showDetails(photo);
    });
  }

  // --- Modal Functions within Photo Repository --------------

  function showModal(preview, tags, pixID, webSize, largeImage, pageURL) {
    modalContainer.HTML = ("");
    var modalFade = $('<div class="modal fade" id="photoModal" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modalTitle"></div>');
    var modalDialog = $('<div class="modal-dialog" role="document"></div>');
    var modalContent = $('<div class="modal-content" id="modalWindow"></div>');
    var modalHeader = $('<div class="modal-header"></div>');
    var modalTitle = $(`<h1 id="modalTitle" class="modal-title">Search Tags: ${tags}</h1>`);
    var modalCloseSymbol = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
    var modalBody = $(`<div class="modal-body list-group"></div>`);
    var pixID = $(`<h3 class="list-group-item" style="color:#0a0091">Pixabay ID: ${pixID}</h3>`);
    var imageLink = $(`<a class="list-group-item" href="${largeImage}" target="_blank">View fullsize image</a>`);
    var pageLink = $(`<a class="list-group-item" href="${pageURL}" target="_blank">Leave comment</a>`);
    var imgElement = $(`<img style="max-width:700px" class="photoImage" alt="Larger image" src ="${webSize}">`);
    var modalFooter = $('<div class="modal-footer"></div>');
    var modalClose = $(`<button class="btn modal-close" data-dismiss="modal">Close</button>`);

    modalFooter.append(modalClose);
    modalBody
      .append(pixID)
      .append(imageLink)
      .append(pageLink)
      .append(imgElement);
    modalHeader
      .append(modalTitle)
      .append(modalCloseSymbol);
    modalContent
      .append(modalHeader)
      .append(modalBody)
      .append(modalFooter);
    modalDialog.append(modalContent);
    modalFade.append(modalDialog);
    modalContainer.append(modalFade);
  }

  $('#submitButton').on('click', function (e) {
    userChoice = $('#submitButton');
    alert('Your choice is: ' + $('#userChoice').val())   // this is just to check for now that I'm getting a value from the input box
    loadlist(userChoice);
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

photoRepository.loadList(userChoice).then(function(photo) {
  // this calls the data from API and then calls getAll
  photoRepository.getAll().forEach(function(photo){
    //  getAll returns photo, followed by forEach loop, add to photoList array
    photoRepository.addListItem(photo);
  });
});

// -----------------Experiment --------------
