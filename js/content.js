debugger;
var scrollingElement;
var currentFrom=null;

$(document).ready(function() {

    scrollingElement = (document.scrollingElement || document.body)

    $.extend($.expr[":"], {
        "containsIN": function(elem, i, match, array) {
            return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });

});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if(request.type!=null && request.type=='dialog'){
          showGeneratedCode(request.message.testcase);
          return;
        } else if(request.type!=null && request.type=='toast'){
          generateToast('Given Voice Command',request.message);
          return;
        }
        else if(request.type!=null && request.type=='error'){
          generateWarningToast('Error',request.message);
          return;
        }
        var commandType = request.command.head;
        var msg = "success";
        var current = commandType; 
        var cmd=current.value;

          // iterate to the end of the 
          // list 
          while (current.next) { 
              cmd = cmd + " "+ current.next.value;
              current=current.next; 
          } 
        generateToast('Given Voice Command',cmd);
        if (commandType.value == "select") {
            performSelectActionOnPage(request.command);
        }else if (commandType.value == "deselect") {
            chrome.storage.local.get('selectedIdentifier', function(result) {
                if(result.selectedIdentifier==undefined || result.selectedIdentifier==null){
                    return;
                }
                var selectedIdentifier = result.selectedIdentifier;
                performDeSelectActionOnPage(selectedIdentifier);
            });
        }else if (commandType.value == "click") {
            msg = performClickActionOnPage(request.command);
        } else if (commandType.value == "scroll") {
            performScrollActionOnPage(request.command);
        } else if (commandType.value == "enter") {
            msg = performEnterActionOnPage(request.command);
        } else if (commandType.value == "set") {
            msg = performSetActionOnPage(request.command);
        }else if (commandType.value == "open") {
            msg = performOpenURL(request.command);
        }else if(commandType.value=="refresh"){
            refreshPage();
        }else if(commandType.value=="back"){
            goBack();
        }else if(commandType.value=="forward"){
            goForward();
        }else if(commandType.value=="close"){
            closeMessage();
        }else if(commandType.value=="submit"){
            msg=performSubmitActionOnPage();
        }else{
            generateWarningToast("Failed to execute command","Failed to execute the command.<br>Retry!!","");

        }


        sendResponse({ message: msg });
    });
function showGeneratedCode(codeStr){
  /*codeStr = codeStr.replace(/\;/g, ';<br>');
  codeStr = codeStr.replace(/\{/g, '{<br>');
  codeStr = codeStr.replace(/\}/g, '}<br>');
*/
   codeStr="<pre class='language-java'><code class='language-java'>"+codeStr+"</code></pre>";
    $.jAlert({
      'title': 'Generated Selenium Test Case',
      'content': codeStr,
//      'theme':'blue',
      'size':'auto',
      'closeOnClick': true
  });

}

function performOpenURL(request) {
    var i = 0;
    var head = request.head;
    var commandType = head.next;
    var identifier = commandType.next;
    if(commandType.value==='url' && identifier.value!=null && identifier.value!=''){
        openLinkinNewTab(identifier.value);
    }

}
function performSubmitActionOnPage(){


        var form = $('form');
        if(currentFrom!=null){
            form=currentFrom;
        }
        if(form.length== undefined || !form.length>0){
            generateWarningToast("Failed to execute command","Unable to submit on page!!","");
            return "success";
        }

        var path = getXPathTo(form[0]);
        let element = new webelement();
        element.elementType = 'submit';
        element.elementXpath = path;
        element.elementAction = 'submit';

        msg = element;

        form.submit();

        return msg;
}
function performSelectActionOnPage(request) {
    var i = 0;
    var head = request.head;
    var commandType = head.next;
    var identifier = commandType.next;
    var elementIdentifier = getIdentifierString(identifier.value);
    if (commandType.value == "all") {
            chrome.storage.local.get('selectedIdentifier', function(result) {
                if(result.selectedIdentifier!=undefined || result.selectedIdentifier!=null){
                    try{
                        performDeSelectActionOnPage(result.selectedIdentifier);
                    }catch(err){
                        console.log(err);
                    }
                    chrome.storage.local.remove('selectedIdentifier');
                }
                
            chrome.storage.local.set({ 'selectedIdentifier': identifier.value }, function() {
                console.log('Value is set to ' + identifier.value);
            });
            $(elementIdentifier).each(function(index, item) {

                i++;
                //console.log(item);
                $(item).wrap("<fieldset id='f" + i + "'class='fldset-class'></fieldset>");
                $("#f" + i).prepend("<legend id='lg" + i + "'class='legend-class'>" + i + "</legend>");

            });
            if(i>0){
              generateToast("Next command suggestion","Select number *<br>Click number *<br>Set number to *" + identifier.value);
            }else{
              generateWarningToast("Failed to execute command","Failed to execute the command.<br>Retry!!","");

            }
        });
    } else if (commandType.value == "number") {

        var selectedIdentifier;
        chrome.storage.local.get('selectedIdentifier', function(result) {
            selectedIdentifier = result.selectedIdentifier;
            elementIdentifier = '#f' + identifier.value + ' ' + getIdentifierString(selectedIdentifier);
            console.log(elementIdentifier);
            $('#f'+identifier.value).addClass('selected-fldset-class').removeClass('fldset-class');
            $('#lg'+identifier.value).addClass('selected-legend-class').removeClass('legend-class');

            // var item=$(elementIdentifier)[0];
           /* chrome.storage.local.set({ "selectedItem": elementIdentifier }, function() {
                console.log('Value is set to ' + elementIdentifier);
            });*/
            localStorage.setItem("selectedItem",elementIdentifier);

        });
        /*elementIdentifier='#f'+identifier.value+' '+getIdentifierString(selectedIdentifier);
        console.log(elementIdentifier);
        var item=$(elementIdentifier)[0];*/


    }
    /*else{
             
              var item = $(identifier).filter(function(index) { return $(this).text().toLowerCase().indexOf(idenstr)>0; })[0];
              i++;
              item.wrap("<fieldset id='f"+i+"'class='fldset-class'></fieldset>");
                 $("#f"+i).prepend("<legend class='legend-class'>"+i+"</legend>");
              chrome.storage.local.set({"selectedItem": item}, function() {
              console.log('Value is set to ' + item);
            });*/
}

