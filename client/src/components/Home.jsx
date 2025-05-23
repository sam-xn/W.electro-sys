import Sidebar from '/src/components/Sidebar';
import { Heart } from 'lucide-react'

export default function Home() {
    const div_classname = "max-w-full mr-4 p-8 rounded shadow border border-slate-500";
	return (
		<>
			<div className="grid grid-cols-6">
				<div className=""><Sidebar /></div>
				<div className="col-span-5 h-full align-items-center">
					<div className={div_classname + " bg-[#eff1fc] text-[#544B76] font-semibold h-full"}>
						<div className="grid grid-rows-3 gap-8">
							<div></div>
							<div className="flex gap-8 text-4xl mx-12 my-4">
								<p>Waterloo Eletro..</p><p>- less system, more plating -</p>
							</div>
							<div className="mx-24 text-3xl flex gap-12">
								<p> but here's a database, in case it helps.</p>
								<div className="flex gap-2"> <Heart className="mt-3 mx-1"/> sam </div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</>
	);
}