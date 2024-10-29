import { Fade } from "react-awesome-reveal";
import TopBarProgress from "react-topbar-progress-indicator";
import { Outlet, useNavigation } from "react-router-dom";

import { useAuthStore } from "src/stores";
import { FormReponse } from "src/components";
import { useEffect } from "react";

TopBarProgress.config({
  barColors: {
    "0": "#C8FC7C",
    "1.0": "#C8FC7C",
  },
  shadowBlur: 5,
});

const Root = () => {
  const navigation = useNavigation();
  const { status, message, errors, clearFormState } = useAuthStore((state) => state);

  useEffect(() => {
    if (message || errors) {
      setTimeout(clearFormState, 5000);
    }
  }, [message , errors, clearFormState])
  

  return navigation.state == "loading" ? (
    <TopBarProgress />
  ) : (
    <main
      role="main"
      className="px-6 lg:px-0 mx-auto dark:text-zinc-400 text-zinc-600 max-w-4xl"
    >
      <div className="flex items-center h-screen w-full">
        <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
          <span className="block w-full text-xl uppercase font-bold mb-4">
            {document.title}
          </span>

          {(message || errors) && (
            <FormReponse
              status={status}
              text={message || ""}
              errors={errors}
            />
          )}

          <Fade duration={3000}>
            <Outlet />
          </Fade>
        </div>
      </div>
    </main>
  );
};

export default Root;
