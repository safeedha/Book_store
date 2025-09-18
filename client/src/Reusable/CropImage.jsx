import React, { useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDispatch } from "react-redux";
import {
  imageUrlupdate,
  imageUrl2update,
  imageUrl3update,
  imageUrl4update,
} from "../feature/imageSlice";

export default function ImageCropper({
  url1 = null,
  url2 = null,
  url3 = null,
  url4 = null,
}) {
  const [crop, setCrop] = useState({
    unit: "px",
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    aspect: 1,
  });

  const imgRef = useRef(null);
  const dispatch = useDispatch();

  const generateCroppedImage = useCallback((crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedUrl = URL.createObjectURL(blob);
            console.log("Cropped Image URL:", croppedUrl);

            if (url1) {
              dispatch(imageUrlupdate(croppedUrl));
            }
            if (url2) {
              dispatch(imageUrl2update(croppedUrl));
            }
            if (url3) {
              dispatch(imageUrl3update(croppedUrl));
            }
            if (url4) {
              dispatch(imageUrl4update(croppedUrl));
            }
          }
        },
        "image/jpeg",
        1
      );
    }
  }, [dispatch, url1, url2, url3, url4]);

  return (
    <div>
      <ReactCrop crop={crop} onChange={(newCrop) => setCrop(newCrop)}>
        <img
          ref={imgRef}
          src={url1 || url2 || url3 || url4}
          alt="Crop me"
          crossOrigin="anonymous"
          style={{ maxWidth: "100%", maxHeight: "400px" }}
        />
      </ReactCrop>
      <br/>

      <button
        type="button"
        onClick={() => generateCroppedImage(crop)}
        className="border border-indigo-600 bg-indigo-500 text-white rounded-full px-6 py-2 font-medium shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-200"
      >
        Get Cropped Image
      </button>
    </div>
  );
}
