var recognition;
chrome.runtime.onInstalled.addListener(function() {
//this method is called when the extention is installed.
//alert("installed");
});

chrome.runtime.onStartup.addListener(function (){
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.start();
});



chrome.tabs.onCreated.addListener(function (tabs){
//alert("new tab opened");

// setTimeout(() => {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//     .catch(function() {
        
//     });
// }, 100);


    if ("webkitSpeechRecognition" in window) {
        // var recognition = new webkitSpeechRecognition();
        // recognition.continuous = true;
        // recognition.interimResults = true;
        // recognition.lang = "en-US";
        // recognition.start();
        var interim_transcript = '';
        var final_transcript = '';
       // Set up 
        // recognition.onstart = function(event){ 
        //     alert("onstart", event);
        // } 
   
        // Process parsed result
        recognition.onresult = function(event){ 
    
        
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                // Verify if the recognized text is the last with the isFinal property
                if (event.results[i].isFinal) {
                    final_transcript = event.results[i][0].transcript;
                } 
            }
            
           alert("final_transcript = "+final_transcript);
        }
   
        // Handle error
        recognition.onerror = function(event){
            alert("onerror", event);
        }
   
        // Housekeeping after success or failed parsing
        recognition.onend = function(){ 
            alert("onend");
        }
    
    } 
});





