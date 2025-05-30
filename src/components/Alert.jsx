import React from "react";

export default function Alert(props) {
  const capitalize = (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };
  return (
    props.alert && (
      <div style={{ width: "100%" }}>
        <div
          className={`alert alert-${props.alert.type} alert-dismissible fade show`}
          role="alert"
          style={{
            padding: "15px", // Ensures proper spacing inside the alert
            fontSize: "16px", // Makes text more readable
            position: "relative",
            top: "0",
            margin: "0",
          }}
        >
          <strong>{capitalize(props.alert.type)}</strong> : {props.alert.msg}
        </div>
      </div>
    )
  );
}
