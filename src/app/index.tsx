import logo from "app/assets/logo.svg";
import "app/index.css";
import { useEffect } from "react";
import { fetchComicFromText } from "./api/HuggingFace/comics";

const App: React.FC = () => {
  console.log("process env", process.env);
  useEffect(() => {
    const fetchApis = async () => {
      const url = await fetchComicFromText("Astronaut riding a horse");
      console.log(url);
    };

    fetchApis();
  }, []);

  return <div className="App"></div>;
};

export default App;
