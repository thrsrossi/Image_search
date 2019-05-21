
$(document).ready(function(){

  $("#searchButton").on("click", function(event){
    event.preventDefault();

    //checking value from input field, to exclude special characters and empty inputs
    let regExSpecialCharacters = /^\s*[a-zA-Z0-9,\s]+\s*$/;
    if (!regExSpecialCharacters.test($("#searchInput").val())) {
      $(".error-message").text("Invalid input, please try again.");
      $("#searchInput").val("");
    } else if (regExSpecialCharacters.test($("#searchInput").val())) {
    
    let $searchInputValue = $("#searchInput").val();

    $(".row").empty();
    $(".error-message").empty();
    $("#searchInput").val("");

    $.getJSON("http://www.flickr.com/services/feeds/photos_public.gne?tags='" + $searchInputValue + "'&format=json&jsoncallback=?", function(result){
      console.log("success");

      if (result.items <= 0) {
        $(".error-message").text("No images matches your search.");
        console.log("failed");
      }
      
      $.each(result.items, function(index, element){

        let $column = $("<div>");
        let $imageUrl = element.media.m;
        let $img = $("<img>").attr("src", $imageUrl).attr("id", index).attr("alt", "Image from flickr with tag: " + $searchInputValue);
        
        let $media = $("<div>").addClass("image-container").append($img);

        $column.addClass("column").append($media);

        //if new search is done while on float page
        if ($(".row").hasClass("row-float")) {
          $column.addClass("column-float");
        }
        
        //show only 18 images to match the three column layout
        $(".row").append($column);
          if ( index === 17 ) {
            return false;
          }

      }); //loop through result from search and print to index

      //remove default behaviour of dialog
      $("#modal").dialog({ 
        autoOpen: false,
        resizable: false,
        draggable: false,
        modal: true
       });

      //open modal when clicking image
      $(document).on("click", ".image-container", function(event){
        event.preventDefault();

        //if modal has been open before, empty content before adding new
        $(".modal-image-div").empty();
        $(".modal-date-taken").empty();

        //get id from image clicked 
        let $imageId = event.target.id;

        
        $("#modal").dialog("open");

        //style dialog and overlay
        $(".ui-dialog").css("position", "fixed").css("margin", "0, auto").css("top", "50%").css("left", "50%").css("transform", "translate(-50%, -50%)").css("width", "auto");
        $(".ui-widget-overlay").css("opacity", "0.6").css("background-color", "#000");

        //media queries for when opening dialog in different window sizes
        if ($(window).width() <= 599){
          $(".ui-dialog").css("min-width", "75%");
        }	
        if ($(window).width() >= 600){	
          $(".ui-dialog").css("min-width", "60%");
        }
        if ($(window).width() >= 1000){	
          $(".ui-dialog").css("min-width", "40%");
        }	

        //get image clicked and date taken to show in dialog
        let $imageUrlModal = result.items[$imageId].media.m;
        let $dateTakenModal = result.items[$imageId].date_taken;

        let $imgModal = $("<img>").attr("src", $imageUrlModal).attr("alt", "Image from flickr with tag: " + $searchInputValue);
        let $dateFormatted = $dateTakenModal.substr(0,10);
        
        $(".modal-image-div").append($imgModal);
        $(".modal-date-taken").text("Date taken: " + $dateFormatted);
        
        
      }); //open modal and print content from image clicked

    }); //getjson
    

  }; //end else

  }); //searchbutton.onclick


  
  $(window).resize(function(event){
    event.preventDefault();
    if ($(window).width() <= 599){	
      $(".ui-dialog").css("min-width", "75%");
    }	
    if ($(window).width() >= 600){	
      $(".ui-dialog").css("min-width", "60%");
    }
    if ($(window).width() >= 1000){	
      $(".ui-dialog").css("min-width", "40%");
    }	
  }); //media queries for dialog


 
  $(document).on("click", "#toggle", function(event){
    event.preventDefault();

    //toggle text on button
    $(this).text($(this).text() == "Show with float" ? "Show with flex" : "Show with float");

    //toggle classes on elements that are affected by the different styling/display
    $(".wrapper").toggleClass("wrapper-float");
    $(".row").toggleClass("row-float");
    $(".column").toggleClass("column-float");
    $(".search-area").toggleClass("search-area-float");
    $(".center").toggleClass("center-float");
    $(".buttons-header").toggleClass("buttons-header-float");
    $("#searchButton").toggleClass("button-float");
    
  }); //show layout with float



  //clicking outside dialog will close dialog window
  $(document).on("click", ".ui-widget-overlay", function(event){
    event.preventDefault();
    $("#modal").dialog("close");
  });



}); //document.ready