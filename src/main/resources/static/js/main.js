/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');

// 開始錄影按鈕點擊事件
recordButton.addEventListener('click', () => {
  if (recordButton.textContent === '開始錄影') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = '開始錄影';
//    playButton.disabled = false;
    downloadButton.disabled = false;
  }
});

// 播放錄影內容點擊事件
//const playButton = document.querySelector('button#play');
//playButton.addEventListener('click', () => {
//  const superBuffer = new Blob( recordedBlobs, { type: 'video/webm' });
//  recordedVideo.src = null;
//  recordedVideo.srcObject = null;
//  recordedVideo.src = window.URL.createObjectURL(superBuffer);
//  recordedVideo.controls = true;
//  recordedVideo.play();
//});

// 上傳錄影內容點擊事件
const downloadButton = document.querySelector('button#download');
downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, { type: 'video/webm' });
  // const url = window.URL.createObjectURL(blob);
  // const a = document.createElement('a');
  // a.style.display = 'none';
  // a.href = url;
  // a.download = 'test.webm';
  // document.body.appendChild(a);
  // a.click();
  
  // const response = await
  // fetch("https://wiki.epfl.ch/lapa-studio/documents/DTS/laser%20tutorial.pdf");
  // const content = await response.blob();
  console.log(blob.size);
  const formData = new FormData();
  formData.append("files", blob);
  formData.append("contract",document.getElementById("contract").value);
  fetch("https://localhost:8443" + "/uploadVideo", { method: 'POST', body: formData });

  // setTimeout(() => {
  // document.body.removeChild(a);
  // window.URL.revokeObjectURL(url);
  // }, 100);


});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {

  recordedBlobs = [];
  let options = { mimeType: 'video/webm;codecs=vp9,opus' };
  try {
    if (MediaRecorder.isTypeSupported) {
      options = { mimeType: "video/webm;codecs=vp9" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
        options = { mimeType: "video/webm;codecs=vp8" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not Supported`);
          errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
          options = { mimeType: "video/webm" };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not Supported`);
            errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
            options = { mimeType: "" };
          }
        }
      }
    } else {
      options = { mimeType: "" };
    }
    // if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    // console.error(`${options.mimeType} is not supported`);
    // options = { mimeType: 'video/webm;codecs=vp8,opus' };
    // if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    // console.error(`${options.mimeType} is not supported`);
    // options = { mimeType: 'video/webm' };
    // if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    // console.error(`${options.mimeType} is not supported`);
    // options = { mimeType: '' };
    // }
    // }
    // }
  } catch (e) {
    console.error('Exception while creating MediaRecorder1:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder2: ${JSON.stringify(e)}`;
    return;
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder3:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder4: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = '停止錄影';
//  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

document.querySelector('button#start').addEventListener('click', async () => {
  const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
  const constraints = {
    audio: {
      echoCancellation: { exact: hasEchoCancellation }
    },
    video: {
      width: 1280, height: 720
    }
  };
  console.log('Using media constraints:', constraints);
  await init(constraints);
});
