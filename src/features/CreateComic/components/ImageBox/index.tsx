import "./index.css";
import TextArea from "antd/es/input/TextArea";
import { SearchOutlined } from "@ant-design/icons";

export interface ImageBoxProps {
  className: string;
}

const ImageBox: React.FC<ImageBoxProps> = (props: ImageBoxProps) => {
  const { className } = props;
  return (
    <div className={`image-box ${className}`}>
      <div className="image-box-text-group">
        <TextArea
          className="image-box-text"
          placeholder="Search for the image"
          autoSize={{ maxRows: 6, minRows: 2 }}
        />
        <SearchOutlined className="image-box-search" />
      </div>
    </div>
  );
};

export default ImageBox;
