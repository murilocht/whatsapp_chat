import { PlayArrowOutlined } from "@mui/icons-material";
import { List, ListItem, Avatar, Typography, Grid2, TextField, Card, ButtonBase } from "@mui/material";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { InputMask } from '@react-input/mask';

interface Contact {
	foto: string,
	nome: string,
	telefone: string,
}

interface Message {
	msg: string,
	eu: string,
}

const Chat = ({io, contact}: {io: Socket | undefined, contact: Contact | undefined}) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState("");
	const [dest, setDest] = useState("");

	useEffect(() => {
		io?.on("update-messages", (data: Message) => {
			console.log(data)
			setMessages([...messages, data]);
		});
	}, [io, messages]);

	const sendMessage = () => {
		if (message == "") {
			alert("Digite uma mensagem");
			return;
		}
		if (dest.length != 12) {
			alert("Contato de destino inválido");
			return;
		}

		io?.emit("send-message", { message, dest });
		setMessage("");
	};

	return (
		<Grid2 container direction={'row'}>
			<Grid2 size={3}>
				{
					contact ? <List>
						<ListItem sx={{ bgcolor: '#202020' }}>
							<Avatar
								src={contact.foto}
								sx={{
									height: 70,
									width: 70,
									marginRight: 1
								}}
							/>
							<Typography>
								<Typography sx={{ color: '#dadada' }}>{contact.nome}</Typography>
								<Typography sx={{ color: '#dadada' }}>{contact.telefone}</Typography>
							</Typography>
						</ListItem>
					</List> : <></>
				}
			</Grid2>
			<Grid2 size={9} direction={'column'} container>
				<Grid2>
					<List>
						<ListItem sx={{ justifyContent: 'right' }} >
							<Typography sx={{ color: '#202020', marginRight: 2 }}>Número do outro contato: {dest}</Typography>
							<InputMask
								mask="+__ (__) ____-____"
								replacement={{ _: /\d/ }}
								onMask={(event) => setDest(event.detail.input)}
							  placeholder="+55 (99) 9999-9999" />
						</ListItem>
						{
							messages.map(message => (
								message.eu ? (
									<ListItem sx={{ justifyContent: 'right' }} >
										<Card sx={{ padding: 1, bgcolor: '#81C784' }}>
											<Typography>{message.msg}</Typography>
										</Card>
									</ListItem>
								) : (
									<ListItem>
										<Card sx={{ padding: 1, bgcolor: '#dadada' }}>
											<Typography>{message.msg}</Typography>
										</Card>
									</ListItem>
								)
							))
						}
					</List>
				</Grid2>

				<Grid2 container direction={'row'} sx={{ padding: 2 }}>
					<Grid2 size={11.5}>
						<TextField fullWidth={true} value={message} onChange={(e) => setMessage(e.target.value)} />
					</Grid2>
					<Grid2 size={0.5}>
						<ButtonBase onClick={sendMessage}>
							<PlayArrowOutlined sx={{ height: 55, width: 55 }} />
						</ButtonBase>
					</Grid2>
				</Grid2>
			</Grid2>
		</Grid2>
	)
}

export default Chat;