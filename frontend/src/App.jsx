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
// In App.jsx or your router file
import RequireAuth from './component/RequireAuth'; // Adjust the path as necessary

// import NavbarLogin from "./component/NavbarLogin.jsx";
import Homepage from "./pages/Homepage.jsx";
import Profile from "./pages/Profile.jsx";
import PayCom from "./pages/PayCom.jsx";
import Download from "./pages/Download.jsx";

//admin
import AddBot from "./AdminPage/AddBot.jsx";
import QA from "./pages/qa.jsx";
import VerifyPort from "./pages/verifyport.jsx";
import Payment from "./AdminPage/Payment.jsx";
import AddCurrency from "./AdminPage/addcurrency.jsx";
import HistoryPage from "./pages/history.jsx";

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
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/home",
        element: (
          <RequireAuth allowedRoles={['user', 'admin']}>
            <Homepage/>
          </RequireAuth>
        )
      },
      {
        path: "/profile",
        element: (
          <RequireAuth allowedRoles={['user', 'admin']}>
            <Profile/>
          </RequireAuth>
        )
      },
      {
        path: "/pay",
        element: (
          <RequireAuth allowedRoles={['user', 'admin']}>
            <PayCom/>
          </RequireAuth>
        )
      },
      {
        path: "/downloads",
        element: (
          <RequireAuth allowedRoles={['user', 'admin']}>
            <Download/>
          </RequireAuth>
        )
      },
      {
        path: "/history",
        element: (
          <RequireAuth allowedRoles={['user', 'admin']}>
            <HistoryPage/>
          </RequireAuth>
        )
      },
      // Admin routes
      {
        path: "/admin/addbot",
        element: (
          <RequireAuth allowedRoles={['admin']}>
            <AddBot/>
          </RequireAuth>
        )
      },
      {
        path: "/Q&A",
        element: <QA />,
      },
      {
        path: "/admin/verify",
        element: (
          <RequireAuth allowedRoles={['admin']}>
            <VerifyPort/>
          </RequireAuth>
        )
      },
      {
        path: "/admin/payment",
        element: (
          <RequireAuth allowedRoles={['admin']}>
            <Payment/>
          </RequireAuth>
        )
      },
      {
        path: "/admin/addCurrency",
        element: (
          <RequireAuth allowedRoles={['admin']}>
            <AddCurrency/>
          </RequireAuth>
        )
      },
    ]
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/login",
    element: <Login/>
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
