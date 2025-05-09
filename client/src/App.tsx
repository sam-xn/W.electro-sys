import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'

const App = () => {
    return (
        <div className="absolute inset-8">
            <div className="grid grid-cols-6">
                <div className="mr-8">
                    <Sidebar />
                </div>
                <div className="ml-8 col-span-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default App
