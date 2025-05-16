import { Button } from "@mui/material";
import ImageUploading from "react-images-uploading";

const ImageUploadingButton = ({ value, onChange, ...props }) => {
  return (
    <ImageUploading value={value} onChange={onChange} acceptType={["jpg", "png", "jpeg", "gif"]} maxFileSize={5242880}>
      {({ onImageUpload, onImageUpdate }) => (
        <Button
          color="primary"
          onClick={value ? onImageUpload : () => onImageUpdate(0)}
          {...props}
        >
          Seleccionar foto de perfil
        </Button>
      )}
    </ImageUploading>
  );
};

export default ImageUploadingButton;
