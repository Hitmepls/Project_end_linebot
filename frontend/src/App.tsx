import { useState } from "react";
import GoogleMap from "./component/Map";
import Test from "./component/Test";
import Nav from "./component/Nav";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const HeadingText = "เว็บไซต์รายงานอุบัติเหตุ";
function App() {
  console.log(window.location.pathname);
  const [filterOn, setFiltherOn] = useState(false);
  return (
    <div className="App">
      <Nav
        data={HeadingText}
        setfilter={(item: boolean) => setFiltherOn(item)}
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <GoogleMap
                filter={filterOn}
                setfilter={(item: boolean) => setFiltherOn(item)}
              />
            }
          />
          <Route path="/Test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
