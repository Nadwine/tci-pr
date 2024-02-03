import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import ListingMedia from "../../database/models/listing_media";

type Props = {
  images: ListingMedia[];
};

const Carousel = (props: Props) => {
  const images = props.images;
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImageFound, setActiveImageFound] = useState(true);

  // [0,1,2]
  const nextImage = () => {
    if (images.length - 1 === activeIndex) return;
    setActiveIndex(activeIndex + 1);
  };

  const prevImage = () => {
    if (activeIndex === 0) return;
    setActiveIndex(activeIndex - 1);
  };

  function imageFound() {
    setActiveImageFound(true);
  }

  function imageNotFound() {
    setActiveImageFound(false);
  }

  function testImage(URL) {
    var tester = new Image();
    tester.onload = imageFound;
    tester.onerror = imageNotFound;
    tester.src = URL;
  }

  testImage(images[activeIndex].mediaUrl);

  return (
    <div id="carouselExample" className="carousel slide" style={{ minHeight: 200 }}>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={images[activeIndex].mediaUrl} className="d-block w-100" alt="..." />
          {!activeImageFound && <div className="text-center text-muted">Image failed to load</div>}
        </div>
      </div>
      <button onClick={() => prevImage()} className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" style={{ backgroundColor: "#8080808f" }}></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button onClick={() => nextImage()} className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" style={{ backgroundColor: "#8080808f" }}></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default connect()(Carousel);
