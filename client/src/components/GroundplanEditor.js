import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import JSZip from "jszip";
import {
  useProject,
  SET_GROUNDPLAN_MODEL,
  SET_CAMERA_PARAMETERS,
  SET_OBJECT_SIZE,
  SET_RENDER_FUNCTION,
} from "./Contexts/ProjectContext.js";
import "../styles/GroundplanEditor.css";

const GroundplanEditor = ({ resizeTrigger }) => {
  const { state, dispatch } = useProject();
  const { scene, groundplanFile, cameraParameters } = state;
  const currentCameraRef = useRef(
    new THREE.OrthographicCamera(-10000, 10000, 10000, -10000, 0.1, 60000)
  );

  const rendererRef = useRef(null);
  const sceneRef = useRef(scene);
  const objectSizeRef = useRef({ x: 0, y: 0, z: 0 });
  const viewRef = useRef(cameraParameters.view);
  const windowRef = useRef(null);

  useEffect(() => {
    if (!groundplanFile) {
      return;
    }

    if (scene) {
      sceneRef.current = scene;
    } else {
      const scene = new THREE.Scene();
      scene.add(new THREE.AmbientLight(0x404040, 50));

      const viewerWidth =
        document.getElementById("groundplan-window").clientWidth;
      const viewerHeight =
        document.getElementById("groundplan-window").clientHeight;
      const renderer = new THREE.WebGLRenderer({ alpha: true });

      renderer.setSize(viewerWidth, viewerHeight);
      windowRef.current.appendChild(renderer.domElement);
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
        scene.add(object);
        sceneRef.current = scene;

        const startingView = size.z / 2;
        currentCameraRef.current.position.set(0, 0, startingView);
        viewRef.current = "-Z";

        const cameraBoundary = () => {
          currentCameraRef.current.position.x = Math.min(
            Math.max(currentCameraRef.current.position.x, -size.x / 2),
            size.x / 2
          );
          currentCameraRef.current.position.y = Math.min(
            Math.max(currentCameraRef.current.position.y, -size.y / 2),
            size.y / 2
          );
          currentCameraRef.current.position.z = Math.min(
            Math.max(currentCameraRef.current.position.z, -size.z / 2),
            size.z / 2
          );
        };

        const animate = () => {
          requestAnimationFrame(animate);
          cameraBoundary();
          renderer.render(sceneRef.current, currentCameraRef.current);
        };

        animate();
      };

      if (groundplanFile.name.endsWith(".zip")) {
        JSZip.loadAsync(groundplanFile).then((zip) => {
          let objFilePromise;
          let mtlFileContentPromise;
          let texturePromises = {};

          zip.forEach((relativePath, zipEntry) => {
            if (relativePath.endsWith(".obj")) {
              objFilePromise = zipEntry.async("blob").then(URL.createObjectURL);
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
        const objUrl = URL.createObjectURL(groundplanFile);
        loadModel(objUrl);
      }

      // const adjustRendererSize = () => {
      //   if (
      //     !rendererRef.current ||
      //     !sceneRef.current ||
      //     !currentCameraRef.current
      //   ) {
      //     return;
      //   }
      //   const viewerWidth = windowRef.current.clientWidth;
      //   const viewerHeight = windowRef.current.clientHeight;

      //   rendererRef.current.setSize(viewerWidth, viewerHeight);

      //   const aspect = viewerWidth / viewerHeight;
      //   currentCameraRef.current.left = (-10000 * aspect) / 2;
      //   currentCameraRef.current.right = (10000 * aspect) / 2;
      //   currentCameraRef.current.top = 10000 / 2;
      //   currentCameraRef.current.bottom = -10000 / 2;
      //   currentCameraRef.current.updateProjectionMatrix();

      //   rendererRef.current.render(sceneRef.current, currentCameraRef.current);
      // };

      // const resizeObserver = new ResizeObserver(() => {
      //   requestAnimationFrame(() => {
      //     adjustRendererSize();
      //   });
      // });

      // resizeObserver.observe(windowRef.current);

      const windowElement = windowRef.current;

      dispatch({ type: SET_OBJECT_SIZE, payload: objectSizeRef.current });
      dispatch({
        type: SET_GROUNDPLAN_MODEL,
        payload: sceneRef.current,
      });
      dispatch({
        type: SET_CAMERA_PARAMETERS,
        payload: currentCameraRef.current,
      });
      dispatch({
        type: SET_RENDER_FUNCTION,
        payload: rendererRef.current,
      });

      return () => {
        if (windowElement) {
          windowElement.removeChild(renderer.domElement);
          // resizeObserver.unobserve(windowElement);
        }
      };
    }
  }, [groundplanFile, dispatch, scene]);

  useEffect(() => {
    const adjustRendererOrScene = () => {
      if (
        !rendererRef.current ||
        !sceneRef.current ||
        !currentCameraRef.current
      ) {
        return;
      } else {
        const viewerWidth = windowRef.current.clientWidth;
        const viewerHeight = windowRef.current.clientHeight;
        rendererRef.current.setSize(viewerWidth, viewerHeight);
        rendererRef.current.render(sceneRef.current, currentCameraRef.current);
      }
    };
    adjustRendererOrScene();
    dispatch({
      type: SET_RENDER_FUNCTION,
      payload: rendererRef.current,
    });
  }, [resizeTrigger, dispatch]);

  return <div id="groundplan-window" ref={windowRef}></div>;
};

export default GroundplanEditor;
