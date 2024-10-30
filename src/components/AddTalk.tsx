import { MdClose } from "react-icons/md";
import { createPortal } from "react-dom";
import { Fade } from "react-awesome-reveal";
import { Form } from "react-router-dom";
import { useConferenceStore } from "src/stores";
import { Button } from ".";

export function AddTalkModal({ onClose }: { onClose: () => void }) {
  const { conference, isAddingTalk } = useConferenceStore((s) => s);

  return createPortal(
    <div className="absolute inset-4">
      <div className="absolute inset-0 opacity-80 bg-gray-600 rounded-md w-full h-full"></div>
      <Fade duration={2000}>
        <div className="flex items-center h-screen w-full">
          <div className="w-full bg-white rounded-md shadow-lg p-8 pt-6 md:max-w-sm md:mx-auto relative">
            <div className="absolute right-2 top-2">
              <button
                onClick={onClose}
                className="bg-gray-200 opacity-70 hover:opacity-100 shadow-sm rounded-full p-1 w-min"
              >
                <MdClose fontSize={30} className="text-gray-600" />
              </button>
            </div>
            <span className="block w-full text-center text-xl uppercase font-bold mb-4">
              Add a Talk
            </span>
            <Form method="post">
              <input hidden value="add-talk-to-conference" name="form-id" />
              <div className="mb-4 md:w-full">
                <label htmlFor="topic" className="block text-xs mb-1">
                  Topic
                </label>
                <input
                  className="w-full border rounded p-2 outline-none focus:shadow-outline"
                  type="topic"
                  name="topic"
                  id="topic"
                  placeholder="Enter topic of discussion"
                />
              </div>
              <div className="mb-4 md:w-full">
                <label htmlFor="location" className="block text-xs mb-1">
                  Location
                </label>
                <input
                  className="w-full border rounded p-2 outline-none focus:shadow-outline"
                  type="location"
                  name="location"
                  id="location"
                  placeholder="Enter location of discussion"
                />
              </div>
              <div className="mb-6 md:w-full">
                <label htmlFor="datetime" className="block text-xs mb-1">
                  Date & Time
                </label>
                <input
                  className="w-full border rounded p-2 outline-none focus:shadow-outline"
                  type="datetime-local"
                  name="datetime"
                  id="datetime"
                />
              </div>
              <Button
                type="submit"
                name="conference_id"
                value={conference?.id}
                isLoading={isAddingTalk}
              >
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </Fade>
    </div>,
    document.getElementById("main") || document.body
  );
}
