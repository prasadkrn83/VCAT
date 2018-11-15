debugger;
var scrollingElement ;
$( document ).ready(function() {
   
 scrollingElement = (document.scrollingElement || document.body)

 
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
     // scrollSmoothToBottom(null,true);
$.toast({
    heading: 'Command suggestion',
    text: 'Select all links',
    icon: 'info'
});

scrollSmoothToBottom(null,false);

      var action = request.action;
      var type1  = request.type1;
      var type2 =  request.type2;
      var idenstr  =  request.idenstr;

      var identifier="";
      if(action =="select"){
        if(type1=="all"){
          if(type2=="links"){
            identifier ="a";
          }
          $(identifier).css({"border-color": "red", 
    "border-width":"3px", 
    "border-style":"solid"});
      
        }else{

          identifier = type2;
          $(identifier).filter(function(index) { return $(this).text().indexOf(idenstr)>0; })[0].css({"border-color": "red", 
    "border-width":"3px", 
    "border-style":"solid"});

        }
      }else if(action =="click"){
          identifier = type2;
         $(identifier).filter(function(index) { 
          console.log($(this).text());
          return $(this).text().indexOf(idenstr)>0; })[0].click();
      }

        sendResponse({message: "success"});
    });


//Require jQuery
function scrollSmoothToBottom (id,isToend) {
  var scrollval;
  if(isToend){
      scrollval = document.body.scrollHeight;
  }else{
      var currentPos = $(window).scrollTop();
      var halfHeight = $(window).height();
      scrollval = currentPos + halfHeight;
   }$(scrollingElement).animate({
      scrollTop: scrollval//document.body.scrollHeight
   }, 500);
}

//Require jQuery
function scrollSmoothToTop (id,isToTop) {
   $(scrollingElement).animate({
      scrollTop: 0
   }, 500);
}

function generateToast(message){
  $.toast({
    heading: 'Next Command suggestion',
    text: message,
    icon: 'info'
});
}
