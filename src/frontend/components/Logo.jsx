import React from "react";
import { ReactComponent as RepForgeLogo } from "../assets/logo.png";

const Logo = ({ height = 40, className = "" }) => {
  return (
    <div className={className} style={{ display: "inline-block" }}>
      <RepForgeLogo style={{ height: `${height}px`, width: "auto" }} />
    </div>
  );
};

export default Logo;
