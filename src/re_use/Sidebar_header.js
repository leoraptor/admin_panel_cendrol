import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logout_logo from "../assets/svgs/svg_3.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const Sidebar_header = () => {
  const [logdata, setLogdata] = useState(false);
  const handleShow = () => {
    setLogdata(!logdata);
  };

  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="position-relative">
      <img src={logout_logo} onClick={handleShow} classNameName="logout_logo" />
      <div className={logdata ? "showit" : "hideit"}>
        <div className="btn_logout" onClick={logout}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.49375 10.2062C9.35625 10.0437 9.2875 9.85925 9.2875 9.65275C9.2875 9.44625 9.35625 9.2745 9.49375 9.1375L10.8813 7.75H5.5C5.2875 7.75 5.10925 7.678 4.96525 7.534C4.82125 7.39 4.7495 7.212 4.75 7C4.75 6.7875 4.822 6.60925 4.966 6.46525C5.11 6.32125 5.288 6.2495 5.5 6.25H10.8813L9.49375 4.8625C9.34375 4.7125 9.26875 4.53425 9.26875 4.32775C9.26875 4.12125 9.34375 3.94325 9.49375 3.79375C9.63125 3.64375 9.80325 3.56875 10.0098 3.56875C10.2163 3.56875 10.388 3.6375 10.525 3.775L13.225 6.475C13.3 6.55 13.3533 6.63125 13.3848 6.71875C13.4163 6.80625 13.4318 6.9 13.4313 7C13.4313 7.1 13.4158 7.19375 13.3848 7.28125C13.3538 7.36875 13.3005 7.45 13.225 7.525L10.525 10.225C10.3625 10.3875 10.1843 10.4595 9.99025 10.441C9.79625 10.4225 9.63075 10.3442 9.49375 10.2062ZM1.75 13.75C1.3375 13.75 0.984251 13.6033 0.690251 13.3098C0.396251 13.0163 0.249501 12.663 0.250001 12.25V1.75C0.250001 1.3375 0.397001 0.984251 0.691001 0.690251C0.985001 0.396251 1.338 0.249501 1.75 0.250001H6.25C6.4625 0.250001 6.64075 0.322001 6.78475 0.466001C6.92875 0.610001 7.0005 0.788001 7 1C7 1.2125 6.928 1.39075 6.784 1.53475C6.64 1.67875 6.462 1.7505 6.25 1.75H1.75V12.25H6.25C6.4625 12.25 6.64075 12.322 6.78475 12.466C6.92875 12.61 7.0005 12.788 7 13C7 13.2125 6.928 13.3908 6.784 13.5348C6.64 13.6788 6.462 13.7505 6.25 13.75H1.75Z"
              fill="#EC5050"
            />
          </svg>
          Logout
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Sidebar_header;