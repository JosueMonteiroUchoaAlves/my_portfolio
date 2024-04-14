import Image from "next/image";
import Myname from "@/components/myname.tsx";
import Cards from "@/components/cards";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<Myname word={"JOSUE UCHOA"} />
			<Cards></Cards>
		</main>
	);
}
