"use client";

import {useEffect} from "react";

interface propiertis {
	word: String;
}
export default function Myname(props: propiertis) {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	function changeText(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		let interation = 0;
		const interval = setInterval(() => {
			event.currentTarget.innerText = event.currentTarget.innerText
				.split("")
				.map((letter: String, index: number) => {
					if (index < interation) {
						return props.word[index];
					} else {
						return letters[Math.floor(Math.random() * 26)];
					}
				})
				.join("");

			if (interation >= props.word.length) clearInterval(interval);

			interation += 1 / 3;
		}, 30);
	}

	return (
		<div className="text-9xl m-48 font-mono font-semibold">
			<a
				className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
				href="https://github.com/JosueMonteiroUchoaAlves"
				target="_blank"
				rel="noopener noreferrer"
				onMouseEnter={(event) => changeText(event)}
			>
				JOSUE UCHOA
			</a>
		</div>
	);
}
