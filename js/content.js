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

    
      var action = request.action;
      var type1  = request.type1;
      var type2 =  request.type2;
      var idenstr  =  request.idenstr;
      var identifier=getIdentifierString(idenstr);
      var selectedItem;
      var selectedIdentifier;

      chrome.storage.local.get('selectedItem', function (result) {
        selectedItem = result.selectedItem;
      });
      chrome.storage.local.get('selectedIdentifier', function (result) {
        selectedIdentifier = result.selectedIdentifier;
      });
      
      var i=0;
      if(action =="select"){
        if(type1=="all"){
          chrome.storage.local.set({"selectedIdentifier": identifier}, function() {
          console.log('Value is set to ' + identifier);
        });
          $(identifier).each(function(index,item){

             i++;
             console.log(item);
             $(item).wrap("<fieldset id='f"+i+"'class='fldset-class'></fieldset>");
             $("#f"+i).prepend("<legend class='legend-class'>"+i+"</legend>");
       
      });
        }else if (type1=="number"){
          identifier='#f'+idenstr+' '+selectedIdentifier;
          console.log(identifier);
          var item=$(identifier)[0];
        }else{
         
          var item = $(identifier).filter(function(index) { return $(this).text().toLowerCase().indexOf(idenstr)>0; })[0];
          i++;
          item.wrap("<fieldset id='f"+i+"'class='fldset-class'></fieldset>");
             $("#f"+i).prepend("<legend class='legend-class'>"+i+"</legend>");
          chrome.storage.local.set({"selectedItem": item}, function() {
          console.log('Value is set to ' + item);
        });
        }
      }else if(action =="click"){
        if(type1=='number'){
          identifier='#f'+idenstr+' '+selectedIdentifier;
          console.log(identifier);
          $(identifier)[0].click();
        }
        else{
            if(type2!=null && type2=='$'){
              identifier=getIdentifierString(type1);
                 $(identifier).filter(function(index) { 
                 console.log($(this).text());
                 return $(this).text().toLowerCase().indexOf(idenstr)>0; })[0].click();
               }       
          }
        }else if(action=='scroll'){
          if(type1=='page'){
            if(type2=='$' && idenstr=='top'){
              scrollSmoothToTop(true); 
            }else if(type2=='$' &&  idenstr=='end'){
              scrollSmoothToBottom(true); 
            }else if(type2=='$' && idenstr=='up'){
              scrollSmoothToTop(false); 
            }else if(type2=='$' &&  idenstr=='down'){
              scrollSmoothToBottom(false); 
            }
          }
        }else if(action=="open")
        {
          if(type1="new tab"){
            openNewTab(null);
          }else if("new browser"){
            openNewBrowser(null);
          }

        }else if(action=="enter" && type1=="value" && selectedItem.is("input:text")){
            selectedItem.val(identifier);
        }
      

        sendResponse({message: "success"});
    });


function scrollSmoothToBottom (isToend) {
  var scrollval;
  if(isToend){
      scrollval = document.body.scrollHeight;
  }else{
      var currentPos = $(window).scrollTop();
      var halfHeight = $(window).height();
      scrollval = currentPos + halfHeight;
   }
   $(scrollingElement).animate({
      scrollTop: scrollval//document.body.scrollHeight
   }, 500);
}

function scrollSmoothToTop (isToTop) {
  var scrollval;
  if(isToTop){
      scrollval = 0;
  }else{
      var currentPos = $(window).scrollTop();
      var halfHeight = $(window).height();
      scrollval = currentPos - halfHeight;
   }
   $(scrollingElement).animate({
      scrollTop: scrollval
   }, 500);
}

function generateToast(message){
  $.toast({
    heading: 'Next Command suggestion',
    text: message,
    icon: 'info'
});
  }
function scrollSmoothToTopLeft(){
  scrollSmoothToTop(true);
$(scrollingElement).animate({
      scrollLeft:0
   }, 0);
  }

  function scrollSmoothToBottomRight(){
  scrollSmoothToBottom(true);
$(scrollingElement).animate({
      scrollLeft:$(document).outerWidth()
   }, 0);
  }
  function openLinkinNewTab(url){
    window.open(url, '_blank'); 
  }
  function closeWindow(){
    window.close();
  }
  function minimizeWindow(id){
    chrome.windows.update(id, { state: 'minimized' });
  }
  function maximizeWindow(id){
    chrome.windows.update(id, { state: 'maximized' });
  }
  function refreshPage(){
        location.reload();

  }
  function addToBookmark(url,title){

          chrome.bookmarks.create({'parentId': extensionsFolderId,
                               'title': title,
                               'url': url});

  }
  function openNewTab(link){
    if(link==null){
      chrome.tabs.create();
    }else{
      chrome.tabs.create({url:link});
    }
  }
function openNewBrowser(link){
    if(link==null){
      chrome.windows.create({CreateType:'normal'});
    }else{
      chrome.tabs.create({CreateType:'normal',url:link});
    }
  }

function getIdentifierString(idenstr){
      var identifier="";
      
      if(idenstr=="links"){
        identifier ="a";
      }else if (idenstr=="drop down" || idenstr == "list"){
        identifier="select";
      }else if(idenstr=="text input"){
        identifier="input:text";
      }else if(idenstr=="radio button"){
        identifier="'input:radio'";
      }else if(idenstr=="button"){
        identifier="button";
      }else{
        identifier=idenstr;
      }

      return identifier;
}
function maximizeWindow(id){
  chrome.windows.update(id,{state:"maximized"},function(windowUpdated){
    console.log("window maximized");
  });
}

function minimizeWindow(id){
  chrome.windows.update(id,{state:"minimized"},function(windowUpdated){
    console.log("window minimized");
  });
}
