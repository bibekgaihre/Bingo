export default function Board({
  sessionStart,
  phrases,
  handleSelectedPhrase,
  selectedPhrases,
}: any) {
  return (
    <>
      <div
        className={`grid grid-cols-5 md:grid-cols-25 ${
          sessionStart ? "" : "pointer-events-none"
        }`}
      >
        {phrases.map((phrase: string, index: number) => {
          const isSelected = selectedPhrases.has(phrase);
          return (
            <div
              className={`box-content h-20 w-24 md:w-32 md:32 lg:w-32 lg:h-32 ${
                index === 12 || isSelected
                  ? "bg-green-400 pointer-events-none border-white"
                  : "bg-white"
              }  hover:bg-gray-300 active:bg-green-400 cursor-pointer shadow-sm border border-black md:box-content`}
              key={index}
              onClick={() => handleSelectedPhrase(phrase)}
            >
              <div className="pt-1 md:text-right">
                <span className="mt-2 px-2 font-bold text-sm md:text-base lg:text-base text-neutral-800 ">
                  <sup>{index}</sup>
                </span>
              </div>
              <div className="py-2 text-center">
                <h5 className="px-2 font-medium leading-tight text-neutral-800 text-sm md:text-sm lg:text-base">
                  {phrase}
                </h5>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
