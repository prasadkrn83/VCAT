chrome.runtime.onInstalled.addListener(function() {
    //this method is called when the extention is installed.
    //alert("installed");
});

chrome.windows.onCreated.addListener(function() {

    openOptions();

});

var hello = function(tag) {
    alert("select button");
}

function openOptions() {
chrome.runtime.openOptionsPage();
//chrome.runtime.cl

    // chrome.app.window.create('vcat.html', {
    //     bounds: {
    //         'width': 1024,
    //         'height': 768
    //     }
    // });
}



chrome.tabs.onCreated.addListener(function(tabs) {

    if (annyang && !annyang.isListening()) {
     
        var commands = {
            'select all *type': function(type) {
                console.log('calling from command..select all '+type);
                performAction('select all '+type);
            },
            'select link *desc': function(desc) {
                console.log('calling from command..select link '+desc);
                performAction('select link $ '+desc);
            },
            'click link number *num': function(num){

                num=(num=='one')?1:num;
                console.log('calling from command..click link number '+num);
                performAction('click link number '+num);
            },
            'click link *desc':function(desc){
                console.log('calling from command..click link '+desc);
                performAction('click link $ '+desc);
            },
            'scroll page *direction once':function(direction){
                console.log('calling from command..scroll page '+direction);
                performAction('scroll page '+direction +' once');
            },
            'scroll page *direction':function(direction){
                console.log('calling from command..scroll page '+direction);
                performAction('scroll page $ '+direction);
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
            performAction(inputStr);
          
            /*chrome.tabs.query({ active: true, windowType:"normal",currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id,message , function(response) {
                    console.log(response.message);
                });
            });*/
            console.log("But then again, it could be any of the following: ", phrases);
        });

    }

});

function performAction(inputStr){

    var commandStr = inputStr.split(" ");
    var idenStr=null;
    if(commandStr.length>3){
        idenStr=commandStr[3];
    }
    console.log(commandStr);
      
     var message = { action: commandStr[0],type1:commandStr[1],type2:commandStr[2] ,idenstr:idenStr};
            chrome.tabs.query({ active: true,currentWindow: true }, function(tabs)             {
                if((typeof tabs[0] === 'undefined') || (typeof tabs[0].title === 'undefined')){
                    console.log('not a webpage');
                    return;
                }else{
                    chrome.tabs.sendMessage(tabs[0].id,message , function(response) {
                        console.log(response.message);
                    });
                }
            }); 

}