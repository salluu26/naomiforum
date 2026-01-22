import Cropper from "react-easy-crop";
import { useState } from "react";

export default function AvatarCropModal({ file, onClose, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = (_, area) => setCroppedArea(area);

  const createImage = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
    });

  const getCroppedImg = async () => {
    const image = await createImage(URL.createObjectURL(file));
    const canvas = document.createElement("canvas");
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      croppedArea.x,
      croppedArea.y,
      croppedArea.width,
      croppedArea.height,
      0,
      0,
      size,
      size
    );

    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg")
    );
  };

  const save = async () => {
    const blob = await getCroppedImg();
    onSave(blob);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-[#121214] rounded-2xl w-[360px] p-4 space-y-4">
        <div className="relative h-64 rounded-xl overflow-hidden">
          <Cropper
            image={URL.createObjectURL(file)}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-white/20"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="flex-1 py-2 rounded-xl bg-white text-black font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
