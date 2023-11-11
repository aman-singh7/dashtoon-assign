import { Col, Row } from "antd";
import "features/CreateComic/index.css";
import ImageBox from "features/CreateComic/components/ImageBox";

export interface CreateCompicProps {
  className: string;
}

const CreateComic: React.FC<CreateCompicProps> = (props: CreateCompicProps) => {
  const { className } = props;
  const colCounts = [3, 4, 3];
  return (
    <div className={`home-content-container ${className}`}>
      <div className="home-drawer"></div>
      <div className="home-content">
        {colCounts.map((count: number, rowIndex: number) => (
          <Row gutter={[16, 32]} className="home-content-row">
            {Array.from({ length: count }).map((_, colIndex: number) => (
              <Col span={24 / count}>
                <ImageBox className="home-image-box" />
              </Col>
            ))}
          </Row>
        ))}
      </div>
    </div>
  );
};

export default CreateComic;
