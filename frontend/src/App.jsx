import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
// import './App.css'
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home.jsx"
import Navbar from "./component/Navbar.jsx";
// import NavbarLogin from "./component/NavbarLogin.jsx";
import Homepage from "./pages/Homepage.jsx";
import Profile from "./pages/Profile.jsx";
import PayCom from "./pages/PayCom.jsx";
import Download from "./pages/Download.jsx";

//admin
import AddBot from "./AdminPage/AddBot.jsx";


const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
const router = createBrowserRouter([
  {

    element: <Layout/>,
    children:[
      {
        path:"/",
        element:<Home/>
      }
    ]
  },
  {

    element:<Layout/>,
    children:[
      {
        path:"/home",
        element:<Homepage/>
      },
      {
        path:"/profile",
        element:<Profile/>
      },
      {
        path:"/pay",
        element:<PayCom/>
      },
      {
        path:"/downloads",
        element:<Download/>
      },
      {
        path:"/admin/addbot",
        element:<AddBot/>
      }
    ]
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    element:<Layout/>,
    children:[
      {
        path:"/Profile",
        element:<Profile/>
      }
    ]
  },

]);

function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}


export default App
