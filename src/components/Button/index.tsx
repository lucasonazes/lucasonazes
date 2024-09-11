"use client";

import React from "react";

export interface ButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    React.AriaAttributes {
  outlined?: boolean;
  link?: boolean;
}

const Button = ({ outlined = false, link = false, ...props }: ButtonProps) => {
  if (outlined) {
    return (
      <button
        {...props}
        className={`bg-transparent text-graceGreen font-semibold py-2 px-4 border border-graceGreen hover:opacity-70 rounded ${props.className}`}
      >
        {props.children}
      </button>
    );
  }

  if (link) {
    return (
      <button
        {...props}
        className={`bg-transparent hover:!text-blue-600 text-graceGreen font-bold py-2 px-4 ${props.className}`}
      >
        {props.children}
      </button>
    );
  }

  return (
    <button
      {...props}
      className={`bg-graceGreen hover:opacity-70 text-graceBlack font-bold py-2 px-4 rounded transition-all duration-300 ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
