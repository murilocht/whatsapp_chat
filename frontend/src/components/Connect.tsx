import { Cached, MoreVert, SettingsOutlined } from '@mui/icons-material'
import { Card, Container, Grid2, Typography } from '@mui/material'
import QRCode from 'react-qr-code'
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

const Connect = ({io}: {io: Socket | undefined}) => {
	const [qr, setQr] = useState("");

	useEffect(() => {
		io?.on("session-qrcode", (data) => {
			setQr(data);
		});

		io?.emit("receive-qrcode");
	}, [io]);

	return (
		<Container>
			<Card>
				<Grid2 container direction={'row'}>
					<Grid2 size={9}>
						<Typography variant="h5" gutterBottom={true}>Use o WhatsApp no seu computador</Typography>

						<Typography variant="h6">1. Abra o WhatsApp no seu celular</Typography>
						<Typography variant="h6">2. Toque em Mais opções <MoreVert /> no Android ou em <SettingsOutlined/> no iPhone</Typography>
						<Typography variant="h6">3. Toque em Dispositivos conectados  e, em seguida, em Conectar dispositivo</Typography>
						<Typography variant="h6">4. Aponte seu celular para esta tela para escanear o QR code.</Typography>
					</Grid2>
					<Grid2 size={3}>
						{
							qr ? <QRCode value={qr} /> : <Cached sx={{ fontSize: 200 }} />
						}
					</Grid2>
				</Grid2>
			</Card>
		</Container>
	)
}

export default Connect;