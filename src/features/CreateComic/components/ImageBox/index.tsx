import "./index.css";
import TextArea from "antd/es/input/TextArea";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import { App, Spin } from "antd";
import { useState } from "react";
import { fetchComicFromText } from "app/api/HuggingFace/comics";

export interface ImageBoxProps {
  className: string;
}

const ImageBox: React.FC<ImageBoxProps> = (props: ImageBoxProps) => {
  const { className } = props;
  const [image, setImage] = useState<string>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const { message } = App.useApp();
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

  return (
    <div className={`image-box ${className}`}>
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
  );
};

export default ImageBox;