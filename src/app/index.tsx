import { SaveFilled, ShareAltOutlined } from "@ant-design/icons";
import CreateComic, { CreateComicHandle } from "features/CreateComic";
import Modal from "antd/es/modal/Modal";
import "app/index.css";
import { useRef, useState } from "react";
import { Button, Input } from "antd";

export type Mode = "Creator" | "Display";

const App: React.FC = () => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("Creator");
  const ref = useRef<CreateComicHandle>(null);
  let fileName = "";

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    fileName = event.target.value;
  };
  const handleNameSave = () => {
    if (ref.current) {
      ref.current.saveComic(fileName);
    }
    setIsSaveModalOpen(false);
  };

  return (
    <div className="home-container">
      <div className="app-bar">
        <p className="app-bar-title">Comicify</p>
        {mode === "Creator" ? (
          <SaveFilled onClick={() => setIsSaveModalOpen(true)} />
        ) : (
          <ShareAltOutlined />
        )}
      </div>
      <Modal
        title="Comic Name"
        footer={[
          <Button type="primary" onClick={handleNameSave}>
            Save
          </Button>,
        ]}
        open={isSaveModalOpen}
        onCancel={() => setIsSaveModalOpen(false)}
      >
        <Input onChange={handleFileNameChange} />
      </Modal>
      <CreateComic
        mode={mode}
        setMode={setMode}
        ref={ref}
        className="home-content-wrapper"
      />
    </div>
  );
};

export default App;
