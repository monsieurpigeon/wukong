import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Chapter from "./chapter";
import "./index.css";
import Stats from "./stats";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Chapter />,
  },
  { path: "/stats", element: <Stats /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
