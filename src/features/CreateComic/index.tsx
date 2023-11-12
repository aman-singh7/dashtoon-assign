import { useState } from "react";
import { Col, Row } from "antd";
import "features/CreateComic/index.css";
import ImageBox from "features/CreateComic/components/ImageBox";
import SpeechBubble, {
  SpeechBubbleDirection,
  SpeechBubbleProps,
} from "./components/SpeechBubble";

export interface CreateCompicProps {
  className: string;
}

const CreateComic: React.FC<CreateCompicProps> = (props: CreateCompicProps) => {
  const { className } = props;
  const colCounts = [3, 4, 3];
  let [speechList, setSpeechList] = useState<React.ReactElement[]>([]);
  const [availableSpeechId, setAvailableSpeechId] = useState(0);

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
    setSpeechList((speechList) => {
      const newList = [
        ...speechList,
        <SpeechBubble
          id={availableSpeechId}
          direction={direction}
          position={positon}
          deleteSpeech={() => deleteSpeech(availableSpeechId)}
        />,
      ];
      setAvailableSpeechId((availableSpeechId) => availableSpeechId + 1);
      return newList;
    });
  };

  return (
    <div className={`home-content-container ${className}`}>
      <div className="home-drawer"></div>
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
