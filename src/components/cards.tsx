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
			className="flex row"
		>
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
			<div className="card">
				<div className="card-border"></div>
				<div className="card-content"></div>
			</div>
		</div>
	);
}
