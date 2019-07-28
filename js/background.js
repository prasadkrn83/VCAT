//var commandList;


var tabDataStore = {};
 var msg;   
 var mismatchCount=0; 
 var currentURL="";
var generateTestcase=false;
var start;
var end;
var performance = window.performance;
var studyUsername="default";

function message(command,variable){
    this.command=command;
    this.variable=variable;
}


chrome.runtime.onInstalled.addListener(function() {
    console.log("VCAT installed..");



});

chrome.windows.onCreated.addListener(function() {

    openOptions();

});


function openOptions() {
    chrome.runtime.openOptionsPage();

}


chrome.tabs.onRemoved.addListener(function (tabId) {
    delete tabDataStore['tab_' + tabId];
});



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   //alert(changeInfo.url);

   if (changeInfo.status === "complete") {
    chrome.extension.getExtensionTabs();
    if(tab.url==undefined){
        return;
    }
        tabDataStore['tab_' + tabId].url.push(tab.url);

    }
}); 
chrome.tabs.onHighlighted.addListener(function (tabs){
    currentTabId = tabs.tabIds[0];
});

chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.vcat === "onoff" )
    {
        if(request.status){
            annyang.resume();
        }else{
            annyang.pause();
        }
    }

    else if( request.vcat === "setusername" )
    {
       studyUsername=request.username;
    }
});

