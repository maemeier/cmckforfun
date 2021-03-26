// import logo from './logo.svg';
import "./App.css";
import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { drawHand } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("handpose model loaded");

    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async net => {
    //check data is canvas
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // get video props
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // set video height and width

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set canvas height

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      // make detections

      const hand = await net.estimateHands(video);
      console.log(hand);

      // draw hands
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  runHandpose();

  return (
    <div className="App">
      <h1>CMCK.tech</h1>
      <p>developed by Lazy Mae</p>
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginRight: "auto",
            marginLeft: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginRight: "auto",
            marginLeft: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }}
        />
      </header>
    </div>
  );
}

export default App;
