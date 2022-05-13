import React from "react";
import { initializeWidget } from "@vikadata/widget-sdk";
import { Download } from "./download";

export const HelloWorld = () => {
  return (
    <div style={{ height: "100%" }}>
      <div style={{ margin: "0 auto", display: "table", paddingTop: "25%" }}>
        <Download />
      </div>
    </div>
  );
};

initializeWidget(HelloWorld, process.env.WIDGET_PACKAGE_ID);
