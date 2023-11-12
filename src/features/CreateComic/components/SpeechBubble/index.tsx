import { useState } from "react";
import "./index.css";
import Draggable from "react-draggable";
import {
  LockOutlined,
  LockTwoTone,
  UnlockOutlined,
  UnlockTwoTone,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

type SpeechBubbleDirection = "left" | "right";

export interface SpeechBubbleProps {
  direction: SpeechBubbleDirection;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = (
  props: SpeechBubbleProps
) => {
  const { direction } = props;
  const [locked, setLocked] = useState(false);

  const lockClickHanlder = () => {
    setLocked((locked) => !locked);
  };

  return (
    <Draggable bounds="parent" disabled={locked}>
      <div
        className={`speech-bubble bubble ${direction}`}
        style={{ cursor: !locked ? "grab" : "auto" }}
      >
        <p
          className="speech-bubble-text"
          placeholder="speech"
          contentEditable={!locked}
        />
        <div
          className="speech-bubble-lock"
          onClick={lockClickHanlder}
          style={{ display: locked ? "none" : "block" }}
        >
          {!locked ? <UnlockTwoTone /> : <LockTwoTone />}
        </div>
      </div>
    </Draggable>
  );
};

export default SpeechBubble;
