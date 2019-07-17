var commandList;


var tabDataStore = {};
 var msg;   
 var mismatchCount=0; 
 var currentTabId;
var generateTestcase=false;
var start;
var end;
var performance = window.performance;

function callAnnyangCommand(command){
    msg=command;
   
}

function message(command,variable){
    this.command=command;
    this.variable=variable;
}
chrome.runtime.onInstalled.addListener(function() {
    //this method is called when the extention is installed.
    //alert("installed");
        commandList = FuzzySet();
        commandList.add("select");
        commandList.add("click");
        commandList.add("scroll");
        commandList.add("complete");
        commandList.add("all");
        commandList.add("link");
        commandList.add("links");
        commandList.add("button");
        commandList.add("buttons");
        commandList.add("number");
        commandList.add("page");
        commandList.add("up");
        commandList.add("down");
        commandList.add("test");
        commandList.add("case");
        commandList.add("text input");
        commandList.add("text box");
        commandList.add("textbox");
        commandList.add("generate");



});

chrome.windows.onCreated.addListener(function() {

    openOptions();
        commandList = FuzzySet();
        commandList.add("select");
        commandList.add("click");
        commandList.add("scroll");
        commandList.add("complete");
        commandList.add("all");
        commandList.add("link");
        commandList.add("links");
        commandList.add("button");
        commandList.add("buttons");
        commandList.add("number");
        commandList.add("page");
        commandList.add("up");
        commandList.add("down");
        commandList.add("test");
        commandList.add("case");
        commandList.add("text input");
        commandList.add("text box");
        commandList.add("textbox");
        commandList.add("generate");

      

});

var hello = function(tag) {
    alert("select button");
}

