import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.scss"; // optional styling

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>

      <button onClick={() => navigate("/")}>Go to Login</button>
    </div>
  );
};

export default NotFound;
