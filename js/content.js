debugger;
var scrollingElement ;
$( document ).ready(function() {
   
 scrollingElement = (document.scrollingElement || document.body)

   $.extend($.expr[":"], {
"containsIN": function(elem, i, match, array) {
return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
}
});

});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      var commandType = request.command.head;
      var selectedItem;
      var msg="success";

      chrome.storage.local.get('selectedItem', function (result) {
        selectedItem = result.selectedItem;
      });

      
      var i=0;

      if(commandType.value =="select"){
          performSelectActionOnPage(request.command);
      }else if(commandType.value=="click"){
          performClickActionOnPage(request.command);
      }else if(commandType.value=="scroll"){
          performScrollActionOnPage(request.command);
      }else if (commandType.value=="enter"){
        performEnterActionOnPage(request.command);
      }else if (commandType.value=="set"){
        performSetActionOnPage(request.command);
      }
      

        sendResponse({message: msg});

/*
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
          generateToast("Select number *<br>Click number *<br>Open number * in new tab<br>Open number *"+idenstr);

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
          identifier='#f'+idenstr;
          console.log(identifier);
          var path = getPathToElement($(identifier+" "+$(identifier).children()[1].localName
),idenstr);
          

          let element = new webelement();
          element.elementType=getIdentifiedElement($(identifier).children()[1].localName);
          element.elementXpath=path;
          element.elementAction='click';

          msg= element;
          $(identifier).children()[1].click();
        }else if (type1=='on'){
          
          var cmd =":containsIN("+idenstr+"):not(:has(:containsIN('"+idenstr+"')))";
          console.log(cmd);
            var tag=$(cmd).get(0);
            var tagName=tag.tagName;
            console.log(tag);

            var attr = tag.id;
            if (typeof attr !== typeof undefined && attr !== false && attr!=="") {
                // ...
              tag = document.querySelector('[aria-labelledby ="'+attr+'"]');
            }
            var path = getXPathTo(tag);
            console.log(path);
            tag.click();
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

        }else if(action=="set" && type1=="value" && selectedItem.is("input:text")){
            selectedItem.val(identifier);
        }
      

        sendResponse({message: msg});
*/    });

function performSelectActionOnPage(request){
        var i=0;
        var head = request.head;
        var commandType=head.next;
        var identifier= commandType.next;
        var elementIdentifier= getIdentifierString(identifier.value);
        if(commandType.value=="all"){
          chrome.storage.local.set({'selectedIdentifier': identifier.value}, function() {
          console.log('Value is set to ' + identifier.value);
        });
          $(elementIdentifier).each(function(index,item){

             i++;
             console.log(item);
             $(item).wrap("<fieldset id='f"+i+"'class='fldset-class'></fieldset>");
             $("#f"+i).prepend("<legend class='legend-class'>"+i+"</legend>");
       
          });
          generateToast("Select number *<br>Click number *<br>Open number * in new tab<br>Open number *"+identifier.value);

        }else if (commandType.value=="number"){
        
          var selectedIdentifier;
          chrome.storage.local.get('selectedIdentifier', function (result) {
            selectedIdentifier = result.selectedIdentifier;
            elementIdentifier='#f'+identifier.value+' '+getIdentifierString(selectedIdentifier);
            console.log(elementIdentifier);
           // var item=$(elementIdentifier)[0];
            chrome.storage.local.set({"selectedItem": elementIdentifier}, function() {
              console.log('Value is set to ' + elementIdentifier);
            });
          });
          /*elementIdentifier='#f'+identifier.value+' '+getIdentifierString(selectedIdentifier);
          console.log(elementIdentifier);
          var item=$(elementIdentifier)[0];*/
          

        }/*else{
         
          var item = $(identifier).filter(function(index) { return $(this).text().toLowerCase().indexOf(idenstr)>0; })[0];
          i++;
          item.wrap("<fieldset id='f"+i+"'class='fldset-class'></fieldset>");
             $("#f"+i).prepend("<legend class='legend-class'>"+i+"</legend>");
          chrome.storage.local.set({"selectedItem": item}, function() {
          console.log('Value is set to ' + item);
        });*/
        }


