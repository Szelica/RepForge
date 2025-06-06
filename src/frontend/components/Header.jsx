import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import logo from "../../assets/logo.png"; // 🔧 použij PNG import

export default function Header({ greeting = "Hello!", showName = true, style = {} }) {
  const { currentUser } = useContext(UserContext);

  return (
    <div style={{ ...style, textAlign: "center", padding: "24px 0" }}>
      <div style={{ marginBottom: "16px" }}>
        <img src={logo} alt="RepForge logo" height="60" />
      </div>

      <div className="profileNameDiv">
        <p id="hello" style={{ color: "white", marginBottom: "5px" }}>
          {greeting}
        </p>
        {showName && (
          <h5 id="profileName" style={{ color: "#c1ff72", marginTop: 0 }}>
            {currentUser?.name || "Loading..."}
          </h5>
        )}
      </div>
    </div>
  );
}
