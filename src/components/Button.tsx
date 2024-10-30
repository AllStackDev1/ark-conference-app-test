import React from "react";
import cn from "classnames";
import ClipLoader from "react-spinners/ClipLoader";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  bgColor?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  loadingText?: string;
}

const Button = ({
  children,
  isLoading = false,
  isDisabled = false,
  bgColor = "bg-green-600",
  loadingText = "Submitting",
  ...rest
}: Props) => {
  return (
    <button
      className={cn(
        "flex space-x-2 justify-center uppercase text-sm w-full font-semibold px-4 py-2 rounded shadow-md text-white",
        { [bgColor]: bgColor }
      )}
      disabled={isDisabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <ClipLoader
            size={20}
            loading={true}
            color="#FFFFFF"
            data-testid="loader"
            aria-label="Loading Spinner"
          />
          <span className="capitalize">{loadingText}...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
