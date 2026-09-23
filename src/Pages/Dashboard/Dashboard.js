import React from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import GameImage from "../../Assets/Images/Game.png";
import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src={GameImage}
          alt="Under Construction"
          className={styles.image}
        />
        {/* Buttons positioned around the image */}
        <button
          className={`${styles.navButton} ${styles.top}`}
          onClick={() => navigate("/taskManager")}
        >
          Task Manager
        </button>

        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => navigate("/holiday")}
        >
          Holidays
        </button>

        <button
          className={`${styles.navButton} ${styles.right}`}
          onClick={() => navigate("/user")}
        >
          Users
        </button>

        <button
          className={`${styles.navButton} ${styles.bottom}`}
          onClick={() => navigate("/setting")}
        >
          Settings
        </button>
      </div>

      <h2 className={styles.title}>Page Under Construction</h2>

      <p className={styles.text}>
        We're working hard to bring you something awesome!
      </p>
      <p className={styles.text}>
        This page is currently under construction, but we’ll be up and running
        soon.
      </p>
    </div>
  );
};

export default Dashboard;