function performClickActionOnPage(request){
  var head = request.head;
   var commandType=head.next;
   var identifierStr= commandType.next;
   var identifier;
       
       if(commandType.value=='number'){
          identifier='#f'+identifierStr.value;
          console.log(identifier);
          var path = getPathToElement($(identifier+" "+$(identifier).children()[1].localName
),identifierStr.value);
          

          let element = new webelement();
          element.elementType=getIdentifiedElement($(identifier).children()[1].localName);
          element.elementXpath=path;
          element.elementAction='click';

          msg= element;
          $(identifier).children()[1].click();
        }else if (commandType.value=='on'){
          
            var tag= getElementIdentifiedByLabel(identifierStr);
            if(tag!==null){
              tag = tag.length>0?tag[0]:tag;
              var path = getXPathTo(tag);
              console.log(path);
              tag.click();
            }
        }
        else{
            var idenStr=getIdentifierString(commandType.value);
             $(idenStr).filter(function(index) { 
             console.log($(this).text());
             return $(this).text().toLowerCase().indexOf(identifierStr.value)>0; })[0].click();
           }       
}
function getElementIdentifiedByLabel(identifier){
    var tag=null;
   // tag = document.querySelector('[aria-label ="'+identifier.value+'" i]');
    
    tag = $('[aria-label*="'+identifier.value+'" i]');

    if(tag !== typeof undefined && tag !== null && tag.length!=0){
      return tag;
    }

    //var cmd ="*:containsIN("+identifier.value+"):not(:has(:containsIN('"+identifier.value+"')))";
    //console.log(cmd);
      //tag=$(cmd).eq(0);
      tag=getLabelByText(identifier.value);
      if(tag == typeof undefined || tag==null || tag.length==0){
        var cmd ="*:containsIN("+identifier.value+"):not(:has(:containsIN('"+identifier.value+"')))";
        console.log(cmd);
        tag=$(cmd).eq(0);
        
      }
      var tagName=tag.eq(0).prop('tagName');
      console.log(tag);
      if(tagName=='A'){
        return tag;
      }

      var attrId = tag.prop('id');
      var attrFor = tag.prop('for');
      if (typeof attrFor !== typeof undefined && attrFor !== false && attrFor!=="") {
      
        tag = $('#'+attrFor);
        return tag;

      }else if (typeof attrId !== typeof undefined && attrId !== false && attrId!=="") {
          // ...
        tag = document.querySelector('[aria-labelledby ="'+attrId+'"]');
        return tag;
      }
      
      tag = $('input[value*="'+identifier.value+'" i]');

      if(tag !== typeof undefined && tag !== null && tag.length!=0){
        return tag;
      }
}
function getLabelByText(labelStr) {
    var str;
    return $('label').filter(function(){
        str = $.trim(this.firstChild.nodeValue).trim();
        if(str=="" && this.firstElementChild!=null && this.firstElementChild!== typeof undefined ){
                str = $.trim(this.firstElementChild.innerText);
        }
        if(str.toLowerCase() === labelStr.toLowerCase()){
          return true;
        }
    });
}

function performScrollActionOnPage(request){
  var head = request.head;
   var commandType=head.next;
   var identifier= commandType.next;
  
        
  if(commandType.value=='page'){
    if(identifier.value=='top'){
      scrollSmoothToTop(true); 
    }else if(identifier.value=='end'){
      scrollSmoothToBottom(true); 
    }else if(identifier.value=='up'){
      scrollSmoothToTop(false); 
    }else if(identifier.value=='down'){
      scrollSmoothToBottom(false); 
    }
  }
  
}

function performEnterActionOnPage(request){
   var head = request.head;
   var commandType=head.next;
   var identifier= commandType.next;
       
  var selectedItem;
  chrome.storage.local.get('selectedItem', function (result) {
        selectedItem = result.selectedItem;
         var item=$(selectedItem)[0];
        $(selectedItem).eq(0).val(identifier.value);
        var e = jQuery.Event("keypress");
        e.which = 13; //choose the one you want
        $(selectedItem).eq(0).keypress(function(){
          alert('pressed enter');
        }).trigger(e)
        
      });

}

function performSetActionOnPage(request){
/* to do the set input identified by the label or placeholder*/
  var head = request.head;
  var identifier=head.next;
  var eleValue= identifier.next;


 var tag= getElementIdentifiedByLabel(identifier);
  if(tag!==null){
    tag.get(0).value=eleValue.value;
          
  }

}

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
    hideAfter : 5000,
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
      }else if(idenstr=="text input" || idenstr=="text box" || idenstr=="textbox"){
        identifier="input:text";
      }else if(idenstr=="radio button"){
        identifier="input:radio";
      }else if(idenstr=="check box"){
        identifier="input:checkbox";
      }else if(idenstr=="button"){
        identifier="button";
      }else{
        identifier=idenstr;
      }

      return identifier;
}

function getIdentifiedElement(idenstr){
      var identifier="";
      
      if(idenstr=="a"){
        identifier ="link";
      }else if (idenstr=="select"){
        identifier="drop down";
      }else if(idenstr=="input:text"){
        identifier="input field";
      }else if(idenstr=="input:radio"){
        identifier="radio";
      }else if(idenstr=="input:checkbox"){
        identifier="check box";
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

function getPathToElement(elem,index){
    var element = elem;
    element[0].previousElementSibling.remove();
    element.unwrap();
    var xpath=getXPathTo(element[0]);
    element.wrap("<fieldset id='f"+index+"'class='fldset-class'></fieldset>");
    $("#f"+index).prepend("<legend class='legend-class'>"+index.substring(1)+"</legend>");
    return xpath;
}

function getXPathTo(element) {
    if (element.id!=='' && !(element.id===undefined))
        return '//*[@id="'+element.id+'"]';
    if (element===document.body)
        return element.localName;

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        if (sibling===element)
            return getXPathTo(element.parentNode)+'/'+element.localName+'['+(ix+1)+']';
        if (sibling.nodeType===1 && sibling.localName===element.localName)
            ix++;
    }
}

