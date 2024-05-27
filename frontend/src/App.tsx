import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../.winglibs/wing-env.d.ts";
import Home from "./components/Home.tsx";
import "./App.css";
import Result from "./components/Result.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result/>}/>
      </Routes>
    </BrowserRouter>
  )
	
}
