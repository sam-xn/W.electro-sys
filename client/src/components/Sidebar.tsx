import { Link } from "react-router-dom";
import { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { lazy, Suspense } from 'react'

interface Item {
    title: string
    iconName: keyof typeof dynamicIconImports
    href: string
}

const allItems: Item[] = [
    { title: 'All Orders', iconName: 'logs', href: '/orders' }
]

const openOrdersItems: Item[] = [
    { title: 'Incoming', iconName: 'arrow-down-wide-narrow', href: '/jobs/status/incoming' },
    { title: 'Received', iconName: 'tag', href: '/jobs/status/received' },
    { title: 'Processed', iconName: 'sparkles', href: '/jobs/status/processed' },
    { title: 'Delivered', iconName: 'handshake', href: '/jobs/status/delivered' },
]

const receiptsItems: Item[] = [
    { title: 'Delivery Slips', iconName: 'receipt-text', href: '/receipts' }
]

const SidebarSection = ({ title, items }: { title: string; items: Item[] }) => (
    <>
        <h3 className="mx-5 mb-3 text-xs text-[#777da3]">{ title }</h3>
        { items.map((item, idx) => (
            <SidebarItem key={ idx } title={ item.title } iconName={ item.iconName } href={ item.href } />
        ))}
    </>
)

const fallback = <div style={{ background: '#ddd', width: 18, height: 18 }} />

interface PropsType extends Omit<LucideProps, 'ref'> {
    title: string
    iconName: keyof typeof dynamicIconImports
    href: string
}

const SidebarItem: React.FC<PropsType> = ({ title, iconName, href }) => {
    const Icon = lazy(dynamicIconImports[iconName])

    const isActive = false;

    return (
        <Link
            to={ href}
            className={`group flex items-center gap-3 rounded px-4 py-3 transition-all duration-300 hover:bg-[#DEE1F4] hover:text-[#5A6ACF] md:px-5 ${isActive ? 'bg-[#DEE1F4] font-medium text-[#5A6ACF]' : 'font-normal text-[#777da3]' }`}
        >
            <Suspense fallback={ fallback }>
                <Icon
                    size={ 18 }
                    className={`${isActive ? '#5A6ACF' : '#A6ABC8'} text-[#A6ABC8] transition-all duration-300 group-hover:text-[#5A6ACF]`}
                />
            </Suspense>
            <h3 className="text-md leading-4">{ title }</h3>
        </Link>
    )
}

export default function Sidebar() { 
    return (
        <>
            <aside className="h-auto w-[calc(100%+25px)] border border-slate-500 rounded-sm mr-6 bg-[#eff1fc]">
                <nav className="p-4 md:p-5">
                    <SidebarSection title="" items={ allItems } /><div className="mt-10"></div>
                    <SidebarSection title="Open Orders : Jobs" items={openOrdersItems} /><div className="mt-10"></div>
                    <SidebarSection title="Receipts" items={receiptsItems} /><div className="mt-10"></div>
                </nav>
            </aside>
        </>
)}
