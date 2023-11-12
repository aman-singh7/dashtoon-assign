import {
  useRef,
  useState,
  forwardRef,
  ForwardedRef,
  useImperativeHandle,
} from "react";
import { Avatar, Button, Col, Row, message } from "antd";
import "features/CreateComic/index.css";
import ImageBox from "features/CreateComic/components/ImageBox";
import SpeechBubble, { SpeechBubbleDirection } from "./components/SpeechBubble";
import { FileImageOutlined, LockFilled, UserOutlined } from "@ant-design/icons";
import { useScreenshot } from "@breezeos-dev/use-react-screenshot";
import { Mode } from "app";

export interface CreateCompicProps {
  className: string;
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export type CreateComicHandle = {
  saveComic: (name: string) => void;
};

const CreateComic: React.ForwardRefRenderFunction<
  CreateComicHandle,
  CreateCompicProps
> = (props: CreateCompicProps, comicRef: ForwardedRef<CreateComicHandle>) => {
  type Comic = {
    name: string;
    url: string;
  };

  const { className, mode, setMode } = props;
  const colCounts = [3, 4, 3];
  let [speechList, setSpeechList] = useState<React.ReactElement[]>([]);
  const [availableSpeechId, setAvailableSpeechId] = useState(0);
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  const [image, takeScreenshot] = useScreenshot();
  const [messageApi, contextHolder] = message.useMessage();
  const [savedComics, setSavedComics] = useState<Comic[]>([]);
  const deleteSpeech = (speechId: number) => {
    setSpeechList((speechList) =>
      speechList.filter((speech) => {
        return speech.props.id !== speechId;
      })
    );
  };

  const addSpeechBubble = (
    direction: SpeechBubbleDirection,
    positon?: { clientX: number; clientY: number }
  ) => {
    setAvailableSpeechId((availableSpeechId) => {
      setSpeechList((speechList) => [
        ...speechList,
        <SpeechBubble
          id={availableSpeechId}
          direction={direction}
          position={positon}
          deleteSpeech={() => deleteSpeech(availableSpeechId)}
        />,
      ]);
      return availableSpeechId + 1;
    });
  };

  type Menu = {
    title: string;
    icon: any;
  };

  const menuList: Menu[] = [
    {
      title: "Create comics",
      icon: <LockFilled className="menu-icon" />,
    },
  ];

  const handleScreenshot = async () => {
    if (ref.current) {
      const dataURI = await takeScreenshot(ref.current);
      if (dataURI) {
        const blob: Blob = await (await fetch(dataURI)).blob();
        const url = URL.createObjectURL(blob);
        return url;
      }
    }
    messageApi.error("Unexpected Error Happend");
    return "";
  };

  const saveComic = async (name: string) => {
    const url = await handleScreenshot();
    if (url !== "") {
      setSavedComics((savedComics) => [
        ...savedComics,
        {
          name,
          url,
        },
      ]);
    } else {
      messageApi.error("Can't save image");
    }
  };

  useImperativeHandle(
    comicRef,
    () => {
      return {
        saveComic,
      };
    },
    [messageApi, handleScreenshot, takeScreenshot]
  );

  return (
    <div className={`home-content-container ${className}`}>
      {contextHolder}
      <div className="home-drawer">
        <Avatar
          className="avatar"
          style={{ backgroundColor: "#87d068" }}
          icon={<UserOutlined />}
          size={"large"}
        />
        {menuList.map((menu: Menu, index) => (
          <div
            className={`menu ${
              mode === "Creator" && index === activeMenuIndex ? "active" : ""
            }`}
            onClick={() => {
              setSpeechList([]);
              setMode("Creator");
            }}
          >
            {menu.icon}
            <div className="menu-title">{menu.title}</div>
          </div>
        ))}
        <div className="divider">Saved Image</div>
        {savedComics.map((comic: Comic, index) => (
          <div
            className={`menu ${
              mode === "Display" && index === activeMenuIndex ? "active" : ""
            }`}
            onClick={() => setMode("Display")}
          >
            <FileImageOutlined className="menu-icon" />
            <div className="menu-title">{comic.name}</div>
          </div>
        ))}
      </div>
      {mode === "Creator" ? (
        <div ref={ref} className="home-content">
          {speechList}
          {colCounts.map((count: number, rowIndex: number) => (
            <Row gutter={[16, 32]} className="home-content-row">
              {Array.from({ length: count }).map((_, colIndex: number) => (
                <Col span={24 / count}>
                  <ImageBox
                    className="home-image-box"
                    addSpeechBubble={addSpeechBubble}
                  />
                </Col>
              ))}
            </Row>
          ))}
        </div>
      ) : (
        <img src={savedComics[activeMenuIndex].url} />
      )}
    </div>
  );
};

export default forwardRef(CreateComic);
