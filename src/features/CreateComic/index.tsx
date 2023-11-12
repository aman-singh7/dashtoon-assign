import { useState } from "react";
import { Avatar, Col, Row } from "antd";
import "features/CreateComic/index.css";
import ImageBox from "features/CreateComic/components/ImageBox";
import SpeechBubble, {
  SpeechBubbleDirection,
  SpeechBubbleProps,
} from "./components/SpeechBubble";
import { LockFilled, UserOutlined } from "@ant-design/icons";

export interface CreateCompicProps {
  className: string;
}

const CreateComic: React.FC<CreateCompicProps> = (props: CreateCompicProps) => {
  const { className } = props;
  const colCounts = [3, 4, 3];
  let [speechList, setSpeechList] = useState<React.ReactElement[]>([]);
  const [availableSpeechId, setAvailableSpeechId] = useState(0);
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);

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
      title: "My comics",
      icon: <LockFilled className="menu-icon" />,
    },
  ];

  return (
    <div className={`home-content-container ${className}`}>
      <div className="home-drawer">
        <Avatar
          className="avatar"
          style={{ backgroundColor: "#87d068" }}
          icon={<UserOutlined />}
          size={"large"}
        />
        {menuList.map((menu: Menu, index) => (
          <div className={`menu ${index === activeMenuIndex ? "active" : ""}`}>
            {menu.icon}
            <div className="meny-title">{menu.title}</div>
          </div>
        ))}
      </div>
      <div className="home-content">
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
    </div>
  );
};

export default CreateComic;
