import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import JSZip from "jszip";

const GroundplanViewer = ({ file, onClose }) => {
  const viewerRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x404040, 50));
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const camera = new THREE.PerspectiveCamera(75, 750 / 750, 0.1, 20000);
    camera.position.set(5800, -5500, 0);
    cameraRef.current = camera;

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 0, 1);
    camera.add(spotLight);

    const spotLightTarget = new THREE.Object3D();
    spotLightTarget.position.set(0, 0, 2);
    scene.add(spotLightTarget);
    spotLight.target = spotLightTarget;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(750, 750);
    viewerRef.current.appendChild(renderer.domElement);

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
      object.position.sub(center);
      scene.add(object);

      object.traverse((child) => {
        if (child.isMesh && child.material.map) {
          console.log(`Texture for ${child.name}:`, child.material.map);
        } else if (child.isMesh) {
          console.log(`No texture for ${child.name}`);
        }
      });

      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;
      controls.update();

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        camera.rotation.set(1.5, 0, 0);
        renderer.render(scene, camera);
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

          console.log("Modified MTL content:", mtlContent); // Log the modified MTL content
          loadModel(objUrl, mtlContent);
        });
      });
    } else {
      const objUrl = URL.createObjectURL(file);
      loadModel(objUrl);
    }

    return () => {
      viewerRef.current.removeChild(renderer.domElement);
    };
  }, [file]);

  const captureCameraPosition = () => {
    if (cameraRef.current && controlsRef.current) {
      console.log("Camera Position:", cameraRef.current.position);
      console.log("Camera Rotation:", cameraRef.current.rotation);
      console.log("Controls Target:", controlsRef.current.target);
    }
  };

  return (
    <div
      ref={viewerRef}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "750px",
        height: "750px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        overflow: "hidden",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        padding: "20px",
      }}
    >
      <button onClick={captureCameraPosition}>Capture Camera Position</button>

      <div
        onClick={onClose}
        style={
          {
            /* Close button styles... */
          }
        }
      >
        Close
      </div>
    </div>
  );
};

export default GroundplanViewer;
