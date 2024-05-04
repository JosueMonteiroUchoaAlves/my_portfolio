"use client";
import {useEffect, useRef} from "react";

export default function Cards() {
	const handleOnMouseMove = (e: MouseEvent) => {
		const cards = document.querySelectorAll(
			".cards"
		) as NodeListOf<HTMLElement>;
		cards.forEach((card) => {
			const rect = card.getBoundingClientRect(),
				x = e.clientX - rect.left,
				y = e.clientY - rect.top;
			card.style.setProperty("--mouse-x", `${x}px`);
			card.style.setProperty("--mouse-y", `${y}px`);
		});
	};
	useEffect(() => {
		document
			.getElementById("cards")
			?.addEventListener("mousemove", (e: MouseEvent) => {
				const cards = document.getElementsByClassName(
					"card"
				) as HTMLCollectionOf<HTMLElement>;
				for (const card of Array.from(cards)) {
					const rect = card.getBoundingClientRect(),
						x = e.clientX - rect.left,
						y = e.clientY - rect.top;

					card.style.setProperty("--mouse-x", `${x}px`);
					card.style.setProperty("--mouse-y", `${y}px`);
				}
			});
	});

	return (
		<div
			id="cards"
			className="flex flex-wrap"
		>
			<div className="card">
				<div className="card-border"></div>
				<div className="card-content p-4 z-10">
					<a
						href="./Download"
						className="group px-5 py-4 m-5"
						rel="noopener noreferrer"
					>
						<h2 className={`mb-3 text-2xl text-center font-semibold`}>
							Youtube video downloader{" "}
							<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
								-&gt;
							</span>
						</h2>
						<p className={`m-0 max-w-[30ch] text-center text-sm opacity-50`}>
							Effortlessly download videos and audio content from YouTube
						</p>
					</a>
				</div>
			</div>
			<div className="card">
				<div className="card-border"></div>
				<div className="card-content"></div>
			</div>
			<div className="card">
				<div className="card-border"></div>
				<div className="card-content"></div>
			</div>
			<div className="card">
				<div className="card-border"></div>
				<div className="card-content"></div>
			</div>
		</div>
	);
}
