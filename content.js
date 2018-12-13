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

      var identifier="";
      var i=0;
      if(action =="select"){
        if(type1=="all"){
          if(type2=="links"){
            identifier ="a";
          }else if (type2=="drop down" || type2 == "list"){
            identifier="select";
          }else if(type2="text input"){
            identifier="input[@type=\"text\"]";
          }else if(type2="radio button"){
            identifier="'input:radio'";
          }
          $(identifier).each(function(index,item){

             i++;
             console.log(item);
             $(item).wrap("<fieldset id='f"+i+"'class='fldset-class'></fieldset>");
             $("#f"+i).prepend("<legend class='legend-class'>"+i+"</legend>");
       
      });
        }else{
          if(type1=="link"){
            identifier ="a";
          }else if (type1=="drop down" || type1 == "list"){
            identifier="select";
          }else if(type1="text input"){
            identifier="input[@type=\"text\"]";
          }else if(type1="radio button"){
            identifier="'input:radio'";
          }
          $(identifier).filter(function(index) { return $(this).text().toLowerCase().indexOf(idenstr)>0; })[0].css({"border-color": "red", 
            "border-width":"3px", 
             "border-style":"solid"});
        }
      }else if(action =="click"){
        if(type1=='link'){
            if(type2!=null && type2==='number'){
                identifier='#f'+idenstr+' a';
                console.log(identifier);
                $(identifier)[0].click();
            }else if(type2!=null && type2=='$'){
               identifier = 'a';
                 $(identifier).filter(function(index) { 
                 console.log($(this).text());
                 return $(this).text().toLowerCase().indexOf(idenstr)>0; })[0].click();
               }       
          }
        }else if(action=='scroll'){
          if(type1=='page'){
            if(type2=='$' && idenstr=='up'){
              scrollSmoothToTop(true); 
            }else if(type2=='$' &&  idenstr=='down'){
              scrollSmoothToBottom(true); 
            }else if(type2=='up' && idenstr=='once'){
              scrollSmoothToTop(false); 
            }else if(type2=='down' &&  idenstr=='once'){
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

