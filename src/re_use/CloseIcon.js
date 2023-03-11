import React from "react";

const CloseIcon = () => {
  return (
    <div>
      {" "}
      <button
        type="button"
        className="border-0 bg_none"
        data-bs-dismiss="modal"
        aria-label="Close"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.46659 17.1666L0.833252 15.5333L7.36659 8.99992L0.833252 2.46659L2.46659 0.833252L8.99992 7.36659L15.5333 0.833252L17.1666 2.46659L10.6333 8.99992L17.1666 15.5333L15.5333 17.1666L8.99992 10.6333L2.46659 17.1666Z"
            fill="black"
          />
        </svg>
      </button>
    </div>
  );
};

export default CloseIcon;
