import "./index.css";
import TextArea from "antd/es/input/TextArea";
import {
  SearchOutlined,
  LoadingOutlined,
  ExportOutlined,
  DeleteOutlined,
  CloudDownloadOutlined,
  MessageOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";

import { Spin, Dropdown, message, Button } from "antd";
import { lazy, useState } from "react";
import { fetchComicFromText } from "app/api/HuggingFace/comics";
import type { MenuProps } from "antd";
import { Link } from "react-router-dom";
import { SpeechBubbleDirection } from "../SpeechBubble";

export interface ImageBoxProps {
  className: string;
  addSpeechBubble: (
    direction: SpeechBubbleDirection,
    positon?: { clientX: number; clientY: number }
  ) => void;
}

const ImageBox: React.FC<ImageBoxProps> = (props: ImageBoxProps) => {
  const { className, addSpeechBubble } = props;
  const [image, setImage] = useState<string>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  let prompt = "";

  const onPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    prompt = event.target.value;
  };

  const onPromptSubmit = async (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setImageLoading(true);
    try {
      const imageURL = await fetchComicFromText(prompt);
      setImage(imageURL);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error(String(error));
      }
    }
    setImageLoading(false);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span>Add Dialogue</span>,
      icon: <MessageOutlined />,
      children: [
        {
          key: "1-1",
          label: <span>Left facing</span>,
          icon: <LeftOutlined />,
          onClick: (event) => {
            const mouseEvent = event.domEvent as React.MouseEvent;
            addSpeechBubble("left", {
              clientX: mouseEvent.clientX,
              clientY: mouseEvent.clientY,
            });
          },
        },
        {
          key: "1-2",
          label: <span>Right facing</span>,
          icon: <RightOutlined />,
          onClick: (event) => {
            const mouseEvent = event.domEvent as React.MouseEvent;
            addSpeechBubble("right", {
              clientX: mouseEvent.clientX,
              clientY: mouseEvent.clientY,
            });
          },
        },
      ],
    },
    {
      key: "2",
      label: <span>Remove Image</span>,
      icon: <DeleteOutlined />,
      danger: true,
    },
    {
      key: "3",
      label: (
        <Link to={image ?? "#"} target="_blank">
          Open Image
        </Link>
      ),
      icon: <ExportOutlined />,
    },
    {
      key: "4",
      label: <span>Download Image</span>,
      icon: <CloudDownloadOutlined />,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["contextMenu", "click"]}>
      <div className={`image-box ${className}`}>
        {contextHolder}
        {!imageLoading && image ? (
          <img className="image-box-image" src={image} alt="comic" />
        ) : (
          <>
            <div className="image-box-prompt-hint">
              <p>Write a Prompt to Generate Image for this segment</p>
            </div>
            <div className="image-box-text-group">
              <TextArea
                className="image-box-text"
                placeholder="Search for the image"
                autoSize={{ maxRows: 6, minRows: 2 }}
                onChange={onPromptChange}
              />
              {!imageLoading ? (
                <SearchOutlined
                  className="image-box-search"
                  onClick={onPromptSubmit}
                />
              ) : (
                <Spin
                  className="image-loader"
                  indicator={<LoadingOutlined spin />}
                />
              )}
            </div>
          </>
        )}
      </div>
    </Dropdown>
  );
};

export default ImageBox;
