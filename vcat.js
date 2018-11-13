// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

window.onload = function() {
    navigator.webkitGetUserMedia({ audio: true, video: true }, function() {
        console.log('ok');
    }, function(e) {
        console.log('webcam not ok');
    });
    $('#actions').hide();
    $('#types1').hide();
    $('#types2').hide();
    $('#iden').hide();
    $('#idenstr').hide();
    $('#go').hide();

    /* var r = document.getElementById("voiceinput");
     if ("webkitSpeechRecognition" in window) {
         var speechRecognizer = new webkitSpeechRecognition();
         speechRecognizer.continuous = true;
         speechRecognizer.interimResults = true;
         speechRecognizer.lang = "en-US";
         speechRecognizer.start();

         var finalTranscripts = "";
         speechRecognizer.onresult = function(event) {
             var interimTranscripts = "";
             for (var i = event.resultIndex; i < event.results.length; i++) {
                 var transcript = event.results[i][0].transcript;
                 transcript.replace("\n", "<br>");
                 if (event.results[i].isFinal) {
                     finalTranscripts += transcript;
                 } else {
                     interimTranscripts += transcript;
                 }
                 r.innerHTML = finalTranscripts + '<span style="color: #999;">' + interimTranscripts + '</span>';
             }
         };
         speechRecognizer.onerror = function(event) {};
     } else {
         r.innerHTML = "Your browser does not support that.";
     }

     function modifyDOM() {
         //You can play with your DOM here or check URL against your regex
         console.log('Tab script:');
         console.log(document.body);
         return document.body.innerHTML;
     }

     //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
     chrome.tabs.executeScript({
         code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
     }, (results) => {
         //Here we have just the innerHTML and not DOM structure
         console.log('Popup script:')
         console.log(results[0]);
     });*/


    $('#refreshbtn').click(function() {
        chrome.tabs.getAllInWindow(null, function(tabs) {
            $('#tabs').children('option').remove();
            $('#tabs').append('<option value="0"> --Select Tab-- </option>');

            $.each(tabs, function(index, value) {
                // u can use 'this.id' to work with evey tab 
                var title = value.title;
                if (typeof title === 'undefined') {
                    return true;
                }
                $('#tabs').append('<option value="' + value.id + '">' + title + '</option>');

            });
        });
    });

    $("#tabs").change(function() {
        if ($(this).val() == "0") {
            $('#actions').hide();
            $('#types1').hide();
            $('#types2').hide();
            $('#iden').hide();
            $('#idenxtr').hide();
            $('#go').hide();
            return;
        }
        $('#actions').show();
        $('#types1').show();
        $('#go').show();
    });

    $("#types1").change(function() {
        if ($(this).val() == "all") {
            $('#types2').show();
            $('#iden').hide();


        } else {
            $('#types2').show();
            $('#iden').show();




        }
    });

    $("#types2").change(function() {
        if ($(this).val() == "0") {
            $('#iden').hide();
            $('#idenstr').hide();


        } else {
            if ($("#types1").val() != "all") {
                $('#iden').show();
                $('#idenstr').show();
            }


        }
    });

$("#iden").change(function() {
        if ($(this).val() == "0") {
            $('#iden').hide();
            $('#idenstr').hide();


        } else {
            if ($("#types1").val() != "all") {
                $('#iden').show();
                $('#idenstr').show();
            }


        }
    });

    $("#go").click(function() {
        var action = $("#actions").val();
        var type1 = $("#types1").val();
        var type2 = $("#types2").val();
        var idenstr = $("#idenstr").val();
        var message = { action: action,type1:type1,type2:type2 ,idenstr:idenstr};
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(parseInt($("#tabs").val()),message , function(response) {
                alert(response);
            });
        });

    });


}