import { Outlet } from 'react-router-dom'
//import Sidebar from './components/Sidebar'

const App = () => {
    return (
        <div className="absolute inset-8">
            {/*<div className="grid grid-cols-6">*/}
            {/*    <div className="mr-8">*/}
            {/*        <Sidebar />*/}
            {/*    </div>*/}
                <div className="">
                    <Outlet />
                </div>
            {/*</div>*/}
        </div>
    );
}

export default App
