// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

window.onload = function() {

    var r = document.getElementById("voiceinput");
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
}