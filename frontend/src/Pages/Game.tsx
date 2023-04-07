import Confetti from "react-confetti";
import Container from "../layouts/container";

import { useNavigate, useParams } from "react-router-dom";

import useWindowSize from "react-use/lib/useWindowSize";

import { useContext, useEffect, useState } from "react";

import { useUserContext } from "../functions/User";

import { SocketContext } from "../socket";

import Notify from "../components/notify";

import { phrasesInit } from "../constants/constants";

import { calculateWinningPoints } from "../functions/calculatepoints";

import Sidebar from "../components/sidebar";
import Board from "../components/board";
import ButtonGroups from "../components/buttongroups";

interface player {
  username: string;
  clientId: string;
}

interface game {
  gameId: string;
  players: player[];
}

interface notifications {
  gameId: string;
  gameData: object;
  message: string;
}

export default function Game() {
  let navigate = useNavigate();
  let { gameId } = useParams();
  const { width, height } = useWindowSize();

  const socket = useContext(SocketContext);

  const { username } = useUserContext();

  let [notifications, setNotifications]: any = useState([]);

  let [phrases, setPhrases] = useState<string[]>(phrasesInit);
  let [selectedPhrases, setSelectedPhrases] = useState(new Set());

  let [showNotify, setShowNotify] = useState(false);
  //turns states
  let [winner, setWinner] = useState(null);
  let [players, setPlayers] = useState<player[]>([]);

  let [possibleWinning, setPossibleWinning] = useState<any>([]);

  let [points, setPoints] = useState<number>(0);

  let [showShuffle, setShowShuffle] = useState(true);
  //load and session states
  let [loadtime, setLoadtime] = useState(10);
  let [loading, setLoading] = useState(false);
  let [sessionStart, setSessionStart] = useState(false);
  let [sessionEnd, setSessionEnd] = useState(false);
  const handleShuffle = () => {
    let shuffled = [...phrasesInit].sort(() => Math.random() - 0.5);

    setPhrases(shuffled);
  };
  //for shuffling the phrases at the start of the page
  useEffect(() => {
    handleShuffle();
  }, []);

  useEffect(() => {
    if (sessionStart) {
      setSelectedPhrases((current: any) => new Set(current.add(phrases[12])));
    }
  }, [sessionStart]);

  useEffect(() => {
    if (loadtime !== 0 || loading) {
      setSessionStart(false);
    } else {
      let points = calculateWinningPoints(phrases);
      setPossibleWinning(points);
      setSessionStart(true);
    }
  }, [loadtime]);
  //socket functions
  useEffect(() => {
    socket.emit("get_players", {
      gameId: gameId,
    });

    socket.on("set_players", (value: game) => {
      setPlayers(value.players);
    });

    socket.on("game_highlights", (value: notifications) => {
      setNotifications((preval: any) => [...preval, value.message]);
    });
    socket.on("start_game", (value: any) => {
      if (value.isGameStarted) {
        setSessionStart(true);
        setShowShuffle(false);
      }
    });
    socket.on("countdown", (value: any) => {
      setLoading(true);
      setLoadtime(value);
      setShowShuffle(false);
      if (value == 0) {
        setLoading(false);
      }
    });
    socket.on("selected_phrase", (value: any) => {
      setSelectedPhrases(
        (current: any) => new Set(current.add(value.selectedPhrase))
      );
    });
    socket.on("get_winner", (value: any) => {
      setWinner(value.wonBy);
      if (points > 4) {
        socket.emit("win_game", {
          gameId: gameId,
          wonBy: username,
        });
        socket.emit("end_game", {
          gameId: gameId,
        });
      }
      setSessionEnd(true);
      setShowNotify(true);
    });
  }, [socket]);

  const checkPoints = () => {
    let arrSelectedPhrases: any[] = [...selectedPhrases];
    arrSelectedPhrases;
    let pointCounter = 0;
    for (let i = 0; i < possibleWinning.length; i++) {
      if (
        possibleWinning[i].every((val: any) => arrSelectedPhrases.includes(val))
      ) {
        pointCounter++;
      }
    }
    setPoints(pointCounter);
  };

  useEffect(() => {
    if (points > 4) {
      socket.emit("win_game", {
        gameId: gameId,
        wonBy: username,
      });
      socket.emit("end_game", {
        gameId: gameId,
      });
    }
  }, [points]);

  useEffect(() => {
    checkPoints();
  }, [selectedPhrases]);

  const handleSelectedPhrase = (phrase: any) => {
    socket.emit("selected_phrase", {
      gameId: gameId,
      selectedBy: username,
      selectedPhrase: phrase,
    });
  };

  const handleLoad = () => {
    setShowShuffle(false);
    setLoading(true);
    setSessionStart(false);
    socket.emit("start_game", {
      gameId: gameId,
      gameStartedBy: username,
    });
  };

  const handleEnd = () => {
    setLoading(false);
    setSessionStart(false);
    if (loadtime === 0) {
      setSessionStart(false);
    }
    setShowShuffle(true);
    socket.emit("exit_game", {
      username: username,
      gameId: gameId,
    });
    return navigate("/");
  };

  return (
    <>
      <Container>
        <div className="flex flex-col md:flex-row ">
          {points >= 5 ? (
            <Confetti
              numberOfPieces={200}
              width={width}
              height={height}
              tweenDuration={5000}
            />
          ) : (
            ""
          )}
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

            <div className="grid justify-center grid-cols-1 md:grid-cols-1">
              <div className="p-1 text-black m-4 flex items-center justify-center">
                <h5 className="text-lg">Room ID:{gameId}</h5>
              </div>
            </div>
            {/* board ui */}

            <Board
              sessionStart={sessionStart}
              phrases={phrases}
              handleSelectedPhrase={handleSelectedPhrase}
              selectedPhrases={selectedPhrases}
            />
            <ButtonGroups
              showShuffle={showShuffle}
              handleLoad={handleLoad}
              handleEnd={handleEnd}
              handleShuffle={handleShuffle}
            />
          </div>
          <Sidebar
            username={username}
            points={points}
            notifications={notifications}
          />
        </div>
      </Container>
      <Notify
        title={`Game has Ended. ${
          winner === username ? "you are" : `${winner} is`
        } the winner. You will be exited out of room`}
        visible={showNotify}
      />
    </>
  );
}
