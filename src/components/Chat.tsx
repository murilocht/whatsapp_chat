import { PlayArrowOutlined } from "@mui/icons-material";
import { Divider, List, ListItem, Avatar, Typography, Grid2, TextField, Card } from "@mui/material";
import { useState } from "react";

const Chat = () => {
	const [contacts, setContacts] = useState([
		{
			foto: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			nome: "Murilo",
			telefone: "99 9 9999-9999"
		}, {
			foto: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			nome: "Marcos",
			telefone: "88 8 8888-8888"
		}, {
			foto: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			nome: "Ana",
			telefone: "77 7 7777-7777"
		}
	]);

	return (
		<Grid2 container direction={'row'}>
			<Grid2 size={3}>
				<List>
					{
						contacts.map(contact => (
							<>
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
								<Divider sx={{ bgcolor: '#dadada' }} />
							</>
						))
					}
				</List>
			</Grid2>
			<Grid2 size={9} direction={'column'} container>
				<Grid2>
					<List>
						<ListItem sx={{justifyContent: 'right'}} >
							<Card sx={{ padding: 1, bgcolor: '#81C784' }}>
								<Typography>ola maria</Typography>
							</Card>
						</ListItem>
						<ListItem>
							<Card sx={{ padding: 1, bgcolor: '#dadada' }}>
								<Typography>ola maria</Typography>
							</Card>
						</ListItem>
					</List>
				</Grid2>

				<Grid2 container direction={'row'} sx={{ padding: 2 }}>
					<Grid2 size={11.5}>
						<TextField fullWidth={true} />
					</Grid2>
					<Grid2 size={0.5}>
						<PlayArrowOutlined sx={{ height: 55, width: 55 }}/>
					</Grid2>
				</Grid2>
			</Grid2>
		</Grid2>
	)
}

export default Chat;