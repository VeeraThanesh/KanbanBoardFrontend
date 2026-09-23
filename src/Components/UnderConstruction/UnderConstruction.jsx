import React from "react";
import styles from "./UnderConstruction.module.scss";
import constructionImg from "../../Assets/Images/UnderConstruction.png";
// <-- Put your PNG/SVG inside /src/assets/

const UnderConstruction = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img
          src={constructionImg}
          alt="Under Construction"
          className={styles.image}
        />

        <h2 className={styles.title}>Page Under Construction</h2>

        <p className={styles.text}>
          We're working hard to bring you something awesome!
        </p>
        <p className={styles.text}>
          This page is currently under construction, but we’ll be up and running
          soon.
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;
