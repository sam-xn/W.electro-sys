import { Link } from "react-router-dom";
import { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { HardDrive } from 'lucide-react'
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
    { title: 'Jobs', iconName: 'tag', href: '/jobs' },
]

const receiptsItems: Item[] = [
    { title: 'Delivery Slips', iconName: 'receipt-text', href: '/receipts' }
]

const contactsItems: Item[] = [
    { title: 'Customers', iconName: 'receipt-text', href: '/customers' }
]

const SidebarSection = ({ title, items }: { title: string; items: Item[] }) => (
    <>
        <h3 className="mx-5 mb-3 text-sm text-[#777da3]">{ title }</h3>
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

    return (
        <Link
            to={ href}
            className={`group flex items-center gap-3 rounded pl-8 py-3 transition-all duration-300 text-[#544B76] hover:bg-[#DEE1F4] md:px-8 lg:px-1`}
        >
            <Suspense fallback={ fallback }>
                <Icon
                    size={ 18 }
                    className={`transition-all duration-300 text-[#544B76]`}
                />
            </Suspense>
            <h3 className="text-md text-[#544B76] leading-4">{ title }</h3>
        </Link>
    )
}

export default function Sidebar() { 
    return (
        <>
            <aside className="h-auto w-[calc(100%+25px)] border border-slate-500 rounded-sm mr-6 mb-16 bg-[#eff1fc]">
                <div className="flex gap-2 justify-center mr-6 mt-2">
                    <div className="pt-8">
                        <HardDrive color="#544B76" size="18" />
                    </div>
                    <Link className="pt-6 border-b border-[#544B76] pb-6 text-lg hover:text-xl" to={'/'}>
                            w. electro - sys
                    </Link>
                </div>
                <nav className="p-4 md:p-5">
                    <SidebarSection title="" items={ allItems } /><div className="mt-10"></div>
                    <SidebarSection title="Open Orders" items={openOrdersItems} /><div className="mt-10"></div>
                    <SidebarSection title="Receipts" items={receiptsItems} /><div className="mt-10"></div>
                    <SidebarSection title="Contacts" items={contactsItems} /><div className="mt-10"></div>
                </nav>
            </aside>
        </>
)}
