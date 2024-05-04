import "./globals.css";
import type {Metadata} from "next";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
	title: "Portifolio",
	description: "Placeholder",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<a
				className="githubLink"
				href="https://github.com/JosueMonteiroUchoaAlves/"
			>
				Josué Uchôa
			</a>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
