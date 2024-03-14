import React, { useContext } from "react";
import { GlobalContext } from "./GlobalContext";

const TableOfContents = ({ onViewSection }) => {
  const { state } = useContext(GlobalContext);
  const { scriptData } = state;

  const generateLinks = () => {
    let links = [];

    links.push(
      <a
        key="play-title"
        href="#playTitle"
        onClick={(e) => {
          e.preventDefault();
          onViewSection("script");
        }}
        className="playTitle playToC"
      >
        {scriptData.playTitle}
      </a>
    );

    // Links to acts and scenes
    scriptData.actStructure.forEach((act, actIndex) => {
      const actId = `actTitle${actIndex}`;
      links.push(
        <a
          key={actId}
          href={`#${actId}`}
          onClick={(e) => {
            e.preventDefault();
            onViewSection("script", actId);
          }}
          className="actTitle actToC"
        >
          {act.actTitle || `Act ${actIndex + 1}`}
        </a>
      );

      act.sceneStructure.forEach((scene, sceneIndex) => {
        const sceneId = `sceneTitle${actIndex}${sceneIndex}`;
        links.push(
          <a
            key={sceneId}
            href={`#${sceneId}`}
            onClick={(e) => {
              e.preventDefault();
              onViewSection("script", sceneId);
            }}
            className="sceneTitle sceneToC"
          >
            {scene.sceneTitle || `Scene ${sceneIndex + 1}`}
          </a>
        );
      });
    });

    return links;
  };

  return <div id="table-of-contents">{generateLinks()}</div>;
};

export default TableOfContents;
