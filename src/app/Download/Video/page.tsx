"use client";

import Image from "next/image";
import {useEffect, useState} from "react";
interface VideoMetadata {
	thumbnail: string;
	title: string;
	length: number;
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
	const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({
		thumbnail: "",
		title: "",
		length: 0,
	});
	const [video, setVideo] = useState<string>("");

	useEffect(() => {
		if (video !== "") {
			const link = document.createElement("a");
			link.href = video;
			link.download = videoMetadata.title + ".mp4";
			link.click();
		}
	}, [video]);

	async function getVideoMetadata(videoLink: string) {
		setEncryptedLink(wordToBase32(link));
		const pageResponse = await fetch(`/api/getVideoInfo/${EncryptedLink}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const metadata = await pageResponse.json();
		setVideoMetadata(metadata);
	}
	async function getVideo(videoLink: string) {
		const pageResponse = await fetch(`/api/downloadVideo/${EncryptedLink}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const videoBase64 = await pageResponse.text();

		const byteCharacters = atob(videoBase64);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], {type: "video/mp4"});

		const url = URL.createObjectURL(blob);
		setVideo(url);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between pt-24">
			<div className="justify-around grid-cols-2">
				<h1 className="text-4xl font-semibold p-10">
					Cole o link do vídeo que você deseja baixar:
				</h1>
				<div className="relative w-12/12 mx-10 ">
					<input
						className="absolute pr-16 text-2xl p-1 font-sans font-medium w-full mt-5 text-black rounded-lg indent-2"
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
							getVideoMetadata(link);
						}}
					>
						Enviar
					</button>
				</div>
				{videoMetadata.length !== 0 && (
					<div className="box-content aspect-auto w-10/12 mt-28 mb-5 flex-row mx-20 rounded-lg border px-5 py-4 transition-colors bg-gray-100 border-neutral-700 bg-neutral-800/50">
						<div className="flex items-center">
							<Image
								className="rounded-lg drop-shadow-lg"
								src={videoMetadata.thumbnail}
								alt="thumbnail"
								width={288}
								height={162}
							/>
							<div className="text-center">
								<div className="flex-col w-full ml-5">
									<h2 className="text-xl font-semibold ">
										{videoMetadata.title}
									</h2>
									<p className="text-right mr-4 mt-1 ">
										{Math.floor(videoMetadata.length / 60)}:
										{(videoMetadata.length % 60).toString().padStart(2, "0")}
									</p>
									<button
										className="mt-5 bottom-2 p-2 bg-neutral-800 rounded-lg flex"
										onClick={() => {
											getVideo(link);
										}}
									>
										Baixar
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6 ml-2"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
