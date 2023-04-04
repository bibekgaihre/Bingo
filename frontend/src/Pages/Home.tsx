import roomLogo from "../assets/round-table.png";
import friendLogo from "../assets/friendship.png";
import { Link } from "react-router-dom";
import Board from "./Game";
import { useContext, useEffect, useState } from "react";
import Model from "../components/model";
import { useUserContext } from "../functions/User";
import { SocketContext } from "../socket";

export default function Home() {
  const { username, setUsername } = useUserContext();
  const socket = useContext(SocketContext);
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [roomId, setRoomId] = useState("");

  const generateRoomNumber = () => {
    setRoomId(Math.random().toString(36).slice(2, 8));
  };

  useEffect(() => {
    generateRoomNumber();

    if (username == "") {
      setShowUserModal(true);
    }
    console.log(username.toString(), "000");
  }, [username]);

  const createRoom = () => {
    if (username !== "") {
      //this should only envoke when clicked create room
      socket.emit(
        "create_game",
        {
          clientId: username,
          gameId: roomId,
        },
        function (data: any) {
          console.log(data);
          console.log("room created");
        }
      );
    }
  };

  const handleOnClose = () => {
    if (showModal) setShowModal(false);
    else setShowUserModal(false);
  };
  return (
    <>
      <div className="flex flex-col justify-center my-4 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link to={`room/${roomId}`} onClick={createRoom}>
            <div className="block max-w-sm rounded-lg bg-green-600 hover:bg-green-900 cursor-pointer mx-2 shadow-sm">
              <div className="p-4">
                <img
                  className="inline-flex items-center flex justify-center h-24 w-24"
                  src={roomLogo}
                />

                <h5 className="my-2 px-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                  Create Room
                </h5>
              </div>
            </div>
          </Link>

          <div
            className="block max-w-sm rounded-lg bg-gray-600 hover:bg-gray-900 cursor-pointer mx-2 shadow-sm"
            onClick={() => setShowModal(true)}
          >
            <div className="p-4">
              <img
                className="inline-flex items-center flex justify-center h-24 w-24"
                src={friendLogo}
              />

              <h5 className="my-2 px-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                Join Room
              </h5>
            </div>
          </div>
        </div>
      </div>

      <Model onClose={handleOnClose} visible={showUserModal} type="username" />
      <Model onClose={handleOnClose} visible={showModal} type="room" />
    </>
  );
}