function performDeSelectActionOnPage(selectedIdentifier){
    try{
        var elementIdentifier = getIdentifierString(selectedIdentifier);
        i=1;
        $(elementIdentifier).each(function(index, item) {
            var identifier = '#f' + i;
            var element = $(identifier + " " + $(identifier).children()[1].localName);
            element[0].previousElementSibling.remove();
            element.unwrap();
            i++;
        });
    }catch(err){
        console.log(err);
    }
    chrome.storage.local.remove('selectedIdentifier');

}
function performClickActionOnPage(request) {
    var head = request.head;
    var commandType = head.next;
    var identifierStr = commandType.next;
    var identifier;

    if (commandType.value == 'number') {
        identifier = '#f' + identifierStr.value;
        console.log(identifier);
        var path = getPathToElement($(identifier + " " + $(identifier).children()[1].localName), identifierStr.value);


        let element = new webelement();
        element.elementType = getIdentifiedElement($(identifier).children()[1].localName, null);
        element.elementXpath = path;
        element.elementAction = 'click';

        msg = element;
        try{
            $(identifier).children()[1].click();
             }
      catch(err){
        console.log(err);
        generateWarningToast('Error','Failed to execute voice command!<br>Try again!');

      }
        return msg;
    } else if (commandType.value == 'on') {

        var tag = getElementIdentifiedByLabel(identifierStr);
        if (tag!= undefined && tag !== null) {
            tag = tag.length > 0 ? tag[0] : tag;
            var path = getXPathTo(tag);
            let element = new webelement();
            element.elementType = getIdentifiedElement(tag.localName, tag.getAttribute('type'));
            element.elementXpath = path;
            element.elementAction = 'click';
            console.log(path);
            try{
                tag.click();
                 }
              catch(err){
                console.log(err);
                generateWarningToast('Error','Failed to execute voice command!<br>Try again!');

              }
            return element;

        }else{
               generateWarningToast('Error','Failed to execute voice command!<br>Try again!');
        }
    }
    /* else{
         var idenStr=getIdentifierString(commandType.value);
          $(idenStr).filter(function(index) { 
          console.log($(this).text());
          return $(this).text().toLowerCase().indexOf(identifierStr.value)>0; })[0].click();
        }  */
}

