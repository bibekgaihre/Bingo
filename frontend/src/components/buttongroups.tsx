import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function ButtonGroups({
  showShuffle,
  handleLoad,
  handleEnd,
  handleShuffle,
}: any) {
  return (
    <>
      <div className="grid justify-center grid-cols-2 md:grid-cols-2 ">
        <div className="p-1 m-4">
          {showShuffle ? (
            <button
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 py-3 px-8 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={handleLoad}
            >
              Start
            </button>
          ) : (
            <button
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 py-3 px-8 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={handleEnd}
            >
              Exit
            </button>
          )}
        </div>

        {showShuffle ? (
          <div className="p-1 text-white m-4 flex items-center justify-center">
            <span className="sr-only">Shuffle</span>
            <ArrowPathIcon
              className="stroke-green-900 h-10 w-10 hover:stroke-black cursor-pointer"
              aria-hidden="true"
              onClick={handleShuffle}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      {showShuffle ? (
        <div className="p-1 m-4">
          <button
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 py-3 px-8 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={handleEnd}
          >
            Exit Room
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