function openOptions() {
chrome.runtime.openOptionsPage();

    alert(commandsList);
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
chrome.tabs.onCreated.addListener(function(tabs) {

        commandList = FuzzySet();
        commandList.add("select");
        commandList.add("click");
        commandList.add("scroll");
        commandList.add("complete");
        commandList.add("all");
        commandList.add("link");
        commandList.add("links");
        commandList.add("button");
        commandList.add("buttons");
        commandList.add("number");
        commandList.add("page");
        commandList.add("up");
        commandList.add("down");
        commandList.add("test");
        commandList.add("case");
        commandList.add("text input");
        commandList.add("text box");
        commandList.add("textbox");
        commandList.add("generate");

    let stack1 = new elementstack();
    let url1 = [];
     tabDataStore['tab_' + tabs.id] = {
        url: url1,
        stack:stack1
    };

    if (annyang && !annyang.isListening()) {
     
        var commands = {
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
               // var m = new message('select all $',type);
                var cmd = new Command();
                cmd.addCommandWord('select','command');
                cmd.addCommandWord('all','command');
                cmd.addCommandWord(matchToCommandList(type),'value');
                performAction(cmd);
            },
            '(computer) select link *desc': function(desc) {
                console.log('calling from command..select link '+desc);
                /*var m = new message('select link $',type);
                performAction(m);*/
                var cmd = new Command();
                cmd.addCommandWord('select','command');
                cmd.addCommandWord('link','command');
                cmd.addCommandWord(desc,'value');
                performAction(cmd);
            },
            '(computer) select number *num': function(num){

                num=getnumber(num);
                console.log('calling from command..select number '+num);
                /*var m = new message('select number $',num);
                performAction(m);*/
                var cmd = new Command();
                cmd.addCommandWord('select','command');
                cmd.addCommandWord('number','command');
                cmd.addCommandWord(num,'value');
                performAction(cmd);
                
            },
            '(computer) click number *num': function(num){

                num=getnumber(num);
                console.log('calling from command..click link '+num);
                /*var m = new message('click number $',num);
                performAction(m);*/
                var cmd = new Command();
                cmd.addCommandWord('click','command');
                cmd.addCommandWord('number','command');
                cmd.addCommandWord(num,'value');
                performAction(cmd);
                
            },
             '(computer) click on *text': function(text){

                console.log('calling from command..click on '+text);
                // var m = new message('click on $',text);
                // performAction(m);
                var cmd = new Command();
                cmd.addCommandWord('click','command');
                cmd.addCommandWord('on','command');
                cmd.addCommandWord(text,'value');
                performAction(cmd);
                
            },
            
            '(computer) click link *desc':function(desc){
                console.log('calling from command..click link '+desc);
                /*var m = new message('click link $',type);
                performAction(m);*/
                var cmd = new Command();
                cmd.addCommandWord('click','command');
                cmd.addCommandWord('link','command');
                cmd.addCommandWord(desc,'value');
                performAction(cmd);
            },
            '(computer) scroll page *direction':function(direction){
                console.log('calling from command..scroll page '+direction);
                /*var m = new message('scroll page $',direction);
                performAction(m);*/
                var cmd = new Command();
                cmd.addCommandWord('scroll','command');
                cmd.addCommandWord('page','command');
                cmd.addCommandWord(direction,'value');
                performAction(cmd);
            },
            '(computer) enter value *value':function(value){
              console.log('calling from command..enter value '+value);
                /*var m = new message('enter value $',value);
                performAction(m); */
                var cmd = new Command();
                cmd.addCommandWord('enter','command');
                cmd.addCommandWord('value','command');
                cmd.addCommandWord(formatDate(value),'value');
                performAction(cmd); 
            },
             '(computer) set text as *value':function(value){
              console.log('calling from command..set text '+value);
               /* var m = new message('set value $',value);
                performAction(m);*/
                var cmd = new Command();
                cmd.addCommandWord('enter','command');
                cmd.addCommandWord('value','command');
                cmd.addCommandWord(formatDate(value),'value');
                performAction(cmd);  
            },
             '(computer) set *inputname as *value':function(inputname,value){
              console.log('calling from command..set input to '+value);
                /*var m = new message('set value to number $',value);
                performAction(m); */
                var cmd = new Command();
                cmd.addCommandWord('set','command');
                cmd.addCommandWord(inputname,'value');
                cmd.addCommandWord(value,'value');
                performAction(cmd); 
            },
             '(computer) perform *inputname for *value':function(inputname,value){
              console.log('calling from command..set input to '+value);
                /*var m = new message('set value to number $',value);
                performAction(m); */
                var cmd = new Command();
                cmd.addCommandWord('set','command');
                cmd.addCommandWord(inputname,'value');
                cmd.addCommandWord(value,'value');
                performAction(cmd); 
            },
            '(computer) complete test case':function(){
              console.log('calling from command..complete test case ');
              if(!generateTestcase){
                chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){

                    var message = { type:'toast',message:'Complete Test Case cannot be innitated without executing Generate Test Case!'} 
                    chrome.tabs.sendMessage(tabs[0].id,message);
                });
                return;

              }

              chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){

                    var message = { type:'toast',message:'Complete Test Case'} 
                    chrome.tabs.sendMessage(tabs[0].id,message);
                });

              
              var tabId=currentTabId;
              end = performance.now();
              var url=tabDataStore['tab_' + tabId].url[0];
              var stack =tabDataStore['tab_' + tabId].stack;
              callVcatService(url,stack.getAllElements());
              delete tabDataStore['tab_' + tabId];
              stack = new elementstack();
              tabDataStore['tab_' + tabId] = {
                url: url,
                stack:stack
              };
              generateTestcase=false;
            }

        };

        annyang.addCommands(commands);
        annyang.debug();
        //annyang.setLanguage('en-IN');
        annyang.start({ autoRestart: true ,continuous:false});
     
        annyang.addCallback('soundstart', function() {
            console.log('sound detected');
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
            if(mismatchCount==1){
                mismatchCount=0;
                return;
            }

            for (var i = 0; i < phrases.length; i++) { 
                phrases[i] = phrases[i].removeStopWords();
                 var words = phrases[i].split(' ');
                 if(words.length<3){
                    continue;
                 }
                 words[0]=matchToCommandList(words[0]);
                 words[1]=matchToCommandList(words[1]);
                 words[2]=matchToCommandList(words[2]);
                 var possibleCommand = words.join(' ');
                 console.log("possible command= ",possibleCommand);
                 mismatchCount++;
                 annyang.trigger(possibleCommand);

            }
        
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
        return null;
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
    var url = "";
    chrome.storage.sync.get('remoteserver', function(result) {
        url=result.remoteserver;
         $.ajax
    (
        {
            type: "POST",
            url: url,
            dataType:"json",
            contentType: 'application/json',
            data:JSON.stringify( 
            {               
                url: url,
                os:platform.os.family,
                chromeversion:platform.version,
                executiontime: (end-start),
                elements
                
            }),
            success: function(msg)
            {
                chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){

                    var message = { type:'dialog',message:msg} 
                    chrome.tabs.sendMessage(tabs[0].id,message);
                    console.log("Testcase created");
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