function getElementIdentifiedByLabel(identifier) {
    var tag = null;
    // tag = document.querySelector('[aria-label ="'+identifier.value+'" i]');

    tag = $('[aria-label*="' + identifier.value + '" i]');

    if (tag !== typeof undefined && tag !== null && tag.length != 0) {
        return tag;
    }

    //var cmd ="*:containsIN("+identifier.value+"):not(:has(:containsIN('"+identifier.value+"')))";
    //console.log(cmd);
    //tag=$(cmd).eq(0);
    tag = getLabelByText(identifier.value);
    if (tag == typeof undefined || tag == null || tag.length == 0) {
        var cmd = "*:containsIN(" + identifier.value + "):not(:has(:containsIN('" + identifier.value + "')))";
        console.log(cmd);
        var tags = $(cmd);
        for(k=0;k<tags.length;k++){
            var tagName=tags.get(k).tagName;
            if(tags.get(k).tagName=='A' || tags.get(k).tagName=="INPUT" || tags.get(k).tagName=="BUTTON" || tags.get(k).tagName=="SUBMIT"){
                tag=tags.eq(k);
                break;
            }
        }

    }
    var tagName = tag.eq(0).prop('tagName');
    console.log(tag);
    if (tagName == 'A' || tagName == 'BUTTON') {
        return tag;
    }

    var attrId = tag.prop('id');
    var attrFor = tag.prop('for');
    if (typeof attrFor !== typeof undefined && attrFor !== false && attrFor !== "") {

        tag = $('#' + attrFor);
        return tag;

    } else if (typeof attrId !== typeof undefined && attrId !== false && attrId !== "") {
        // ...
        tag = document.querySelector('[aria-labelledby ="' + attrId + '"]');
        return $(tag);
    }

    tag = $('input[value*="' + identifier.value + '" i]');

    if (tag !== typeof undefined && tag !== null && tag.length != 0) {
        return tag;
    }
}

function getLabelByText(labelStr) {
    var str;
    return $('label').filter(function() {
        str = $.trim(this.firstChild.nodeValue).trim();
        if (str == "" && this.firstElementChild != null && this.firstElementChild !== typeof undefined) {
            str = $.trim(this.firstElementChild.innerText);
        }
        if (str.toLowerCase() === labelStr.toLowerCase()) {
            return true;
        }
    });
}

function performScrollActionOnPage(request) {
    var head = request.head;
    var commandType = head.next;
    var identifier = commandType.next;


    if (commandType.value == 'page') {
        if (identifier.value == 'top') {
            scrollSmoothToTop(true);
        } else if (identifier.value == 'end') {
            scrollSmoothToBottom(true);
        } else if (identifier.value == 'up') {
            scrollSmoothToTop(false);
        } else if (identifier.value == 'down') {
            scrollSmoothToBottom(false);
        }
    }

}

function performEnterActionOnPage(request) {
    var head = request.head;
    var commandType = head.next;
    var identifier = commandType.next;

    var selectedItem=localStorage.getItem("selectedItem");
    if(selectedItem==undefined || selectedItem==null || selectedItem==""){
        return null;
    }
   /* chrome.storage.local.get('selectedItem', function(result) {
        selectedItem = result.selectedItem;
   */     var item = $(selectedItem)[0];
        try{
            $(selectedItem).eq(0).val(identifier.value);
            var e = jQuery.Event("keypress");
            e.which = 13; //choose the one you want
            $(selectedItem).eq(0).keypress(function() {}).trigger(e)
            let element = new webelement();
            var path = getXPathTo($(selectedItem).get(0));
            currentFrom=$(selectedItem).closest("form");
            element.elementType = getIdentifiedElement($(selectedItem).get(0).tagName,$(selectedItem).get(0).getAttribute('type'));
            element.elementXpath = path;
            element.elementAction = 'set';
            element.elementValue = identifier.value;
            return element;
             }
          catch(err){
            console.log(err);
            generateWarningToast('Error','Failed to execute voice command!<br>Try again!');

          }
    //});

}

function performSetActionOnPage(request) {
    /* to do the set input identified by the label or placeholder*/
    var head = request.head;
    var identifier = head.next;
    var eleValue = identifier.next;


    var tag = getElementIdentifiedByLabel(identifier);
    if (tag !== null) {
      try{
        tag.get(0).value = eleValue.value;

        var path = getXPathTo(tag[0]);
        currentFrom=$(tag).closest("form");

        let element = new webelement();
        element.elementType = getIdentifiedElement(tag.get(0).tagName, tag.get(0).getAttribute('type'));
        element.elementXpath = path;
        element.elementAction = 'set';
        element.elementValue = eleValue.value;
        return element;
      }
      catch(err){
        console.log(err);
        generateWarningToast('Error','Failed to execute voice command!<br>Try again!');

      }
        
    }

}

function scrollSmoothToBottom(isToend) {
    var scrollval;
    if (isToend) {
        scrollval = document.body.scrollHeight;
    } else {
        var currentPos = $(window).scrollTop();
        var halfHeight = $(window).height();
        scrollval = currentPos + halfHeight;
    }
    $(scrollingElement).animate({
        scrollTop: scrollval //document.body.scrollHeight
    }, 500);
}

function scrollSmoothToTop(isToTop) {
    var scrollval;
    if (isToTop) {
        scrollval = 0;
    } else {
        var currentPos = $(window).scrollTop();
        var halfHeight = $(window).height();
        scrollval = currentPos - halfHeight;
    }
    $(scrollingElement).animate({
        scrollTop: scrollval
    }, 500);
}

