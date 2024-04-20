import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import ListingMedia from "../../database/models/listing_media";
import Listing from "../../database/models/listing";
import GonePropertyOverlay from "./GonePropertyOverlay";

type Props = {
  images: ListingMedia[];
  listing: Listing;
};

const Carousel = (props: Props) => {
  const images = props.images;
  const listing = props.listing;
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImageFound, setActiveImageFound] = useState(true);

  // [0,1,2]
  const nextImage = () => {
    if (images.length - 1 === activeIndex) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex(activeIndex + 1);
  };

  const prevImage = () => {
    if (activeIndex === 0) {
      setActiveIndex(images.length - 1);
      return;
    }
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

  const currentImage = images[activeIndex];

  return (
    <div id="carouselExample" className="carousel slide m-auto" style={{ minHeight: 200, maxWidth: 700 }}>
      <div className="carousel-inner">
        <div className="carousel-item active">
          {listing.listingStatus === "gone" && <GonePropertyOverlay />}
          {currentImage.mediaType === "image" && <img src={images[activeIndex].mediaUrl} className="d-block w-100" alt="..." />}
          {currentImage.mediaType === "video" && <video controls src={images[activeIndex].mediaUrl} className="d-block w-100" />}
          {!activeImageFound && (
            <div className="text-center text-muted" style={{ fontSize: "12px" }}>
              Experiencing issues loading this media..
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => prevImage()}
        className="carousel-control-prev my-auto"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
        style={{ height: "50px" }}
      >
        <i className="bi bi-chevron-left fs-5 p-2 bg-white rounded" style={{ color: "black", WebkitTextStroke: "3px" }} />
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        onClick={() => nextImage()}
        className="carousel-control-next my-auto"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
        style={{ height: "50px" }}
      >
        <i className="bi bi-chevron-right fs-5 p-2 bg-white rounded" style={{ color: "black", WebkitTextStroke: "3px" }} />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default connect()(Carousel);
