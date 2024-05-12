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
	const [playlistLink, setPlaylistLink] = useState("");
	const [Loading, setLoading] = useState(false);
	const [searchWord, setSearchWord] = useState("");
	const [playlistTitle, setplaylistTitle] = useState("");
	const [resultOfSearch, setResultOfSearch] = useState<PlaylistMetadata[]>([]);
	const [PlaylistVideosMetadata, setPlaylistVideosMetadata] = useState<
		PlaylistMetadata[]
	>([]);

	function Search() {
		const Search = PlaylistVideosMetadata.filter((key, value) =>
			key.title.toLowerCase().includes(searchWord)
		);
		setResultOfSearch(Search);
	}

	useEffect(() => {
		setEncryptedLink(wordToBase32(playlistLink));
	}, [playlistLink]);

	async function getPlaylistMetadata() {
		setLoading(true);
		const apiResponseForPlaylistTitle = await fetch(
			`/api/getplaylistTitle/${EncryptedLink}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				keepalive: true,
			}
		);
		const responseForPlaylistTitle = await apiResponseForPlaylistTitle.json();
		setplaylistTitle(responseForPlaylistTitle.title);
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
		setLoading(false);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between pt-24">
			<div className="justify-around grid-cols-2 w-6/12">
				<h1 className="text-4xl font-semibold p-10">
					{PlaylistVideosMetadata.length !== 0 ? (
						<p>{playlistTitle}</p>
					) : (
						<p>Cole o link da playlist que você deseja pesquisar</p>
					)}
				</h1>
				<div className="relative w-12/12 mx-10 ">
					<input
						className="pr-16 text-2xl p-1 font-sans font-medium w-full mt-5 text-black rounded-lg indent-2"
						placeholder="Digite aqui"
						title="Link do vídeo"
						onChange={(e) => {
							setPlaylistLink(e.target.value);
						}}
					/>

					<button
						className="absolute hover:bg-transparent hover:text-black transform duration-200 hover:backdrop-blur-sm p-1 px-2 text-base bg-black rounded-lg mt-6 right-2 flex-initial w-2/12 "
						title="submit"
						onClick={() => {
							getPlaylistMetadata();
						}}
					>
						Get
					</button>
				</div>
				<div className="justify-center flex">
					<div className="relative w-6/12 mx-10 ">
						<input
							className="pr-16 text-2xl p-1 font-sans font-medium w-full mt-5 text-black rounded-lg indent-2"
							placeholder="Digite aqui"
							onChange={(e) => {
								setSearchWord(e.target.value);
							}}
						/>

						<button
							className="absolute hover:bg-transparent hover:text-black transform duration-200 hover:backdrop-blur-sm p-1 px-2 text-base bg-black rounded-lg mt-6 right-2 flex-initial w-2/12 "
							title="submit"
							onClick={() => {
								Search();
							}}
						>
							Search
						</button>
					</div>
				</div>

				{Loading && (
					<div className="flex justify-center">
						<div className="mx-20 text-center text-xl animate-pulse w-2/12 p-1 rounded-lg  mt-10 bg-neutral-800/50">
							Carregando
						</div>
					</div>
				)}
				<div className="flex flex-wrap justify-center">
					{PlaylistVideosMetadata.length !== 0 &&
						!searchWord &&
						PlaylistVideosMetadata.map((video) => (
							<div
								key={video.title}
								className="mt-5 mx-20 flex-row w-3/5 rounded-lg px-5 py-4 transition-colors bg-gray-100 bg-neutral-800/50"
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

				<div className="flex flex-wrap justify-center">
					{resultOfSearch.length !== 0 &&
						searchWord &&
						resultOfSearch.map((video) => (
							<div
								key={video.title}
								className="mt-5 mx-20 flex-row w-3/5 rounded-lg px-5 py-4 transition-colors bg-gray-100 bg-neutral-800/50"
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
					{resultOfSearch.length === 0 && searchWord && (
						<div className="mx-20 flex font-sans w-5/12 font-medium text-yellow-100 text-lg p-2 rounded-lg  mt-10 bg-yellow-600/80">
							Sem resultados para sua pesquisa
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								className="w-8 h-8 ml-4 text-yellow-100"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
								/>
							</svg>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
