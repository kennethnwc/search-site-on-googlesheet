import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import { classNames } from "../layout/helper";

type LinkButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      className={classNames(
        "hover:text-red-500 hover:underline",
        "text-blue-500 background-transparent py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};
