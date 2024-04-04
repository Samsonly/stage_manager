import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import JSZip from "jszip";
import {
  useGlobal,
  STORE_GROUNDPLAN_MODEL,
  SET_GROUNDPLAN_VISIBLE,
  SET_GROUNDPLAN_VIEW,
} from "./GlobalContext";
import "./GroundplanEditor.css";

const GroundplanEditor = ({ file, onClose }) => {
  const { dispatch } = useGlobal();
  const currentCameraRef = useRef(
    new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      60000
    )
  );
  const viewerRef = useRef();
  const isOrthoRef = useRef(false);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const objectSizeRef = useRef({ x: 0, y: 0, z: 0 });
  const viewRef = useRef(null);

  useEffect(() => {
    if (!file) {
      return;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.add(new THREE.AmbientLight(0x404040, 50));

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(750, 750);
    viewerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const loadModel = (objUrl, mtlContent) => {
      const mtlLoader = new MTLLoader();
      const materials = mtlLoader.parse(mtlContent);
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(objUrl, addObjectToScene);
    };

    const addObjectToScene = (object) => {
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = new THREE.Vector3();
      box.getSize(size);
      objectSizeRef.current = { x: size.x, y: size.y, z: size.z };
      object.position.sub(center);
      dispatch({ type: STORE_GROUNDPLAN_MODEL, payload: object });
      scene.add(object);

      const maxBoundary = -(Math.max(size.x + size.z, size.y + size.z) / 2);
      currentCameraRef.current.position.set(0, 0, maxBoundary);
      viewRef.current = "Z";

      const camX = Math.max(size.x + size.z, size.x + size.y);
      const camY = Math.max(size.y + size.z, size.y + size.x);
      const camZ = Math.max(size.x + size.z, size.y + size.z);

      const cameraBoundary = () => {
        currentCameraRef.current.position.x = Math.min(
          Math.max(currentCameraRef.current.position.x, -camX / 2),
          camX / 2
        );
        currentCameraRef.current.position.y = Math.min(
          Math.max(currentCameraRef.current.position.y, -camY / 2),
          camY / 2
        );
        currentCameraRef.current.position.z = Math.min(
          Math.max(currentCameraRef.current.position.z, -camZ / 2),
          camZ / 2
        );
      };

      const animate = () => {
        requestAnimationFrame(animate);
        cameraBoundary();
        renderer.render(scene, currentCameraRef.current);
      };

      animate();
    };

    if (file.name.endsWith(".zip")) {
      JSZip.loadAsync(file).then((zip) => {
        let objFilePromise;
        let mtlFileContentPromise;
        let texturePromises = {};

        zip.forEach((relativePath, zipEntry) => {
          if (relativePath.endsWith(".obj")) {
            objFilePromise = zipEntry.async("blob").then((blob) => {
              const objUrl = URL.createObjectURL(blob);
              return objUrl;
            });
          } else if (relativePath.endsWith(".mtl")) {
            mtlFileContentPromise = zipEntry.async("string");
          } else if (relativePath.match(/\.(jpg|jpeg|png)$/i)) {
            texturePromises[relativePath] = zipEntry
              .async("blob")
              .then(URL.createObjectURL);
          }
        });

        Promise.all([
          objFilePromise,
          mtlFileContentPromise,
          Promise.all(
            Object.entries(texturePromises).map(([path, promise]) =>
              promise.then((url) => ({ path, url }))
            )
          ),
        ]).then(([objUrl, mtlContent, textures]) => {
          textures.forEach(({ path, url }) => {
            const regex = new RegExp(
              path.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
              "g"
            );
            mtlContent = mtlContent.replace(regex, url);
          });

          loadModel(objUrl, mtlContent);
        });
      });
    } else {
      const objUrl = URL.createObjectURL(file);
      loadModel(objUrl);
    }

    const hole = document.getElementById("hole");
    const handle = document.getElementById("resize-handle");

    let startX, startY, startWidth, startHeight;

    const doDrag = (e) => {
      const newWidth = startWidth + e.clientX - startX;
      const newHeight = startHeight + e.clientY - startY;

      const aspectRatio = startWidth / startHeight;
      let finalWidth, finalHeight;

      if (newWidth / newHeight > aspectRatio) {
        finalWidth = newHeight * aspectRatio;
        finalHeight = newHeight;
      } else {
        finalWidth = newWidth;
        finalHeight = newWidth / aspectRatio;
      }

      hole.style.width = `${finalWidth}px`;
      hole.style.height = `${finalHeight}px`;
    };

    const stopDrag = () => {
      document.documentElement.removeEventListener("mousemove", doDrag, false);
      document.documentElement.removeEventListener("mouseup", stopDrag, false);
    };

    const initDrag = (e) => {
      startX = e.clientX;
      startY = e.clientY;
      startWidth = hole.offsetWidth;
      startHeight = hole.offsetHeight;

      document.documentElement.addEventListener("mousemove", doDrag, false);
      document.documentElement.addEventListener("mouseup", stopDrag, false);
    };

    handle.addEventListener("mousedown", initDrag, false);

    const viewerElement = viewerRef.current;

    return () => {
      handle.removeEventListener("mousedown", initDrag, false);
      if (viewerElement) {
        viewerElement.removeChild(renderer.domElement);
      }
    };
  }, [file, dispatch]);

  const toggleCamera = () => {
    const oldCamera = currentCameraRef.current;
    const newCamera = isOrthoRef.current
      ? new THREE.PerspectiveCamera(
          90,
          window.innerWidth / window.innerHeight,
          0.1,
          60000
        )
      : new THREE.OrthographicCamera(-10000, 10000, 10000, -10000, 0.1, 60000);

    newCamera.position.copy(oldCamera.position);
    newCamera.rotation.copy(oldCamera.rotation);

    currentCameraRef.current = newCamera;

    isOrthoRef.current = !isOrthoRef.current;
    rendererRef.current.render(sceneRef.current, currentCameraRef.current);
  };

  const moveCameraProportionally = (axis, percent) => {
    const distance = (objectSizeRef.current[axis] * percent) / 100;
    currentCameraRef.current.position[axis] += distance;
    rendererRef.current.render(sceneRef.current, currentCameraRef.current);
  };

  const setCameraOrientation = (axis) => {
    const maxXBoundary =
      Math.max(
        objectSizeRef.current.y + objectSizeRef.current.x,
        objectSizeRef.current.z + objectSizeRef.current.x
      ) / 2;
    const maxYBoundary =
      Math.max(
        objectSizeRef.current.x + objectSizeRef.current.y,
        objectSizeRef.current.z + objectSizeRef.current.y
      ) / 2;
    const maxZBoundary =
      Math.max(
        objectSizeRef.current.x + objectSizeRef.current.z,
        objectSizeRef.current.y + objectSizeRef.current.z
      ) / 2;

    switch (axis) {
      case "x":
        currentCameraRef.current.position.set(0, -maxYBoundary, 0);
        currentCameraRef.current.rotation.set(Math.PI / 2, 0, 0);
        viewRef.current = "X";
        break;
      case "y":
        currentCameraRef.current.position.set(-maxXBoundary, 0, 0);
        currentCameraRef.current.rotation.set(Math.PI / 2, -Math.PI / 2, 0);
        viewRef.current = "Y";
        break;
      case "z":
        currentCameraRef.current.position.set(0, 0, maxZBoundary);
        currentCameraRef.current.rotation.set(0, 0, 0);
        viewRef.current = "Z";
        break;
      case "-x":
        currentCameraRef.current.position.set(0, maxYBoundary, 0);
        currentCameraRef.current.rotation.set(-Math.PI / 2, 0, Math.PI);
        viewRef.current = "-X";
        break;
      case "-y":
        currentCameraRef.current.position.set(maxXBoundary, 0, 0);
        currentCameraRef.current.rotation.set(Math.PI / 2, Math.PI / 2, 0);
        viewRef.current = "-Y";
        break;
      case "-z":
        currentCameraRef.current.position.set(0, 0, -maxZBoundary);
        currentCameraRef.current.rotation.set(0, Math.PI, 0);
        viewRef.current = "-Z";
        break;
      default:
        break;
    }
    rendererRef.current.render(sceneRef.current, currentCameraRef.current);
  };

  const captureCameraPosition = () => {
    if (currentCameraRef.current) {
      console.log("Camera Position:", currentCameraRef.current.position);
      console.log("Camera Rotation:", currentCameraRef.current.rotation);
    }
  };

  // const groundplanSnapshot = () => {
  //   const camera = currentCameraRef.current;

  //   const cameraParameters = {
  //     position: camera.position.clone(),
  //     rotation: camera.rotation.clone(),
  //     zoom: camera.zoom,
  //     frustum: {
  //       left: camera.left,
  //       right: camera.right,
  //       top: camera.top,
  //       bottom: camera.bottom,
  //       near: camera.near,
  //       far: camera.far,
  //     },
  //   };

  //   dispatch({ type: SET_GROUNDPLAN_VISIBLE, payload: true });
  //   dispatch({ type: SET_GROUNDPLAN_VIEW, payload: cameraParameters });

  //   onClose();
  // };

  const groundplanSnapshot = () => {
    const camera = currentCameraRef.current;
    const holeElement = document.getElementById("hole");

    if (!holeElement) {
      console.error("Hole element not found");
      return;
    }

    // Get hole dimensions
    const holeWidth = holeElement.offsetWidth;
    const holeHeight = holeElement.offsetHeight;

    // Calculate width and height ratios of the hole relative to the original 750px by 750px viewport
    const widthRatio = holeWidth / 750;
    const heightRatio = holeHeight / 750;

    // Calculate the new 'left', 'right', 'top', and 'bottom' properties for the camera based on hole dimensions
    // const cameraLeft = -(widthRatio / 2);
    // const cameraRight = widthRatio / 2;
    // const cameraTop = heightRatio / 2;
    // const cameraBottom = -(heightRatio / 2);

    const cameraLeft = -10000;
    const cameraRight = 10000;
    const cameraTop = 10000;
    const cameraBottom = -10000;

    // Adjust the orthographic camera's frustum properties
    camera.left = cameraLeft;
    camera.right = cameraRight;
    camera.top = cameraTop;
    camera.bottom = cameraBottom;
    camera.updateProjectionMatrix();

    // Prepare camera parameters for recall
    const cameraParameters = {
      position: camera.position.clone(),
      rotation: camera.rotation.clone(),
      zoom: camera.zoom,
      frustum: {
        left: camera.left,
        right: camera.right,
        top: camera.top,
        bottom: camera.bottom,
        near: camera.near, // Assuming constant
        far: camera.far, // Assuming constant
      },
    };

    // Dispatch the action to save these parameters, ensuring the view will scale correctly to a 500px by 300px viewport upon recall
    dispatch({ type: SET_GROUNDPLAN_VISIBLE, payload: true });
    dispatch({ type: SET_GROUNDPLAN_VIEW, payload: cameraParameters });

    onClose(); // Close the overlay
  };

  // const groundplanSnapshot = () => {
  //   const holeElement = document.getElementById("hole");
  //   const viewerElement = document.getElementById("groundplan-viewer");

  //   const holeRect = holeElement.getBoundingClientRect();
  //   const viewerRect = viewerElement.getBoundingClientRect();

  //   const holeX = holeRect.left - viewerRect.left;
  //   const holeY = holeRect.top - viewerRect.top;
  //   const holeWidth = holeRect.width;
  //   const holeHeight = holeRect.height;

  //   // Assuming the camera is orthographic
  //   const aspectRatio = viewerRect.width / viewerRect.height;
  //   const frustumHeight =
  //     (holeHeight / viewerRect.height) * currentCameraRef.current.zoom;
  //   const frustumWidth =
  //     (holeWidth / viewerRect.width) *
  //     currentCameraRef.current.zoom *
  //     aspectRatio;

  //   const xOffset =
  //     (holeX / viewerRect.width - 0.5) *
  //     2 *
  //     aspectRatio *
  //     currentCameraRef.current.zoom;
  //   const yOffset =
  //     -(holeY / viewerRect.height - 0.5) * 2 * currentCameraRef.current.zoom;

  //   currentCameraRef.current.left = xOffset - frustumWidth / 2;
  //   currentCameraRef.current.right = xOffset + frustumWidth / 2;
  //   currentCameraRef.current.top = yOffset + frustumHeight / 2;
  //   currentCameraRef.current.bottom = yOffset - frustumHeight / 2;

  //   currentCameraRef.current.updateProjectionMatrix();

  //   const cameraParameters = {
  //     position: currentCameraRef.current.position.clone(),
  //     rotation: currentCameraRef.current.rotation.clone(),
  //     zoom: currentCameraRef.current.zoom,
  //     frustum: {
  //       left: currentCameraRef.current.left,
  //       right: currentCameraRef.current.right,
  //       top: currentCameraRef.current.top,
  //       bottom: currentCameraRef.current.bottom,
  //       near: currentCameraRef.current.near, // Typically constant, but included for completeness
  //       far: currentCameraRef.current.far, // Typically constant, but included for completeness
  //     },
  //   };

  //   // Dispatch the action to save these parameters
  //   dispatch({ type: SET_GROUNDPLAN_VISIBLE, payload: true });
  //   console.log("cameraParameters", cameraParameters);
  //   dispatch({ type: SET_GROUNDPLAN_VIEW, payload: cameraParameters });

  //   onClose(); // Close the overlay
  // };

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

  return (
    <div>
      <div className="overlay">
        <div id="hole">
          <div id="resize-handle"></div>
        </div>
      </div>{" "}
      <div id="groundplan-viewer" ref={viewerRef}></div>
      <div id="groundplan-viewer-buttons">
        <div id="groundplan-movement-buttons">
          <button
            onMouseDown={() => handleMouseDown("left")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            Move Left
          </button>
          <button
            onMouseDown={() => handleMouseDown("right")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            Move Right
          </button>
          <button
            onMouseDown={() => handleMouseDown("up")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            Move Up
          </button>
          <button
            onMouseDown={() => handleMouseDown("down")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            Move Down
          </button>
          <button
            onMouseDown={() => handleMouseDown("forward")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            Zoom In
          </button>
          <button
            onMouseDown={() => handleMouseDown("backward")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            Zoom Out
          </button>
        </div>
        <div id="groundplan-orientation-buttons">
          <button onClick={() => setCameraOrientation("x")}>Face X-Axis</button>
          <button onClick={() => setCameraOrientation("y")}>Face Y-Axis</button>
          <button onClick={() => setCameraOrientation("z")}>Face Z-Axis</button>
          <button onClick={() => setCameraOrientation("-x")}>
            Face -X-Axis
          </button>
          <button onClick={() => setCameraOrientation("-y")}>
            Face -Y-Axis
          </button>
          <button onClick={() => setCameraOrientation("-z")}>
            Face -Z-Axis
          </button>
        </div>
        <div id="groundplan-camera-buttons">
          <button onClick={captureCameraPosition}>
            Capture Camera Position
          </button>
          <button onClick={toggleCamera}>Toggle Camera</button>
          <button onClick={groundplanSnapshot}>groundplanSnapshot</button>
        </div>
      </div>
      <div onClick={onClose} style={{ cursor: "pointer" }}>
        Close
      </div>
    </div>
  );
};

export default GroundplanEditor;
