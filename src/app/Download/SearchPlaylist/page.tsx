"use client";

import Image from "next/image";
import {useEffect, useState} from "react";
interface PlaylistMetadata {
	thumbnail: string;
	title: string;
	length: number;
	link: string;
}

function wordToBase32(word: string) {
	// Tabela de caracteres para base 32
	const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

	// Converter a palavra para uma matriz de bytes
	const bytes = [];
	for (let i = 0; i < word.length; i++) {
		bytes.push(word.charCodeAt(i));
	}

	let binaryString = "";
	for (let i = 0; i < bytes.length; i++) {
		binaryString += bytes[i].toString(2).padStart(8, "0");
	}

	// Adicionar zeros extras para garantir que o comprimento do binário seja múltiplo de 5
	const padding = 5 - (binaryString.length % 5);
	binaryString += "0".repeat(padding % 5);

	// Dividir o binário em grupos de 5 bits e convertê-los para base 32
	let base32 = "";
	for (let i = 0; i < binaryString.length; i += 5) {
		const chunk = binaryString.substr(i, 5);
		base32 += base32Chars[parseInt(chunk, 2)];
	}

	// Adicionar '=' para garantir que o comprimento da string seja múltiplo de 8
	const remainder = base32.length % 8;
	if (remainder !== 0) {
		base32 += "=".repeat(8 - remainder);
	}

	return base32;
}

export default function Download() {
	const [EncryptedLink, setEncryptedLink] = useState("");
	const [link, setLink] = useState("");
	const [carregando, setCarregando] = useState(false);
	const [PlaylistVideosMetadata, setPlaylistVideosMetadata] = useState<
		PlaylistMetadata[]
	>([]);

	useEffect(() => {
		setEncryptedLink(wordToBase32(link));
	}, [link]);

	async function getPlaylistMetadata() {
		setCarregando(true);
		const pageResponse = await fetch(`/api/getPlaylistInfo/${EncryptedLink}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			keepalive: true,
		});
		const byteArray = await pageResponse.arrayBuffer();
		const decoder = new TextDecoder();
		const metadataString = decoder.decode(byteArray);
		const metadataLines = metadataString.split("\n");

		const metadataArray = metadataLines
			.filter((line) => line.trim() !== "")
			.map((line) => JSON.parse(line));
		setPlaylistVideosMetadata(metadataArray);
		setCarregando(false);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between pt-24">
			<div className="justify-around grid-cols-2">
				<h1 className="text-4xl font-semibold p-10">
					Cole o link da playlist que você deseja pesquisar
				</h1>
				<div className="relative w-12/12 mx-10 ">
					<input
						className="pr-16 text-2xl p-1 font-sans font-medium w-full mt-5 text-black rounded-lg indent-2"
						placeholder="Digite aqui"
						title="Link do vídeo"
						onChange={(e) => {
							setLink(e.target.value);
						}}
					/>
					<button
						className="absolute hover:bg-transparent hover:text-black transform duration-200 hover:backdrop-blur-sm p-1 px-2 text-base bg-black rounded-lg mt-6 right-2 flex-initial w-2/12 "
						title="submit"
						onClick={() => {
							getPlaylistMetadata();
						}}
					>
						Enviar
					</button>
				</div>
				{carregando && (
					<div className="mx-20 text-xl animate-pulse w-2/12 p-1 rounded-lg text-center mt-10 bg-neutral-800/50">
						Carregando
					</div>
				)}
				<div className="flex flex-wrap justify-center">
					{PlaylistVideosMetadata.length !== 0 &&
						PlaylistVideosMetadata.map((video) => (
							<div
								key={video.title}
								className="mt-5 mx-20 flex-row w-3/5 rounded-lg border px-5 py-4 transition-colors bg-gray-100 bg-neutral-800/50"
							>
								<div className="flex items-center justify-center">
									<Image
										className="rounded-lg drop-shadow-lg"
										src={video.thumbnail}
										alt="thumbnail"
										width={144}
										height={81}
									/>
									<div className="text-center">
										<div className="flex-col w-full ml-5">
											<h2 className="font-semibold text-base">{video.title}</h2>
											<p className="text-right text-sm mr-4 mt-1 ">
												{Math.floor(video.length / 60)}:
												{(video.length % 60).toString().padStart(2, "0")}
											</p>
											<a
												className="mt-7 bottom-1 p-1.5 cursor-pointer hover:bg-emerald-500 transition-colors duration-300 text-sm bg-neutral-800 rounded-lg"
												onClick={() => {
													navigator.clipboard
														.writeText(video.link)
														.then(() => {
															alert("Link copiado com sucesso!");
														})
														.catch((error) => {
															alert("Erro ao copiar o link.");
															console.error("Erro ao copiar o link:", error);
														});
												}}
											>
												Copiar Link
											</a>
										</div>
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</main>
	);
}
