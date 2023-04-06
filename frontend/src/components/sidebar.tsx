import { gameRules } from "../constants/constants";
export default function Sidebar({ username, points, notifications }: any) {
  return (
    <>
      <div className="flex flex-col h-auto w-full md:w-auto p-4 text-black md:ml-8">
        <div className="grid justify-center grid-cols-1 md:grid-cols-1">
          <div className="p-1 text-black m-4 flex items-center justify-center">
            <h5 className="text-lg font-bold">Username:{username}</h5>
          </div>
        </div>
        <div className="grid justify-center grid-cols-1 md:grid-cols-1">
          <div className="p-1 text-black m-4 flex items-center justify-center">
            <h5 className="text-lg font-bold">Points:{points}</h5>
          </div>
        </div>

        <div className="grid justify-center grid-cols-1 md:grid-cols-1">
          <div className="p-1 text-black m-4 flex items-center justify-center">
            <h5 className="text-lg font-bold">Game rules</h5>
          </div>
        </div>
        <ul className="text-left">
          {gameRules.map((value: string, index: number) => {
            return <li key={index}> {value}</li>;
          })}
        </ul>
        <div className="grid justify-center grid-cols-1 md:grid-cols-1">
          <div className="p-1 text-black m-4 flex items-center justify-center">
            <h5 className="text-lg font-bold">Game Highlights</h5>
          </div>
        </div>
        <div className="text-left ">
          {notifications.map((message: any, index: any) => {
            return <h5 key={index}>{message}</h5>;
          })}
        </div>
      </div>
    </>
  );
}
