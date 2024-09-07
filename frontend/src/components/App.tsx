import { useEffect, useState } from "react";
import openSocket, { Socket }  from "socket.io-client";
import Connect from "./Connect";
import Chat from "./Chat";

interface Contact {
	foto: string,
	nome: string,
	telefone: string,
}

const App = () => {
	const [sessionOpen, setSessionOpen] = useState(false);

	const [io, setIO] = useState<Socket>();

	const [contact, setContact] = useState<Contact>();

	useEffect(() => {
		const socket = openSocket("http://localhost:3000");

		socket.on("session-open", (data) => {
			setSessionOpen(true);
			setContact(data);
		});

		socket.on("session-closed", () => {
			setSessionOpen(false);
		});

		socket.emit("reconnect-session");

		setIO(socket);

		return () => {
			socket.disconnect();
		}
	}, []);

	return (
		sessionOpen ? <Chat io={io} contact={contact} /> : <Connect io={io} />
	)
}

export default App;