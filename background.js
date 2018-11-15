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
chrome.runtime.cl

    // chrome.app.window.create('vcat.html', {
    //     bounds: {
    //         'width': 1024,
    //         'height': 768
    //     }
    // });
}



chrome.tabs.onCreated.addListener(function(tabs) {

    if (annyang && !annyang.isListening()) {
        // alert('hello...');

        // Let's define a command.
        var commands = {
            'hi': hello
        };

        // Add our commands to annyang
        annyang.addCommands(commands);
        annyang.start({ autoRestart: true });
        //alert('hello...');

        annyang.addCallback('soundstart', function() {
            //alert('sound detected');
        });

        annyang.addCallback('result', function() {
            // alert('sound stopped');
        });
        annyang.addCallback('result', function(phrases) {
            console.log("I think the user said: ", phrases[0]);
            var inputStr  = phrases[0];
            var res = inputStr.split(" ");
            var message = { action: res[0],type1:res[1],type2:res[2] ,idenstr:null};

            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id,message , function(response) {
                console.log(response.message);
            });
        });
            console.log("But then again, it could be any of the following: ", phrases);
        });

        // Start listening.
    }

});