chrome.tabs.onCreated.addListener(function(tabs) {

  

    let stack1 = new elementstack();
    let url1 = [];
     tabDataStore['tab_' + tabs.id] = {
        url: url1,
        stack:stack1
    };

    if (annyang && !annyang.isListening()) {
     
        var commands = {
            //'(computer) generate|begin|start|create|new test case': function() {
             '(computer) generate test case': function() {
            
                console.log('calling from command..generate test case ');
               generateTestcase=true;
               start=performance.now();
                chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){

                    var message = { type:'toast',message:'Generate Test Case'} 
                    chrome.tabs.sendMessage(tabs[0].id,message);
                });
            },
            '(computer) select all *type': function(type) {
                console.log('calling from command..select all '+type);
                var cmd = new Command();
                cmd.addCommandWord('select','command');
                cmd.addCommandWord('all','command');
                cmd.addCommandWord(matchToCommandList(type),'value');
                performAction(cmd);
            },
            /*'(computer) select link *desc': function(desc) {
                console.log('calling from command..select link '+desc);
                var cmd = new Command();
                cmd.addCommandWord('select','command');
                cmd.addCommandWord('link','command');
                cmd.addCommandWord(desc,'value');
                performAction(cmd);
            },*/
            '(computer) select (the) number *num': function(num){

                num=getnumber(num);
                console.log('calling from command..select number '+num);
                var cmd = new Command();
                cmd.addCommandWord('select','command');
                cmd.addCommandWord('number','command');
                cmd.addCommandWord(num,'value');
                performAction(cmd);
                
            },
            '(computer) deselect': function() {
                console.log('calling from command..deselect ');
                var cmd = new Command();
                cmd.addCommandWord('deselect','command');
                performAction(cmd);
            },
            '(computer) click (on) number *num': function(num){

                num=getnumber(num);
                console.log('calling from command..click link '+num);
                var cmd = new Command();
                cmd.addCommandWord('click','command');
                cmd.addCommandWord('number','command');
                cmd.addCommandWord(num,'value');
                performAction(cmd);
                
            },
             '(computer) click on *text': function(text){

                console.log('calling from command..click on '+text);
                var cmd = new Command();
                cmd.addCommandWord('click','command');
                cmd.addCommandWord('on','command');
                cmd.addCommandWord(text,'value');
                performAction(cmd);
                
            },
            
         /*   '(computer) click (on) (the) link *desc':function(desc){
                console.log('calling from command..click link '+desc);
                var cmd = new Command();
                cmd.addCommandWord('click','command');
                cmd.addCommandWord('link','command');
                cmd.addCommandWord(desc,'value');
                performAction(cmd);
            },*/
            '(computer) scroll page (to) *direction':function(direction){
                console.log('calling from command..scroll page '+direction);
                var cmd = new Command();
                cmd.addCommandWord('scroll','command');
                cmd.addCommandWord('page','command');
                cmd.addCommandWord(direction,'value');
                performAction(cmd);
            }, 
             '(computer) enter (the) value hash *keyname':function(keyname){
              console.log('calling from command..enter value hash '+keyname);
                 chrome.storage.sync.get('autoSaveList', function(result) {
                    var keyval=null;
                    for (var i = 1; i<result.autoSaveList.length; i++) {
                        if(result.autoSaveList[i].key==keyname){
                            keyval=result.autoSaveList[i].value;
                        }
                    }
                    if(keyval==null){
                        var message = { type:'toast',message:'Unable to identify Key.<br>Check if the key is configured correctly in the VCAT options page'} 
                    chrome.tabs.sendMessage(tabs[0].id,message);
                        return;
                    }

                    var cmd = new Command();
                    cmd.addCommandWord('enter','command');
                    cmd.addCommandWord('value','command');
                    cmd.addCommandWord(formatDate(keyval),'value');
                    performAction(cmd);
          
                });
                 
            },
            '(computer) enter (the) value *value':function(value){
              console.log('calling from command..enter value '+value);
                var cmd = new Command();
                cmd.addCommandWord('enter','command');
                cmd.addCommandWord('value','command');
                cmd.addCommandWord(formatDate(value),'value');
                performAction(cmd); 
            },
          
             '(computer) set (the) text as *value':function(value){
              console.log('calling from command..set text '+value);
                var cmd = new Command();
                cmd.addCommandWord('enter','command');
                cmd.addCommandWord('value','command');
                cmd.addCommandWord(formatDate(value),'value');
                performAction(cmd);  
            },
            '(computer) set *inputname as hash *value':function(inputname,value){
              console.log('calling from command..set input to '+value);
              chrome.storage.sync.get('autoSaveList', function(result) {
                    var keyval=null;
                    if(result.autoSaveList==undefined){
                        chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){
                             var message = { type:'toast',message:'Auto configuration not set.List is empty'} 
                            chrome.tabs.sendMessage(tabs[0].id,message);
                        });
                    }
                    for (var i = 1; i<result.autoSaveList.length; i++) {
                        if(result.autoSaveList[i].key==value){
                            keyval=result.autoSaveList[i].value;
                            break;
                        }
                    }
                    if(keyval==null){
                        chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){

                            var message = { type:'toast',message:'Unable to identify Key.<br>Check if the key is configured correctly in the VCAT options page'} 
                            chrome.tabs.sendMessage(tabs[0].id,message);
                        });
                        return;
                    }

                    var cmd = new Command();
                    cmd.addCommandWord('set','command');
                    cmd.addCommandWord(inputname,'value');
                    cmd.addCommandWord(keyval,'value');
                    performAction(cmd); 
                });
            },
             '(computer) set *inputname as *value':function(inputname,value){
              console.log('calling from command..set input to '+value);
                var cmd = new Command();
                cmd.addCommandWord('set','command');
                cmd.addCommandWord(inputname,'value');
                cmd.addCommandWord(value,'value');
                performAction(cmd); 
            },
            '(computer) open new tab':function(){
              console.log('calling from command..open new tab ');
               chrome.tabs.create({url:"chrome://newtab"});  
            },
            '(computer) open *url':function(url){
              console.log('calling from command..open url '+url);
                  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                         var tab = tabs[0];
                        chrome.tabs.update(tab.id, {url: getURL(url)});
              }); 
            },

            '(computer) refresh (page)(webpage)':function(){
              console.log('calling from command..refresh ');
                var cmd = new Command();
                cmd.addCommandWord('refresh','command');
                performAction(cmd); 
            },

            '(computer) (go) back':function(){
              console.log('calling from command..refresh ');
                var cmd = new Command();
                cmd.addCommandWord('back','command');
                performAction(cmd); 
            },
            '(computer) (go) forward':function(){
              console.log('calling from command..refresh ');
                var cmd = new Command();
                cmd.addCommandWord('forward','command');
                performAction(cmd); 
            },
            '(computer) close tab':function(){
              console.log('calling from command..close tab ');
                chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){
                    if((typeof tabs[0] === 'undefined') || (typeof tabs[0].title === 'undefined')){
                        console.log('not a webpage');
                        return;
                    }else{
                        chrome.tabs.remove(tabs[0].id);
                    }
                 });  
            },
            '(computer) close message':function(){
              console.log('calling from command..close message ');
               var cmd = new Command();
                cmd.addCommandWord('close','command');
                cmd.addCommandWord('message','command');
                performAction(cmd);
                 
            },
            '(computer) submit':function(){
              console.log('calling from command..close message ');
               var cmd = new Command();
                cmd.addCommandWord('submit','command');
                performAction(cmd);
                 
            },
              
            //'(computer) complete|end|finish|stop test case':function(){
             '(computer) complete test case':function(){
            
              console.log('calling from command..complete test case ');
              if(!generateTestcase){
                chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){

                    var message = { type:'toast',message:'Complete Test Case cannot be innitated without executing Generate Test Case!'} 
                    chrome.tabs.sendMessage(tabs[0].id,message);
                });
                return;

              }

              end = performance.now();
              var tabId=currentTabId;
              var url=tabDataStore['tab_' + tabId].url[0];
              var stack =tabDataStore['tab_' + tabId].stack;
              var newurl=[];
              newurl.push(tabDataStore['tab_' + tabId].url.pop());
              delete tabDataStore['tab_' + tabId];

              callVcatService(url,stack.getAllElements());

              generateTestcase=false;    
              stack = new elementstack();
              tabDataStore['tab_' + tabId] = {
                url: newurl,
                stack:stack
              };  
              
              chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){

                    var message = { type:'toast',message:'Complete Test Case'} 
                    chrome.tabs.sendMessage(tabs[0].id,message);

                    
              });

              
              
            },


            '(computer) add row':function(){
              console.log('calling from command..add row ');
                   chrome.runtime.sendMessage({command:'addrow'});
            },
            '(computer) save':function(){
              console.log('calling from command..save ');
                   chrome.runtime.sendMessage({command:'save'});
            },
            '(computer) delete row *num':function(num){
              console.log('calling from command..delete row '+num);
                   chrome.runtime.sendMessage({command:'delete',number:getnumber(num)});
            },
             '(computer) set key (to) *val':function(val){
              console.log('calling from command..set key to '+val);
                   chrome.runtime.sendMessage({command:'key',key:val});
            },
            '(computer) set value (to) *val':function(val){
              console.log('calling from command..set value '+val);
                   chrome.runtime.sendMessage({command:'value',value:val});
            },
            '(computer) select key number *val':function(val){
              console.log('calling from command..select key '+val);
                   chrome.runtime.sendMessage({command:'selectkey',number:getnumber(val)});
            },
            '(computer) select value number *val':function(val){
              console.log('calling from command..select value '+val);
                   chrome.runtime.sendMessage({command:'selectvalue',number:getnumber(val)});
            },
            '(computer) expand auto complete configuration':function(){
              console.log('calling from command..expand auto complete configuration');
                   chrome.runtime.sendMessage({command:'expandautocompelte'});
            }

        };

        annyang.addCommands(commands);
        annyang.debug();
        annyang.start({ autoRestart: true ,continuous:false});
     
        annyang.addCallback('soundstart', function() {
            console.log('sound detected');
            mismatchCount=0;
        });

      /*  annyang.addCallback('result',  function(phrases) {
            console.log('Speech recognized. Possible sentences said:');
            console.log(phrases);
        });*/
        annyang.addCallback('resultNoMatch', function(phrases) {

            console.log("I think the user said: ", phrases[0]);
            var inputStr  = phrases[0];
            var first="";
            console.log('called here...');
            console.log("But then again, it could be any of the following: ", phrases);
            console.log("No command matched yet..");
            if(mismatchCount>1){
                console.log("This is a retry of failed command... skipping..");
               // mismatchCount=0;
                return;
            }
            var possibleCommand = [];
            for (var i = 0; i < phrases.length; i++) { 
                phrases[i] = phrases[i].removeStopWords();
                 var words = phrases[i].split(' ');
                 if(words.length<3){
                    continue;
                 }
                 for (var j = 0; j<words.length;j++) {
                   words[j]=matchToCommandList(words[j]);
                 }
                 possibleCommand.push(words.join(' '));
                 console.log("possible command= ",possibleCommand);
                
            }
            if (possibleCommand === undefined || possibleCommand.length == 0) {
                    chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){

                    var message = { type:'error',message:'Unable to recognize command.'} 
                    chrome.tabs.sendMessage(tabs[0].id,message);
                    console.log("Unable to recognize command.");
                });
            }else{
                 mismatchCount++;
                 annyang.trigger(possibleCommand);

            }
            
        });
        annyang.addCallback('resultNoMatch', function(phrases) {
            mismatchCount=0;
        });
    }

});