function generateToast(heading,message) {
    $.toast({
        heading: heading,
        text: message,
        hideAfter: 5000,
        icon: 'info'
    });
}
function generateWarningToast(heading,message) {
    $.toast({
        heading: heading,
        text: message,
        hideAfter: 5000,
        icon: 'warning'
    });
}

function scrollSmoothToTopLeft() {
    scrollSmoothToTop(true);
    $(scrollingElement).animate({
        scrollLeft: 0
    }, 0);
}

function scrollSmoothToBottomRight() {
    scrollSmoothToBottom(true);
    $(scrollingElement).animate({
        scrollLeft: $(document).outerWidth()
    }, 0);
}

function openLinkinNewTab(url) {
    //window.open(url, '_blank');
    if(url.startsWith("www.")){
        location.href="http://"+url;
    }else{
        location.href="http://www."+url;
    }
}   

function closeWindow() {
    window.close();
}

function minimizeWindow(id) {
    chrome.windows.update(id, { state: 'minimized' });
}

function maximizeWindow(id) {
    chrome.windows.update(id, { state: 'maximized' });
}

function refreshPage() {
    location.reload();

}
function goBack(){
    window.history.back();

}
function goForward(){
      window.history.forward();
}

function addToBookmark(url, title) {

    chrome.bookmarks.create({
        'parentId': extensionsFolderId,
        'title': title,
        'url': url
    });

}

function openNewTab(link) {
    if (link == null) {
        chrome.tabs.create();
    } else {
        chrome.tabs.create({ url: link });
    }
}

function openNewBrowser(link) {
    if (link == null) {
        chrome.windows.create({ CreateType: 'normal' });
    } else {
        chrome.tabs.create({ CreateType: 'normal', url: link });
    }
}

function getIdentifierString(idenstr) {
    var identifier = "";

    if (idenstr == "links" || idenstr == "link") {
        identifier = "a";
    } else if (idenstr == "drop down" || idenstr == "list") {
        identifier = "select";
    } else if (idenstr == "text input" || idenstr == "text box" || idenstr == "textbox" || idenstr == "textboxs"|| idenstr == "text boxs") {
        identifier = "input:text";
    } else if (idenstr == "radio button" || idenstr == "radio") {
        identifier = "input:radio";
    } else if (idenstr == "check box" || idenstr == "checkbox") {
        identifier = "input:checkbox";
    } else if (idenstr == "button" || idenstr == "buttons") {
        identifier = "button";
    } else {
        identifier = idenstr;
    }

    return identifier;
}

function getIdentifiedElement(idenstr, type) {
    var identifier = "";

    if (idenstr == "a" || idenstr == "A") {
        identifier = "link";
    } else if (idenstr == "select") {
        identifier = "drop down";
    } else if (idenstr == "input:text" || 
        ((idenstr == "INPUT" || idenstr == "input") && type == 'text')) {
        identifier = "input field";
    }else if ((idenstr == "INPUT"|| idenstr == "input") && type == 'submit') {
        identifier = "submit";
    } else if (idenstr == "input:radio") {
        identifier = "radio";
    } else if (idenstr == "input:checkbox") {
        identifier = "check box";
    } else if (idenstr == "button") {
        identifier = "button";
    }else if (idenstr == "submit" || idenstr == "SUBMIT") {
        identifier = "submit";
    }
     else {
        identifier = idenstr;
    }

    return identifier;
}


function maximizeWindow(id) {
    chrome.windows.update(id, { state: "maximized" }, function(windowUpdated) {
        console.log("window maximized");
    });
}

function minimizeWindow(id) {
    chrome.windows.update(id, { state: "minimized" }, function(windowUpdated) {
        console.log("window minimized");
    });
}

function getPathToElement(elem, index) {
    var element = elem;
    element[0].previousElementSibling.remove();
    element.unwrap();
    var xpath = getXPathTo(element[0]);
    element.wrap("<fieldset id='f" + index + "' class='fldset-class'></fieldset>");
    $("#f" + index).prepend("<legend id='lg" + index + "' class='legend-class'>" + index + "</legend>");
    return xpath;
}

function getXPathTo(element) {
    if (element.id !== '' && !(element.id === undefined))
        return '//*[@id=\'' + element.id + '\']';
    if (element === document.body)
        return element.localName;

    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element)
            return getXPathTo(element.parentNode) + '/' + element.localName + '[' + (ix + 1) + ']';
        if (sibling.nodeType === 1 && sibling.localName === element.localName)
            ix++;
    }
}
function closeMessage(){
     $('.jAlert').closeAlert(true);
}