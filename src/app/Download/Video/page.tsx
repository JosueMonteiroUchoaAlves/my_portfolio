"use client";

import Image from "next/image";
import {useEffect, useState} from "react";

interface VideoMetadata {
	thumbnail: string;
	title: string;
	length: number;
}

export default function Download() {
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

	function getInfoVideo(url: string) {
		const regex =
			/(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([^"&?\/\s]{11}).*?[?&]ab_channel=([^"&?\/\s]+)/;
		const match = url.match(regex);

		if (match) {
			const videoId = match[1];
			const canal = match[2];

			return [videoId, canal];
		} else {
			return ["", ""];
		}
	}
	async function getVideoMetadata(videoLink: string) {
		const infoVideo = getInfoVideo(videoLink);
		if (infoVideo[0] === "" || infoVideo[1] === "") {
			alert(
				infoVideo[1] === ""
					? "O Link precisa conter o nome do canal, procure copiar o link completo. Erro ao buscar informações do vídeo, verifique se o link digitado está correto ou recarregue a página."
					: "Erro ao buscar informações do vídeo, verifique se o link digitado está correto ou recarregue a página."
			);
			return;
		}
		const pageResponse = await fetch(
			`/api/getVideoInfo/${infoVideo[0]}/${infoVideo[1]}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const metadata = await pageResponse.json();
		setVideoMetadata(metadata);
	}
	async function getVideo(videoLink: string) {
		const infoVideo = getInfoVideo(videoLink);
		const pageResponse = await fetch(
			`/api/downloadVideo/${infoVideo[0]}/${infoVideo[1]}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
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
							<div className="flex-col ml-5 w-6/12">
								<h2 className="text-xl font-semibold ">
									{videoMetadata.title}
								</h2>
								<p>
									{Math.floor(videoMetadata.length / 60)}:
									{(videoMetadata.length % 60).toString().padStart(2, "0")}
								</p>
								<button
									className="mt-5 bottom-2 p-2 bg-neutral-800/20 rounded-lg"
									onClick={() => {
										getVideo(link);
									}}
								>
									Baixar
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
