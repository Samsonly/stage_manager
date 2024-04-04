import React from "react";
import { useGlobal } from "./GlobalContext";
import GroundplanView from "./GroundplanView";
import "./DesignView.css";

function DesignView() {
  const { state } = useGlobal();
  const { groundplanView, isGroundplanVisible } = state;

  return (
    <div id="design-view">
      {isGroundplanVisible && groundplanView ? (
        <div id="groundplan-frame">
          <GroundplanView groundplanView={groundplanView} />
        </div>
      ) : (
        <>Design View</>
      )}
    </div>
  );
}

export default DesignView;
