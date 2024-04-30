import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useProject } from "./Contexts/ProjectContext.js";

function GroundplanView() {
  const canvasRef = useRef();
  const sceneRef = useRef(new THREE.Scene());
  const { state } = useProject();
  const { groundplanModel, groundplanView } = state;

  useEffect(() => {
    const scene = sceneRef.current;
    scene.add(groundplanModel);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(500, 300);
    // renderer.setSize(750, 750);

    // Append the renderer's canvas to the div referenced by canvasRef
    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }

    const camera = new THREE.OrthographicCamera(
      groundplanView.frustum.left,
      groundplanView.frustum.right,
      groundplanView.frustum.top,
      groundplanView.frustum.bottom,
      groundplanView.frustum.near,
      groundplanView.frustum.far
    );

    camera.position.copy(groundplanView.position);
    camera.rotation.copy(groundplanView.rotation);
    camera.zoom = groundplanView.zoom;
    camera.updateProjectionMatrix();

    const ambientLight = new THREE.AmbientLight(0x404040, 5); // Soft white light
    scene.add(ambientLight);

    const loader = new OBJLoader();
    loader.load(groundplanModel, (object) => {
      scene.add(object);
      render();
    });

    // Render loop
    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
  }, [groundplanModel, groundplanView]); // Ensure effect runs when these values change

  return <div ref={canvasRef} />;
}

export default GroundplanView;
