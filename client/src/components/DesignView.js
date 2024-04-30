import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  useProject,
  SET_CAMERA_PARAMETERS,
} from "./Contexts/ProjectContext.js";
import GroundplanView from "./GroundplanView.js";
import GroundplanEditor from "./GroundplanEditor.js";
import "../styles/DesignView.css";
import rightIcon from "../assets/right.png";
import leftIcon from "../assets/left.png";
import upIcon from "../assets/up.png";
import downIcon from "../assets/down.png";
import zoomInIcon from "../assets/zoom-in.png";
import zoomOutIcon from "../assets/zoom-out.png";
import rotateCWIcon from "../assets/clockwise.png";
import rotateCCWIcon from "../assets/counter-clockwise.png";
import xAxisIcon from "../assets/x-axis.png";
// import yAxisIcon from "../assets/y-axis.png";
// import zAxisIcon from "../assets/z-axis.png";
// import negXAxisIcon from "../assets/n-x-axis.png";
// import negYAxisIcon from "../assets/n-y-axis.png";
// import negZAxisIcon from "../assets/n-z-axis.png";

function DesignView() {
  const { state, dispatch } = useProject();
  const [resizeTrigger, setResizeTrigger] = useState(0);
  const { currentDesignView, objectSize, renderFunction, scene } = state;
  const frameRef = useRef(null);
  const objectSizeRef = useRef(objectSize);
  const currentCameraRef = useRef(
    new THREE.OrthographicCamera(-10000, 10000, 10000, -10000, 0.1, 60000)
  );
  // const rendererRef = useRef(renderFunction);
  const sceneRef = useRef(scene);
  const viewRef = useRef("Z");

  useEffect(() => {
    function adjustHeight() {
      if (frameRef.current) {
        var width = frameRef.current.offsetWidth;
        frameRef.current.style.height = (width * 9) / 16 + "px";
        setResizeTrigger((prev) => prev + 1);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        adjustHeight();
      });
    });

    const currentFrame = frameRef.current;

    if (currentFrame) {
      resizeObserver.observe(currentFrame);
    }

    return () => {
      if (currentFrame) {
        resizeObserver.unobserve(currentFrame);
      }
    };
  }, []);

  const moveCameraProportionally = (axis, percent) => {
    const distance = (objectSizeRef.current[axis] * percent) / 100;
    currentCameraRef.current.position[axis] += distance;
    renderFunction.render(sceneRef.current, currentCameraRef.current);
  };

  const setCameraOrientation = (axis) => {
    const maxXBoundary = objectSizeRef.current.x / 2;
    const maxYBoundary = objectSizeRef.current.y / 2;
    const maxZBoundary = objectSizeRef.current.z / 2;

    switch (axis) {
      case "x":
        currentCameraRef.current.position.set(-maxXBoundary, 0, 0);
        currentCameraRef.current.rotation.set(0, -Math.PI / 2, 0);
        viewRef.current = "X";
        break;
      case "y":
        currentCameraRef.current.position.set(0, -maxYBoundary, 0);
        currentCameraRef.current.rotation.set(Math.PI / 2, Math.PI, 0);
        viewRef.current = "Y";
        break;
      case "z":
        currentCameraRef.current.position.set(0, 0, -maxZBoundary);
        currentCameraRef.current.rotation.set(0, Math.PI, 0);
        viewRef.current = "Z";
        break;
      case "-x":
        currentCameraRef.current.position.set(maxXBoundary, 0, 0);
        currentCameraRef.current.rotation.set(0, -Math.PI / 2, 0);
        viewRef.current = "-X";
        break;
      case "-y":
        currentCameraRef.current.position.set(0, maxYBoundary, 0);
        currentCameraRef.current.rotation.set(-Math.PI / 2, 0, 0);
        viewRef.current = "-Y";
        break;
      case "-z":
        currentCameraRef.current.position.set(0, 0, maxZBoundary);
        currentCameraRef.current.rotation.set(0, 0, 0);
        viewRef.current = "-Z";
        break;
      default:
        break;
    }

    renderFunction.render(sceneRef.current, currentCameraRef.current);

    dispatch({
      type: SET_CAMERA_PARAMETERS,
      payload: {
        position: currentCameraRef.current.position,
        rotation: currentCameraRef.current.rotation,
        view: viewRef.current,
      },
    });
  };

  //   const captureCameraPosition = () => {
  //     if (currentCameraRef.current) {
  //       console.log("Camera Position:", currentCameraRef.current.position);
  //       console.log("Camera Rotation:", currentCameraRef.current.rotation);
  //     }
  //   };

  const handleMouseDown = (direction) => {
    let axis;
    let percentPerSecond;
    switch (viewRef.current) {
      case "X":
        switch (direction) {
          case "left":
            axis = "x";
            percentPerSecond = -10;
            break;
          case "right":
            axis = "x";
            percentPerSecond = 10;
            break;
          case "up":
            axis = "z";
            percentPerSecond = 10;
            break;
          case "down":
            axis = "z";
            percentPerSecond = -10;
            break;
          case "forward":
            axis = "y";
            percentPerSecond = 10;
            break;
          case "backward":
            axis = "y";
            percentPerSecond = -10;
            break;
          default:
            break;
        }
        break;
      case "Y":
        switch (direction) {
          case "left":
            axis = "y";
            percentPerSecond = 10;
            break;
          case "right":
            axis = "y";
            percentPerSecond = -10;
            break;
          case "up":
            axis = "z";
            percentPerSecond = 10;
            break;
          case "down":
            axis = "z";
            percentPerSecond = -10;
            break;
          case "forward":
            axis = "x";
            percentPerSecond = 10;
            break;
          case "backward":
            axis = "x";
            percentPerSecond = 10;
            break;
          default:
            break;
        }
        break;
      case "Z":
        switch (direction) {
          case "left":
            axis = "x";
            percentPerSecond = -10;
            break;
          case "right":
            axis = "x";
            percentPerSecond = 10;
            break;
          case "up":
            axis = "y";
            percentPerSecond = 10;
            break;
          case "down":
            axis = "y";
            percentPerSecond = -10;
            break;
          case "forward":
            axis = "z";
            percentPerSecond = -10;
            break;
          case "backward":
            axis = "z";
            percentPerSecond = 10;
            break;
          default:
            break;
        }
        break;
      case "-X":
        switch (direction) {
          case "left":
            axis = "x";
            percentPerSecond = 10;
            break;
          case "right":
            axis = "x";
            percentPerSecond = -10;
            break;
          case "up":
            axis = "z";
            percentPerSecond = 10;
            break;
          case "down":
            axis = "z";
            percentPerSecond = -10;
            break;
          case "forward":
            axis = "y";
            percentPerSecond = -10;
            break;
          case "backward":
            axis = "y";
            percentPerSecond = 10;
            break;
          default:
            break;
        }
        break;
      case "-Y":
        switch (direction) {
          case "left":
            axis = "y";
            percentPerSecond = -10;
            break;
          case "right":
            axis = "y";
            percentPerSecond = 10;
            break;
          case "up":
            axis = "z";
            percentPerSecond = 10;
            break;
          case "down":
            axis = "z";
            percentPerSecond = -10;
            break;
          case "forward":
            axis = "x";
            percentPerSecond = -10;
            break;
          case "backward":
            axis = "x";
            percentPerSecond = 10;
            break;
          default:
            break;
        }
        break;
      case "-Z":
        switch (direction) {
          case "left":
            axis = "x";
            percentPerSecond = 10;
            break;
          case "right":
            axis = "x";
            percentPerSecond = -10;
            break;
          case "up":
            axis = "y";
            percentPerSecond = 10;
            break;
          case "down":
            axis = "y";
            percentPerSecond = -10;
            break;
          case "forward":
            axis = "z";
            percentPerSecond = 10;
            break;
          case "backward":
            axis = "z";
            percentPerSecond = -10;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

    const move = () => {
      moveCameraProportionally(axis, percentPerSecond / 10);
      currentCameraRef.current.timeoutId = setTimeout(move, 100);
    };
    move();
  };

  const handleMouseUp = () => {
    clearTimeout(currentCameraRef.current.timeoutId);
  };

  const rotateView = (direction) => {
    switch (viewRef.current) {
      case "X":
        switch (direction) {
          case "clockwise":
            currentCameraRef.current.rotation.x += Math.PI / 2;
            break;
          case "counter-clockwise":
            currentCameraRef.current.rotation.x -= Math.PI / 2;
            break;
          default:
            break;
        }
        break;
      case "Y":
        switch (direction) {
          case "clockwise":
            currentCameraRef.current.rotation.y += Math.PI / 2;
            break;
          case "counter-clockwise":
            currentCameraRef.current.rotation.y -= Math.PI / 2;
            break;
          default:
            break;
        }
        break;
      case "Z":
        switch (direction) {
          case "clockwise":
            currentCameraRef.current.rotation.z += Math.PI / 2;
            break;
          case "counter-clockwise":
            currentCameraRef.current.rotation.z -= Math.PI / 2;
            break;
          default:
            break;
        }
        break;
      case "-X":
        switch (direction) {
          case "clockwise":
            currentCameraRef.current.rotation.x -= Math.PI / 2;
            break;
          case "counter-clockwise":
            currentCameraRef.current.rotation.x += Math.PI / 2;
            break;
          default:
            break;
        }
        break;
      case "-Y":
        switch (direction) {
          case "clockwise":
            currentCameraRef.current.rotation.y -= Math.PI / 2;
            break;
          case "counter-clockwise":
            currentCameraRef.current.rotation.y += Math.PI / 2;
            break;
          default:
            break;
        }
        break;
      case "-Z":
        switch (direction) {
          case "clockwise":
            currentCameraRef.current.rotation.z -= Math.PI / 2;
            break;
          case "counter-clockwise":
            currentCameraRef.current.rotation.z += Math.PI / 2;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  switch (currentDesignView) {
    case "baseView":
      return (
        <div id="design-view">
          <div id="groundplan-frame" ref={frameRef}>
            <div id="design-text">Design View</div>
          </div>
        </div>
      );
    case "groundplanView":
      return (
        <div id="design-view">
          <div id="groundplan-frame" ref={frameRef}>
            <GroundplanView />
          </div>
        </div>
      );
    case "groundplanEditor":
      return (
        <div id="design-view">
          <div id="groundplan-frame" ref={frameRef}>
            <GroundplanEditor resizeTrigger={resizeTrigger} />{" "}
          </div>
          <div id="groundplan-viewer-buttons">
            <div id="groundplan-top-row-buttons">
              <button
                id="zoom-out-button"
                onClick={() => handleMouseDown("backward")}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img id="zoom-out-icon" src={zoomOutIcon} alt="Zoom Out" />
              </button>
              <button
                id="up-button"
                onClick={() => handleMouseDown("up")}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img id="up-icon" src={upIcon} alt="Move Up" />
              </button>
              <button
                id="zoom-in-button"
                onClick={() => handleMouseDown("forward")}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img id="zoom-in-icon" src={zoomInIcon} alt="Zoom In" />
              </button>
            </div>
            <div id="groundplan-middle-row-buttons">
              <button
                id="left-button"
                onClick={() => handleMouseDown("left")}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img id="left-icon" src={leftIcon} alt="Move Left" />
              </button>
              <button
                id="x-axis-button"
                onClick={() => setCameraOrientation("x")}
              >
                <img id="x-axis-icon" src={xAxisIcon} alt="Set X Axis" />
              </button>
              {/* <button
                id="y-axis-button"
                onClick={() => setCameraOrientation("y")}
              >
                <img id="y-axis-icon" src={yAxisIcon} alt="Set Y Axis" />
              </button>
              <button
                id="z-axis-button"
                onClick={() => setCameraOrientation("z")}
              >
                <img id="z-axis-icon" src={zAxisIcon} alt="Set Z Axis" />
              </button>
              <button
                id="n-x-axis-button"
                onClick={() => setCameraOrientation("-x")}
              >
                <img
                  id="n-x-axis-icon"
                  src={negXAxisIcon}
                  alt="Set -X Axis"
                />
              </button>
              <button
                id="n-y-axis-button"
                onClick={() => setCameraOrientation("-y")}
              >
                <img
                  id="n-y-axis-icon"
                  src={negYAxisIcon}
                  alt="Set -Y Axis"
                />
              </button>
              <button
                id="n-z-axis-button"
                onClick={() => setCameraOrientation("-z")}
              >
                <img
                  id="n-z-axis-icon"
                  src={negZAxisIcon}
                  alt="Set -Z Axis"
                />
              </button> */}
              <button
                id="right-button"
                onClick={() => handleMouseDown("right")}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img id="right-icon" src={rightIcon} alt="Move Right" />
              </button>
            </div>
            <div id="groundplan-bottom-row-buttons">
              <button
                id="clockwise-button"
                onClick={() => rotateView("clockwise")}
              >
                <img
                  id="clockwise-icon"
                  src={rotateCWIcon}
                  alt="Rotate Clockwise"
                />
              </button>
              <button
                id="down-button"
                onClick={() => handleMouseDown("down")}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img id="down-icon" src={downIcon} alt="Move Down" />
              </button>
              <button
                id="counter-clockwise-button"
                onClick={() => rotateView("counter-clockwise")}
              >
                <img
                  id="counter-clockwise-icon"
                  src={rotateCCWIcon}
                  alt="Rotate Counter Clockwise"
                />
              </button>
            </div>
            {/* <div id="groundplan-camera-buttons">
                <button onClick={captureCameraPosition}>
                  Capture Camera Position
                </button>
              </div> */}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default DesignView;
