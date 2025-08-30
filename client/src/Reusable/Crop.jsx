import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { useDispatch } from 'react-redux';
import {
  imageUrlupdate,
  imageUrl2update,
  imageUrl3update,
  imageUrl4update,
} from '../feature/imageSlice';

const Crop = ({ url = null, url2 = null, url3 = null, url4 = null }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const dispatch = useDispatch();

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const generateCroppedImage = useCallback(async () => {
    const image = await createImage(url || url2 || url3 || url4);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const croppedImage = canvas.toDataURL('image/jpeg');
    if (url) {
      dispatch(imageUrlupdate(croppedImage));
    }
    if (url2) {
      dispatch(imageUrl2update(croppedImage));
    }
    if (url3) {
      dispatch(imageUrl3update(croppedImage));
    }
    if (url4) {
      dispatch(imageUrl4update(croppedImage));
    }
  }, [croppedAreaPixels, url, url2, url3, url4]);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  return (
    <div>
      <div style={{ width: '400px', height: '600px', position: 'relative' }}>
        <Cropper
          image={url || url2 || url3 || url4}
          crop={crop}
          zoom={zoom}
          aspect={2 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <button
        type="button"
        onClick={generateCroppedImage}
        className="border border-indigo-600 bg-indigo-500 text-white rounded-full px-6 py-2 font-medium shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-200"
      >
        Get Cropped Image
      </button>
    </div>
  );
};

export default Crop;
