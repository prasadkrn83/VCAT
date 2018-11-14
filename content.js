debugger;
$( document ).ready(function() {
   

 
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
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

//          $('a').filter(function(idenstr){
//     return this.innerHTML ==idenstr ;
// })

        


      //if (request.greeting == "hello")
        sendResponse({message: "success"});
    });
