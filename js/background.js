var commandsList;
var tabDataStore = {};
     


function message(command,variable){
    this.command=command;
    this.variable=variable;
}
chrome.runtime.onInstalled.addListener(function() {
    //this method is called when the extention is installed.
    //alert("installed");

     
       
});

chrome.windows.onCreated.addListener(function() {

    openOptions();
        commandsList = FuzzySet();
        commandsList.add("select all links");
        commandsList.add("select link");
        commandsList.add("click number");
        commandsList.add("select number");
        commandsList.add("click link");
        commandsList.add("scroll page up");
        commandsList.add("select page down");

   

});

var hello = function(tag) {
    alert("select button");
}

function openOptions() {
chrome.runtime.openOptionsPage();

    alert(commandsList);
//chrome.runtime.cl

    // chrome.app.window.create('vcat.html', {
    //     bounds: {
    //         'width': 1024,
    //         'height': 768
    //     }
    // });
}


chrome.tabs.onRemoved.addListener(function (tabId) {
    delete tabDataStore['tab_' + tabId];
});

chrome.tabs.onUpdated.addListener(function (tabId , info) {
  if (info.status === 'complete') {
    tabDataStore['tab_' + tabId].url.push(tab.url);
  }

  /* var url=tabDataStore['tab_' + tabId].url[0];
              var stack =tabDataStore['tab_' + tabId].stack;
              callVcatService(url,stack.getAllElements());
*/});

chrome.tabs.onCreated.addListener(function(tabs) {

    let stack1 = new elementstack();

  /*  let element = new webelement();
        element.elementType='button';
        element.elementXpath='//*[@id="main"]/div[1]/div/ul/li[27]/a';
        element.elementAction='click';
    stack1.push(element);*/
     tabDataStore['tab_' + tabs.id] = {
        url: [],
        stack:stack1
    };

    if (annyang && !annyang.isListening()) {
     
        var commands = {
            'select all *type': function(type) {
                console.log('calling from command..select all '+type);
                var m = new message('select all $',type);
                performAction(m);
            },
            'select link *desc': function(desc) {
                console.log('calling from command..select link '+desc);
                var m = new message('select link $',type);
                performAction(m);
            },
            'click number  *num': function(num){

                num=(num=='one')?1:num;
                console.log('calling from command..click link '+num);
                var m = new message('click number $',num);
                performAction(m);
                
            },
            'select number *num': function(num){

                num=(num=='one')?1:num;
                console.log('calling from command..select number '+num);
                var m = new message('select number $',num);
                performAction(m);
                
            }
            ,
            'click link *desc':function(desc){
                console.log('calling from command..click link '+desc);
                var m = new message('click link $',type);
                performAction(m);
            },
            'scroll page *direction':function(direction){
                console.log('calling from command..scroll page '+direction);
                var m = new message('scroll page $',direction);
                performAction(m);
            },
            'enter value *value':function(value){
              console.log('calling from command..enter value '+value);
                var m = new message('enter value $',value);
                performAction(m);  
            },
            'complete test case':function(){
              console.log('calling from command..complete test case ');
              var url=tabDataStore['tab_' + tab.id].url[0];
              var stack =tabDataStore['tab_' + tab.id].stack;
              callVcatService(url,stack);
              delete tabDataStore['tab_' + tabId];
              stack = new elementstack();
              tabDataStore['tab_' + tab.id] = {
                url: [],
                stack:stack
              };
            }


        };

        annyang.addCommands(commands);
        annyang.start({ autoRestart: true ,continuous:false});
     
        annyang.addCallback('soundstart', function() {
            console.log('sound detected');
        });

        annyang.addCallback('result', function() {
             console.log('sound stopped');
        });
        annyang.addCallback('resultNoMatch', function(phrases) {
            console.log("I think the user said: ", phrases[0]);
            var inputStr  = phrases[0];
            console.log('called here...');
          /*  var res = inputStr.split(" ");
      
            var message = { action: res[0],type1:res[1],type2:res[2] ,idenstr:null};
            chrome.tabs.query({ active: true,currentWindow: true }, function(tabs)             {
                if((typeof tabs[0] === 'undefined') || (typeof tabs[0].title === 'undefined')){
                    console.log('not a webpage');
                    return;
                }else{
                    chrome.tabs.sendMessage(tabs[0].id,message , function(response) {
                        console.log(response.message);
                    });
                }
            }); */ 
            console.log("But then again, it could be any of the following: ", phrases);
            console.log("No command matched yet..");
            var finalCommand=null;
            for (var i = 0; i < phrases.length; i++) { 
                finalCommand = matchToCommandList(finalCommand,phrases[i]);
            }

            if(finalCommand!=null){
                annyang.trigger(finalCommand[1]);
            }
            //performAction(inputStr);
          
            /*chrome.tabs.query({ active: true, windowType:"normal",currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id,message , function(response) {
                    console.log(response.message);
                });
            });*/
        });



    }

});

function matchToCommandList(finalCommand,phrase){
    var lemmatizedList = commandsList.get(phrase);
    var maxLemmaValue=0;
    var command="";

    if(lemmatizedList==null|| lemmatizedList=='undefined'){
        return null;
    }

    for (var i = 0; i < lemmatizedList.length; i++) { 
        if(maxLemmaValue<lemmatizedList[i][0]){
            maxLemmaValue = lemmatizedList[i][0];
            command=lemmatizedList[i];  
        }
    }
    if(finalCommand==null || finalCommand[0]>command[0]){
        return command;    
    }else{
        return finalCommand;
    }
    
}

function performAction(mess){

    var commandStr = mess.command.split(" ");
    idenStr=mess.variable;
    console.log(commandStr);
    console.log(idenStr);
      
     var message = { action: commandStr[0],type1:commandStr[1],type2:commandStr[2] ,idenstr:idenStr};
            chrome.tabs.query({ active: true,currentWindow: true }, function(tabs)             {
                if((typeof tabs[0] === 'undefined') || (typeof tabs[0].title === 'undefined')){
                    console.log('not a webpage');
                    return;
                }else{
                    chrome.tabs.sendMessage(tabs[0].id,message , function(response) {
                        console.log(response.message);

                        if(typeof response.message === 'element' ){
                            tabDataStore['tab_1'].stack.push(element);
                        }
                    });
                }
            }); 

}

function callVcatService(url,elements){

     $.ajax
    (
        {
            type: "POST",
            url: "http://localhost:8080/vcat/testcase",
            dataType:"json",
            contentType: 'application/json',
            data:JSON.stringify( 
            {               
                url: url,
                elements
                
            }),
            success: function(msg)
            {
                console.log("Testcase created");
            }//end function
        }
    );
}