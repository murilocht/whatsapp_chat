import { createServer } from 'node:http';
import { Server as SocketIO } from "socket.io";
import { makeWASocket, isJidBroadcast, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers, useMultiFileAuthState } from '@whiskeysockets/baileys';

const server = createServer();
var tentativas = 0;
var qrcode = "";
var sessao;
const io = new SocketIO(server, { cors: { origin: "*" } });

io.on("connection", socket => {
	console.log("Alguem se conectou no servidor");

	socket.on("send-message", (data) => {
		if (sessao != null) {
			sessao.sendMessage(`${data.dest}@s.whatsapp.net`, {
				text: data.message
			});
		}
	});

	socket.on("receive-qrcode", (data) => {
		if (qrcode != "") {
			socket.emit("session-qrcode", qrcode);
		}
	});

	socket.on("reconnect-session", (data) => {
		qrcode = "";
		tentativas = 0;
		initWASocket();
	});
});

const initWASocket = async () => {
	const { version } = await fetchLatestBaileysVersion();
	const { state, saveCreds } = await useMultiFileAuthState('session')

	var wsocket = makeWASocket({
		printQRInTerminal: false,
		browser: Browsers.appropriate("Desktop"),
		auth: state,
		version,
		shouldIgnoreJid: jid => isJidBroadcast(jid),
	});

	wsocket.ev.on("connection.update", async ({ connection, qr }) => {
		if (connection === "close") {
			initWASocket();
			return;
		}

		if (connection === "open") {
			qrcode = "";
			tentativas = 0;
			sessao = wsocket;

			var foto = "";
			var numero = "";

			try {
				foto = await wsocket.profilePictureUrl(wsocket.user.id);
				numero = String(wsocket.user.id).split(":")[0];
			} catch (e) {
				console.log("Erro ao extrair número de foto do seu contato	");
			}

			io.emit("session-open", { foto, nome: wsocket.user.name, telefone: numero });
			return;
		}

		if (qr !== undefined) {
			if (tentativas >= 3) {
				wsocket.ev.removeAllListeners("connection.update");
				wsocket.ws.close();
				wsocket = null;
				qrcode = "";
				sessao = null;

				io.emit("session-closed");
			} else {
				tentativas += 1;
				qrcode = qr;

				io.emit("session-qrcode", qr);
			}
		}
	});

	wsocket.ev.on("messages.upsert", async (messageUpsert) => {
		try {
			for (const i in messageUpsert) {
				const messages = messageUpsert[i];

				for (const j in messages) {
					const message = messages[j];
					var msg;
					var eu = message.key.fromMe;

					if (message.message?.conversation) {
						msg = message.message?.conversation;
					} else if (message.message?.extendedTextMessage?.text) {
						msg = message.message?.extendedTextMessage?.text;
					}

					io.emit("update-messages", { msg, eu });
				}
			}
		} catch (e) {
			console.log('Erro ao obter imagens');
		}
	});

	wsocket.ev.on("creds.update", saveCreds);
}
initWASocket();

server.listen(3000, () => {
	console.log('Servidor rodando na porta 3000');
});