import { useState } from "react";
import Cropper from "react-easy-crop";
//import { cropImage } from "./imageUtils/cropUtils";
import { cropImage } from "../imageUtils/cropUtils";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const ImageCropper = ({
  open,
  image,
  onComplete,
  containerStyle,
  texto,
  ...props
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle>Recortar imagen</DialogTitle>

        <DialogContent>
          <div style={containerStyle}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={(_, croppedAreaPixels) => {
                setCroppedAreaPixels(croppedAreaPixels);
              }}
              onZoomChange={setZoom}
              {...props}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            onClick={() =>
              onComplete(cropImage(image, croppedAreaPixels, console.log))
            }
          >
            {texto}
          </Button>
        </DialogActions>
      </Dialog>
    );
};

 export default ImageCropper;