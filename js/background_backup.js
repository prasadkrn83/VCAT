var commandsList;
var tabDataStore = {};
 var msg;   
 var mismatchCount=0; 
 var currentTabId;

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
        commandsList = FuzzySet();
        commandsList.add("select all links");
        commandsList.add("select link");
        commandsList.add("click number");
        commandsList.add("select number");
        commandsList.add("click link");
        commandsList.add("scroll page up");
        commandsList.add("select page down");
        commandsList.add("complete test case");

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
        commandsList.add("complete test case");

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

/*chrome.tabs.onUpdated.addListener(function (tabId , info) {
  if (info.status === 'complete') {
    tabDataStore['tab_' + tabId].url.push(tab.url);
    annyang.trigger(msg);
  }

  });*/

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   //alert(changeInfo.url);

   if (changeInfo.status === "complete") {
    chrome.extension.getExtensionTabs();
    if(tab.url==undefined){
        return;
    }
    tabDataStore['tab_' + tabId].url.push(tab.url);
    //annyang.trigger(msg);
    /*var m = new message('select all $','links');
    performAction(m);
    var m = new message('click number $','1');
    performAction(m);
  */}
}); 
chrome.tabs.onHighlighted.addListener(function (tabs){
    currentTabId = tabs.tabIds[0];
});
chrome.tabs.onCreated.addListener(function(tabs) {

        commandsList = FuzzySet();
        commandsList.add("select all links");
        commandsList.add("select link");
        commandsList.add("click number");
        commandsList.add("select number");
        commandsList.add("click link");
        commandsList.add("scroll page up");
        commandsList.add("select page down");
        commandsList.add("complete test case");

    let stack1 = new elementstack();
    let url1 = [];
     tabDataStore['tab_' + tabs.id] = {
        url: url1,
        stack:stack1
    };

    if (annyang && !annyang.isListening()) {
     
        var commands = {
            'computer select all *type': function(type) {
                console.log('calling from command..select all '+type);
                var m = new message('select all $',type);
                performAction(m);
            },
            'computer select link *desc': function(desc) {
                console.log('calling from command..select link '+desc);
                var m = new message('select link $',type);
                performAction(m);
            },
            'computer click number *num': function(num){

                num=(num=='one')?1:num;
                console.log('calling from command..click link '+num);
                var m = new message('click number $',num);
                performAction(m);
                
            },
            'computer select number *num': function(num){

                num=(num=='one')?1:num;
                console.log('calling from command..select number '+num);
                var m = new message('select number $',num);
                performAction(m);
                
            }
            ,
            'computer click link *desc':function(desc){
                console.log('calling from command..click link '+desc);
                var m = new message('click link $',type);
                performAction(m);
            },
            'computer scroll page *direction':function(direction){
                console.log('calling from command..scroll page '+direction);
                var m = new message('scroll page $',direction);
                performAction(m);
            },
            'computer enter value *value':function(value){
              console.log('calling from command..enter value '+value);
                var m = new message('enter value $',value);
                performAction(m);  
            },
            'computer complete test case':function(){
              console.log('calling from command..complete test case ');
              var tabId=currentTabId;

              var url=tabDataStore['tab_' + tabId].url[0];
              var stack =tabDataStore['tab_' + tabId].stack;
              callVcatService(url,stack.getAllElements());
              delete tabDataStore['tab_' + tabId];
              stack = new elementstack();
              tabDataStore['tab_' + tabId] = {
                url: url,
                stack:stack
              };
            
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
            console.log('called here...');
            console.log("But then again, it could be any of the following: ", phrases);
            console.log("No command matched yet..");
            if(mismatchCount==3){
                mismatchCount=0;
                return;
            }

            for (var i = 0; i < phrases.length; i++) { 
                phrases[i] = phrases[i].removeStopWords();
            }
            console.log("After stop words removal: ", phrases);
            
            var finalCommand=[];
            var receivedCommand;
            var count=0;
            for (var i = 0; i < phrases.length; i++) { 
                receivedCommand = matchToCommandList(phrases[i]);
                if(receivedCommand!=null){
                    finalCommand[count]=new Array(2);
                    finalCommand[count][0]=receivedCommand;
                    finalCommand[count][1]=i
                    count++;
                }
            }
            console.log(finalCommand);
            if(finalCommand!=null && finalCommand.length>0){
                var maxScore=0;
                var selectedFinalCommand;
                var selectedIndex=[];
                var selectedPhrases=[];
                for(var i = 0; i < finalCommand.length; i++) { 
                    var comm = finalCommand[i][0];
                    if(comm[0]>maxScore){
                        maxScore=comm[0];
                        selectedFinalCommand=comm[1];
                    }
                }

                 for(var i = 0; i < finalCommand.length; i++) { 
                    var comm = finalCommand[i][0];
                    if(comm[0][1]!=selectedFinalCommand){
                        continue;
                    }else{
                        selectedIndex.push(finalCommand[i][1]);
                    }
                 }
                for(var i = 0; i < selectedIndex.length; i++) { 
                    selectedPhrases.push(phrases[selectedIndex[i]]);
                } 
                var correctedCommand = performCommandCorrection(selectedFinalCommand,selectedPhrases);
                console.log("correctedCommand= "+correctedCommand);
                mismatchCount++;
                if(!correctedCommand.startsWith("computer")){
                    correctedCommand="computer "+correctedCommand;
                }
                annyang.trigger(correctedCommand);

            }else{
                mismatchCount=0;
            }
        });
    }

});



function matchToCommandList(phrase){
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
   /* var comm=[];
    comm[0]=command;
    comm[1]=index;
    if(finalCommand==null || finalCommand[0][0]<command[0]){
        return comm;    
    }else{
        return finalCommand;
    }*/
    if(command[0]>0.5){
        return command;
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

function performAction(mess){

    mismatchCount=0;
    var commandStr = mess.command.split(" ");
    idenStr=mess.variable;
    console.log(commandStr);
    console.log(idenStr);
      
     var message = { action: commandStr[0],type1:commandStr[1],type2:commandStr[2] ,idenstr:idenStr};
            chrome.tabs.query({ active: true,currentWindow: true }, function(tabs){
               /* if(window.location.toString().includes(chrome.runtime.id)){
                    console.log('VCAT options page..');
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
            }
        }
    );
}