function formatDate(str){

try{
    return $.datepicker.formatDate('mm/dd/yy',$.datepicker.parseDate( "dd MM yy", str ));
}catch(err){
    return str;
}
    
}


function matchToCommandList(phrase){
    var lemmatizedList = commandList.get(phrase);
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
   
    if(command[0]>0.4){
        return command[1];
    }else{
        return phrase;
    }
    
}
function performCommandCorrection(command,phrases){
    var correctedCommand = [];
    var commandWords = command.split(' ');
    var fuzzyWordsSet = FuzzySet(commandWords);
    var result;
    for (var i = 0; i < phrases.length; i++) { 
        var inputCommandWords = phrases[i].split(' ');
         for (var i = 0; i < inputCommandWords.length; i++) { 
                result = fuzzyWordsSet.get(inputCommandWords[i]);
                if((result[0][0]==0 || result[0][0]>0.5)&& !correctedCommand.includes(result[0][1])){
                    correctedCommand.push(result[0][1]);
                }
        }
    }
    return correctedCommand.toString().replace(/,/g, " ");

}

function performAction(command){

    mismatchCount=0;
    console.log(command.printList());
      
     var message = { command: command/*Str[0],type1:commandStr[1],type2:commandStr[2] ,idenstr:idenStr*/};
            chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){
                /*if(window.location.toString().includes(chrome.runtime.id)){
                    console.log('VCAT options page..');
                    //browser.runtime.getURL("options.html")
                    return;

                }else*/ if((typeof tabs[0] === 'undefined') || (typeof tabs[0].title === 'undefined')){
                    console.log('not a webpage');
                    return;
                }else{
                    chrome.tabs.sendMessage(tabs[0].id,message , function(response) {
                        console.log(response.message);

                        if(typeof response.message ==="object" ){
                            tabDataStore['tab_'+tabs[0].id].stack.push(response.message);
                        }
                        else if(response.message === 'success'){
                            action = 'success';
                             /*var m = new message('click number $','1');
                             performAction(m);
                        */}
                    });
                }
            }); 

}

