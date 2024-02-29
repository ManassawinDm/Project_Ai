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
import NavbarLogin from "./component/NavbarLogin.jsx";
import Homepage from "./pages/Homepage.jsx";
import Profile from "./pages/Profile.jsx";
import PayCom from "./pages/PayCom.jsx";


const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
const LayoutLogin = () => {
  return (
    <>
      <NavbarLogin />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path:"/",
        element:<Home/>
      }
    ]
  },
  {
    path:"/",
    element:<LayoutLogin/>,
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

]);

function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}


export default App
