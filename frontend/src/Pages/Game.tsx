import Container from "../layouts/container";

import { socket } from "../socket";

import { useParams } from "react-router-dom";

import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { useEffect, useState } from "react";
import { useUserContext } from "../functions/User";

let phrasesInit = [
  "(child noises in the background)",
  "Hello, hello?",
  "i need to jump in another call",
  "can everyone go on mute",
  "could you please get closer to the mic",
  "(load painful echo / feedback)",
  "Next slide, please",
  "can we take this offline?",
  "is ___ on the call?",
  "Could you share this slides afterwards?",
  "can somebody grant presenter rights?",
  "can you email that to everyone?",
  "conf call bingo",
  "i'll have to get back to you",
  "You will send the minutes?",
  "sorry, i had problems loging in",
  "(animal noises in the background)",
  "sorry, i didn't found the conference id",
  "i was having connection issues",
  "who just joined?",
  "sorry, something ___ with my calendar",
  "do you see my screen?",
  "lets wait for ___!",
  "sorry, i was on mute.",
  "can you repeat, please?",
];

let gameRules = [
  "A player wins by completing a row, column, or diagonal.",
  "There's a free slot (always on) in the middle",
  "You can have multiple bingos",
];

export default function Game() {
  let { gameId } = useParams();

  const { username } = useUserContext();

  let [players, setPlayers] = useState([]);
  let [phrases, setPhrases] = useState<string[]>(phrasesInit);

  let [notifications, setNotifications]: any = useState([]);

  let [isSocketConnected, setIsSocketConnected] = useState(socket.connected);

  let [selectedPhrases, setSelectedPhrases] = useState([""]);

  let [showShuffle, setShowShuffle] = useState(true);
  let [loadtime, setLoadtime] = useState(10);
  let [loading, setLoading] = useState(false);
  let [sessionStart, setSessionStart] = useState(false);
  const handleShuffle = () => {
    let shuffled = [...phrasesInit].sort(() => Math.random() - 0.5);

    setPhrases(shuffled);
  };
  useEffect(() => {
    console.log(players);
    console.log(notifications);
  }, [players]);
  useEffect(() => {
    handleShuffle();

    socket.on("connect", () => {
      setIsSocketConnected(true);

      // socket.emit("create_game", {
      //   clientId: username,
      //   gameId: gameId,
      // });
      socket.on("game_join_response", (data) => {
        console.log(data);
        setPlayers(data.joinedClients);
        setNotifications((preval: any) => [...preval, data.message]);
      });
      console.log(gameId);
      socket.emit("get_games", {
        gameId: gameId,
      });
      console.log("connected to backend server");
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
      console.log("disconnected from backend server");
    });
    return () => {
      socket.off("connect", () => {
        setIsSocketConnected(true);
        console.log("connected to backend server");
      });
      socket.off("disconnect", () => {
        setIsSocketConnected(false);
        console.log("disconnected from backend server");
      });
    };
  }, []);

  useEffect(() => {
    if (loading && loadtime > 0) {
      let interval = setInterval(() => {
        setLoadtime((prevLoadtime) => prevLoadtime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (loadtime === 0) {
      setSessionStart(true);
    }
  }, [loading, loadtime]);

  const handleLoad = () => {
    setShowShuffle(false);
    setLoading(true);
  };

  const handleEnd = () => {
    setLoading(false);
    console.log(loading);
    setSessionStart(false);
    console.log(loadtime);
    if (loadtime === 0) {
      setSessionStart(false);
    }
    console.log(sessionStart);
    setShowShuffle(true);
  };

  return (
    <>
      <Container>
        <div className="flex flex-col md:flex-row ">
          <div className="flex flex-col justify-center my-4 py-4 md:mr-8 mb-8 md:mb-0">
            <div className="grid justify-center grid-cols-1 md:grid-cols-1">
              <div className="p-1 text-black m-4 flex items-center justify-center">
                {loading ? (
                  <h5 className="text-lg">
                    The Game starts in <strong>{loadtime}</strong> seconds
                  </h5>
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* board ui */}
            <div
              className={`grid grid-cols-5 md:grid-cols-25 ${
                sessionStart ? "" : "pointer-events-none"
              }`}
            >
              {phrases.map((phrase, index) => {
                return (
                  <div
                    className={`box-content h-32 w-32 ${
                      index === 12 ? "bg-green-400" : "bg-white"
                    }  hover:bg-gray-300 active:bg-green-400 cursor-pointer shadow-sm border border-black md:box-content`}
                    key={index}
                  >
                    <div className="pt-1 md:text-right">
                      <span className="mt-2 px-2 text-lg font-bold text-neutral-800 ">
                        <sup>{index}</sup>
                      </span>
                    </div>
                    <div className="py-2 text-center">
                      <h5 className="px-2 font-medium leading-tight text-neutral-800 text-sm md:text-sm">
                        {phrase}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>

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
          </div>
          <div className="flex flex-col h-auto w-full md:w-auto p-4 text-black md:ml-8">
            <div className="grid justify-center grid-cols-1 md:grid-cols-1">
              <div className="p-1 text-black m-4 flex items-center justify-center">
                <h5 className="text-lg font-bold">Username:{username}</h5>
              </div>
            </div>

            <div className="grid justify-center grid-cols-1 md:grid-cols-1">
              <div className="p-1 text-black m-4 flex items-center justify-center">
                <h5 className="text-lg font-bold">Game rules</h5>
              </div>
            </div>
            <ul className="text-left">
              {gameRules.map((value: string, index) => {
                return <li key={index}> {value}</li>;
              })}
            </ul>
            <div className="grid justify-center grid-cols-1 md:grid-cols-1">
              <div className="p-1 text-black m-4 flex items-center justify-center">
                <h5 className="text-lg font-bold">Game Highlights</h5>
              </div>
            </div>
            <div className="text-left ">
              <h5>game Created ... </h5>
              {notifications.map((message: any, index: any) => {
                return <h5 key={index}>{message}</h5>;
              })}

              <h5>Bibek joined the game</h5>
              <h5>Dipesh joined the game</h5>
              <h5>Brij joined the game</h5>
              <h5>Anushree won the game </h5>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