function callVcatService(url,elements){
    var serviceUrl = "";
    chrome.storage.sync.get('remoteserver', function(result) {
        serviceUrl=result.remoteserver;
         $.ajax
    (
        {
            type: "POST",
            url: serviceUrl,
            dataType:"json",
            contentType: 'application/json',
            data:JSON.stringify( 
            {               
                url: url,
                os:platform.os.family,
                chromeversion:platform.version,
                executiontime: (end-start),
                username:studyUsername,
                elements
                
            }),
            success: function(msg)
            {
                chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){

                    var message = { type:'dialog',message:msg} 
                    chrome.tabs.sendMessage(tabs[0].id,message);
                    console.log("Testcase created");
                });
            },
            error :function(event, jqxhr, settings, thrownError){
                console.log(jqxhr);
                chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){

                    var message = { type:'error',message:'Failed to generate test case.<br>Check for correct remote server configurations in the VCAT options page'} 
                    chrome.tabs.sendMessage(tabs[0].id,message);
                    console.log("Testcase creation failed");
                });
            }
        }
    );
   });
    
}

function getnumber(num){

        switch(num) {
      case 'one':
        return 1;
        break;
      case 'two':
        return 2;
        break;
      case 'three':
        return 3;
        break;
      case 'four':
        return 4;
        break;
      case 'five':
        return 5;
        break;
      case 'six':
        return 6;
        break;
      case 'seven':
        return 7;
        break;
      case 'eight':
        return 8;
        break;
      case 'nine':
        return 9;
        break;
      default:
        return num;
    }

}

function getURL(url){
    var urlStr =  url.replace("dot", ".");
    if(urlStr.startsWith("www.")){
        urlStr="http://"+urlStr;
    }else{
        urlStr="http://www."+urlStr;
    }
    return urlStr;
}

