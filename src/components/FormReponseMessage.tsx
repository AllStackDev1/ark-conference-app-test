import cn from "classnames";
import { useRef, useEffect } from "react";

type Props = {
  text: string;
  status: boolean;
  errors?: {
    message: string;
  }[] | null;
};

const Div = ({ text, status }: Props) => (
  <div className="transition ease-in-out delay-150 duration-300 w-full">
    <span
      className={cn(
        "text-md",
        { "text-green-600": status },
        { "text-red-600": !status }
      )}
    >
      {text}
    </span>
  </div>
);

const Alert = ({ text, status }: Props) => {
  return (
    <div
      className={cn(
        "text-md border px-4 py-3 rounded relative",
        { "bg-green-100 border-green-400 text-green-700": status },
        { "bg-red-100 border-red-400 text-red-700": !status }
      )}
      role="alert"
    >
      <strong className="font-bold text-sm">{status ? "Success" : "Error"}: </strong>
      <span className="block sm:inline text-sm">{text}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg
          className={cn("fill-current h-6 w-6", {"text-green-500": status}, {"text-red-500": !status})}
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </span>
    </div>
  );
};

const FormReponseMessage = ({ text, status, errors }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    divRef.current?.focus();
  }, []);

  return (
    <div className="pb-2" ref={divRef}>
      {errors ? (
        <div className="space-y-2">
          {errors.map((error, i) => (
            <Div key={i} text={error.message} status={status} />
          ))}
        </div>
      ) : (
        <Alert text={text} status={status} />
      )}
    </div>
  );
};

export default FormReponseMessage;
