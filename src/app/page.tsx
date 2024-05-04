import Image from "next/image";
import Myname from "@/components/myname.tsx";
import Cards from "@/components/cards";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<h1 className="uri-text-logo">Welcome</h1>
			<Cards></Cards>
		</main>
	);
}
