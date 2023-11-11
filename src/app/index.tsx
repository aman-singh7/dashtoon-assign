import { useEffect } from "react";
import { fetchComicFromText } from "app/api/HuggingFace/comics";
import { SettingFilled } from "@ant-design/icons";
import CreateComic from "features/CreateComic";
import "app/index.css";

const App: React.FC = () => {
  useEffect(() => {
    const fetchApis = async () => {
      const url = await fetchComicFromText("Astronaut riding a horse");
      console.log(url);
    };

    fetchApis();
  }, []);

  return (
    <div className="home-container">
      <div className="app-bar">
        <p className="app-bar-title">Comicify</p>
        <SettingFilled />
      </div>
      <CreateComic className="home-content-wrapper" />
    </div>
  );
};

export default App;
