import { format } from "date-fns";
import { Form, Link } from "react-router-dom";
import { PiUserCirclePlusFill } from "react-icons/pi";
import { MdLocationPin, MdCalendarMonth } from "react-icons/md";

import { useAlert } from "src/hooks";
import { useConferenceStore } from "src/stores";
import { Button } from "src/components";

export const Home = () => {
  document.title = "Home";
  const { conferences, isLoading, isRegistering } = useConferenceStore((s) => s);

  useAlert("conference");

  return (
    <div className="space-y-6 flex flex-col">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Ongoing Conferences</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {conferences?.map((conference) => (
              <Link
                key={conference.id}
                className="rounded-md shadow-md bg-white flex flex-col"
                to={`/conferences/${conference.id}`}
              >
                <img
                  alt={conference.theme}
                  src={conference.image}
                  className="w-full max-h-44 object-cover rounded-t-md"
                  loading="eager"
                />

                <div className="h-full flex flex-col justify-between p-4 space-y-2 text-[#242947]">
                  <div>
                    <h2
                      className="text-xl font-bold line-clamp-2"
                      title={conference.theme}
                    >
                      {conference.theme}
                    </h2>
                    <div className="flex space-x-1 items-center">
                      <MdLocationPin fontSize={20} />
                      <p className="text-lg">{conference.location}, </p>
                    </div>
                    <div className="flex space-x-1 items-center">
                      <MdCalendarMonth fontSize={18} />
                      <p className="text-md text-gray-500">
                        {format(
                          new Date(conference.datetime),
                          "EEEE do MMMM yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>

                  <Form method="post" className="flex w-full justify-end">
                    <Button
                      type="submit"
                      name="conference_id"
                      value={conference?.id}
                      isLoading={isRegistering}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PiUserCirclePlusFill fontSize={24} />
                      <span>Register Now</span>
                    </Button>
                  </Form>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
