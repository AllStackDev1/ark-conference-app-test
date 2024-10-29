import { format } from "date-fns";
import { Form, Link } from "react-router-dom";
import { MdLocationPin, MdCalendarMonth } from "react-icons/md";

import { useAlert } from "src/hooks";
import { useConferenceStore } from "src/stores";

export const Home = () => {
  document.title = "Home";
  const { conferences } = useConferenceStore((s) => s);

  useAlert("conference");

  return (
    <div className="space-y-6 flex flex-col">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Ongoing Conferences</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {conferences?.map((conference) => (
          <Link
            key={conference.id}
            className="rounded-md shadow-md"
            to={`/conferences/${conference.id}`}
          >
            <img
              alt={conference.theme}
              src={conference.image}
              className="w-full h-52 object-cover rounded-t-md"
              loading="eager"
            />

            <div className="bg-white p-4 space-y-2 rounded-b-md shadow-md text-[#242947]">
              <div>
                <h2 className="text-xl font-bold">{conference.theme}</h2>
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
                <button
                  type="submit"
                  name="conferenceId"
                  value={conference.id}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-green-500 hover:bg-green-700 text-white w-full uppercase text-sm font-semibold px-4 py-2 rounded"
                >
                  Register
                </button>
              </Form>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
