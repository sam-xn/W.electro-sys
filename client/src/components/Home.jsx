import Sidebar from '/src/components/Sidebar';
import { HardDrive } from 'lucide-react'
import { Heart } from 'lucide-react'

export default function Home() {
    const div_classname = "max-w-full mr-4 p-8 rounded shadow border border-slate-500";
	return (
		<>
			<div className="grid grid-cols-6">
				<div className=""><Sidebar /></div>
				<div className="col-span-5 h-full align-items-center">
					<div className={div_classname + " bg-[#eff1fc] text-[#544B76] font-semibold h-full"}>
						<div className="grid grid-rows-4 gap-8">
							<div></div>
							<div className="flex gap-8 text-4xl mx-12 my-8"><HardDrive className="" size={46} /> Waterloo Electro-System </div>
							{/*<div className="text-4xl grid grid-cols-3"><div></div><p className="col-span-2">welcome to your database -</p></div>*/}
							<div className="mt-12 text-3xl tracking-wide grid grid-cols-5">
							<div></div>
								<p className="col-span-2"> welcome to your database.</p>
								{/*<div className="flex gap-2"> -<Heart className="mt-3 mx-1" /> sam </div>*/}
							</div>
						</div>
					</div>
				</div>
			</div>

		</>
	);
}