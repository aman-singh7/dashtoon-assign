import { useState } from "react";
import "./index.css";
import Draggable from "react-draggable";
import { DeleteTwoTone, LockTwoTone, UnlockTwoTone } from "@ant-design/icons";

export type SpeechBubbleDirection = "left" | "right";

export interface SpeechBubbleProps {
  direction: SpeechBubbleDirection;
  deleteSpeech: VoidFunction;
  position?: { clientX: number; clientY: number };
  id: number;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = (
  props: SpeechBubbleProps
) => {
  const { direction, id, deleteSpeech, position } = props;
  const [locked, setLocked] = useState(false);

  const lockClickHanlder = () => {
    setLocked((locked) => !locked);
  };

  return (
    <Draggable
      defaultPosition={
        position ? { x: position.clientX, y: position.clientY } : undefined
      }
      bounds="parent"
      disabled={locked}
      key={id}
    >
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
          className="speech-bubble-icons"
          style={{ display: locked ? "none" : "flex" }}
        >
          <>
            <div className="icon" onClick={lockClickHanlder}>
              {!locked ? <UnlockTwoTone /> : <LockTwoTone />}
            </div>
            <DeleteTwoTone
              className="icon"
              twoToneColor="red"
              onClick={deleteSpeech}
            />
          </>
        </div>
      </div>
    </Draggable>
  );
};

export default SpeechBubble;
