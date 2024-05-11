export default function Download() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="justify-around">
				<p className="mb-5 text-2xl font-bold text-center">
					Qual serviço te interessa?:
				</p>
				<a
					className="text-center block m-5 text-xl font-semibold bg-black p-4 rounded-xl hover:scale-105 ease-in-out transition-transform duration-600 hover:shadow-blue-700 hover:shadow-md"
					href="/Download/Video"
				>
					Baixar video
				</a>
				<a className="text-center block m-5 text-xl font-semibold bg-black p-4 rounded-xl hover:scale-105 ease-in-out transition-transform duration-600 hover:shadow-blue-700 hover:shadow-md">
					Baixar videos de uma playlist
				</a>
				<a className="text-center block m-5 text-xl font-semibold bg-black p-4 rounded-xl hover:scale-105 ease-in-out transition-transform duration-600 hover:shadow-blue-700 hover:shadow-md">
					Baixar audio
				</a>
				<a className="text-center block m-5 text-xl font-semibold bg-black p-4 rounded-xl hover:scale-105 ease-in-out transition-transform duration-600 hover:shadow-blue-700 hover:shadow-md">
					Baixar audio de uma playlist
				</a>
				<a
					className="text-center block m-5 text-xl font-semibold bg-black p-4 rounded-xl hover:scale-105 ease-in-out transition-transform duration-600 hover:shadow-blue-700 hover:shadow-md"
					href="/Download/SearchPlaylist"
				>
					Pesquisar na playlist
				</a>
			</div>
		</main>
	);
}
