import { Outlet } from "react-router-dom";
import TopHeader from "./components/TopHeader";
import CategoryBar from "./components/CategoryBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="min-h-screen bg-primary">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <TopHeader />
      <CategoryBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
