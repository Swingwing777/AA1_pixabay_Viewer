//  This is the main IIFE function containing all data //

var photoRepository = (function () {
  var photoAlbum = [];
  var API_KEY = '17795524-3cd93801424773114b97b5b02';

  var banner1 = $('.dataLoading');
  var banner2 = $('.hideNoHits');
  var buttonReopen = $('#modalReopen');
  var modalContainer = $('.modalHere');

  //This adds each photo to photoAlbum (and rebuilds button if cleared by showDetails())
  function add(photo) {
    photoAlbum.push(photo);
    addListItem(photo);
  }

  //This returns completed photoAlbum
  function getAll() {
    return photoAlbum;
  }

  // add Photo buttons

  function addListItem(photo){
    var photoRow = $('.row')
    var photoButton = $(
      `<button
      style="background-image: url(${photo.preview});
        background-size:cover;
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

  // Loading and No Hits messages

  function showLoadingMessage(banner1) {
    banner1.removeClass('hideDataLoading');
  }

  function hideLoadingMessage(banner1) {
    banner1.addClass('hideDataLoading');
  }

  function showNoMatches(banner2)  {
    banner2.addClass('noHits');
    buttonReopen.addClass('disabled')
  }

  function hideNoMatches(banner2)  {
    banner2.removeClass('noHits');
    buttonReopen.removeClass('disabled');
  }

  // Ajax function - jQuery
  function loadList(userChoice = 'landscape+monochrome') {
    showLoadingMessage(banner1);
    hideNoMatches(banner2);

    var apiUrlChoice =
      `https://pixabay.com/api/?key=${API_KEY}&per_page=60&q=${userChoice}&image_type=photo?`;

    return $.ajax(apiUrlChoice, {
      dataType: 'json',
    }).then(function (data){
      if (parseInt(data.totalHits) > 0)  {
        photoAlbum = [];
        $('.row').html('');
        $.each(data.hits, function(i, hit) {
          var photo = {
            pixID: hit.id,
            tags: hit.tags,
            preview: hit.previewURL,
            webSize: hit.webformatURL,
            largeImage: hit.largeImageURL,
            pageURL: hit.pageURL,
          };
          add(photo);
          hideLoadingMessage(banner1);
        });
      } else {
          photoAlbum = [];
          $('.row').html('');
          hideLoadingMessage(banner1);
          showNoMatches(banner2);
       }
    });
  }

  function showDetails(photo) {
    hideModal();
    showLoadingMessage(banner1);
    hideNoMatches(banner2);
    showModal(
      photo.preview,
      photo.tags,
      photo.pixID,
      photo.webSize,
      photo.largeImage,
      photo.pageURL
    );
    hideLoadingMessage(banner1);
  }


  //Function needed to clean out modal between consecutive showDetails requests
  function hideModal() {
    modalContainer.removeClass('is-visible');
    modalContainer.empty();
  }

//creates event listener for each button.  Cannot use Bootstrap built-in as loads all with addListitem

  function buttonListen(button, photo) {
    button.on('click', function () {
      showDetails(photo);
    });
  }

  // --- Modal Functions within Photo Repository --------------

  function showModal(preview, tags, pixID, webSize, largeImage, pageURL) {
    modalContainer.HTML = ('');
    var modalFade = $('<div class="modal fade" id="photoModal" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modalTitle"></div>');
    var modalDialog = $('<div class="modal-dialog" role="document"></div>');
    var modalContent = $('<div class="modal-content" id="modalWindow"></div>');
    var modalHeader = $('<div class="modal-header"></div>');
    var modalTitle = $(`<h1 id="modalTitle" class="modal-title">Search Tags: ${tags}</h1>`);
    var modalCloseSymbol = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
    var modalBody = $('<div class="modal-body list-group"></div>');
    var pixIDNum = $(`<h3 class="list-group-item" style="color:#0a0091">Pixabay ID: ${pixID}</h3>`);
    var imageLink = $(`<a class="list-group-item" href="${largeImage}" target="_blank">View fullsize image</a>`);
    var pageLink = $(`<a class="list-group-item" href="${pageURL}" target="_blank">Leave comment</a>`);
    var imgElement = $(`<img style="max-width:700px height:auto" class="photoImage" alt="Larger image" src ="${webSize}">`);
    var modalFooter = $('<div class="modal-footer"></div>');
    var modalClose = $('<button class="btn modal-close" data-dismiss="modal">Close</button>');

    modalFooter.append(modalClose);
    modalBody
      .append(pixIDNum)
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
    e.preventDefault(); //stop default action of the button to avoid page reload
    var userChoice = $('#userChoice').val();
    loadList(userChoice);
  });

  $(window).on('keydown', function (e) {
    if (e.key === 'Enter') {
    e.preventDefault(); //stop default action of the button to avoid page reload
    var userChoice = $('#userChoice').val();
    loadList(userChoice);
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

photoRepository.loadList().then(function() {
  // this calls the data from API and then calls getAll
  photoRepository.getAll().forEach(function(photo){
    //  getAll returns photo, followed by forEach loop, add to photoList array
    photoRepository.addListItem(photo);
  });
});
