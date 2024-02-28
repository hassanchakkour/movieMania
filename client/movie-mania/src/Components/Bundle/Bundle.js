import styles from "./BundleCss.module.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosWalk, IoIosAirplane, IoMdRocket } from "react-icons/io";
import { IoBicycleSharp } from "react-icons/io5";
import { FaMotorcycle, FaCarSide } from "react-icons/fa";

const icons = [
  <IoIosWalk size={64} />,
  <IoBicycleSharp size={64} />,
  <FaMotorcycle size={64} />,
  <FaCarSide size={64}></FaCarSide>,
  <IoIosAirplane size={64} />,
  <IoMdRocket size={64} />,
];

const Bundle = (props) => {
  let info = props.info;

  const [bundleInfo, setBundleInfo] = useState(info);
  const navigate = useNavigate();

  const handleSubscribtion = () => {
    axios
      .post("/register/payments", {
        items: {
          bundleName: info.title,
          bundlePrice: info.price,
          bundleId: info._id,
        },
      })
      .then((data) => {
        let url = data.data.url;
        window.location.href = url;
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div
      className={[
        "w-80 px-10 py-10 m-10 h-[40%] bg-white shadow-md border rounded text-black font-bold",
        styles.card,
      ].join(" ")}
    >
      <div className="text-center text-4xl font-mono">
        <h1>{info.title}</h1>
        <h1 className="w-16 m-auto mt-6 mb-2">{icons[props.iconIndex]}</h1>
      </div>

      <div
        className={[
          "bg-gray-300 m-5 text-center py-2 px-3 text-2xl rounded",
          styles.price,
        ].join(" ")}
      >
        <h2>
          <span className="text-3xl">${info.price}</span>{" "}
          <span className="text-xl">/ Month </span>
        </h2>
      </div>

      <div>
        <p className="m-4">
          <span className="text-2xl">Movies Limit:</span>{" "}
          <span className="text-3xl m-1 ">{info.movieLimit}</span>
        </p>
      </div>

      <div className="text-center">
        <button
          className={[
            "bg-transparent  font-semibold  py-2 px-4 border  rounded",
            styles.SubscribeButton,
          ].join(" ")}
          onClick={handleSubscribtion}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Bundle;
