import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from "./Button";
import EmptyPhoto from '../assets/images/no-photo.svg';
import $ from 'jquery';
class Drawer {
    constructor(element, setUserImage, userImage = null) {
        this.canvas = element;
        this.context = this.canvas.getContext('2d');
        this.bgColor = 'transparent';
        this.image = null;
        this.imageLoaded = false;
        this.setUserImage = setUserImage;
        this.userImage = userImage;
        this.render();
    }
    renderBackground() {
        this.image = new Image();
        this.image.onload = () => {
            this.renderImage();
        }
        this.image.src = this.userImage ? this.userImage : EmptyPhoto;
    }
    renderImage() {
        const imageRatio = this.image.width / this.image.height;
        this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.width / imageRatio);
    }

    setImage(src) {
        this.context.fillStyle = "#f7f7f7";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.imageLoaded = false;
        this.image = new Image();
        this.image.onload = () => {
            this.imageLoaded = true;
            this.render();
        }
        this.image.src = src;
    }

    readImage(file) {
        if (file.type.match(/image.*/)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.setImage(e.target.result);
                this.setUserImage(e.target.result);
            }
            reader.readAsDataURL(file);
        } else {
            alert('Não foi possível ler a imagem! Tente novamente.');
        }
    }
    render() {
        if (this.imageLoaded) {
            this.renderImage();
        } else {
            this.renderBackground();
        }
    }

}

class ImageUploader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            src: null,
            crop: {
                unit: 'px',
                width: 300,
                aspect: 1 / 1
            }
        };
    };
    componentDidMount() {
        const fileInput = document.querySelector('input[type="file"]');
        const canvas = document.querySelector('canvas');

        const drawer = new Drawer(canvas, this.props.setUserImage, this.props.image);

        fileInput.addEventListener('change', function (e) {
            const { files } = e.target;
            if (files && files.length) drawer.readImage(files[0]);
        });
    }
    onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // If you setState the crop in here you should return false.
    onImageLoaded = (image) => {
        this.setState({ crop: { unit: 'px', width: image.width, height: image.height, aspect: 1 / 1 } });
        $('#image-crop-modal').toggle();
        this.imageRef = image;
    };

    onCropComplete = (crop) => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({ croppedImageUrl });
        };
    };

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
        var dataURL = canvas.toDataURL();
        this.props.setUserImage(dataURL);
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            },
                'image/jpeg',
                1
            );
        });
    };
    render() {
        const { crop, croppedImageUrl, src } = this.state;
        return (
            <div className="image-uploader">
                <div
                    className='modal'
                    id={`image-crop-modal`}
                    style={{ display: 'none' }}
                >
                    <div className='modal-adjust'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <p>
                                    Recortar imagem
                                </p>
                            </div>
                            <div className='modal-body modal-overflow'>
                                {src && (
                                    <div className='react-crop'>
                                        <ReactCrop
                                            src={src}
                                            crop={crop}
                                            ruleOfThirds
                                            onImageLoaded={this.onImageLoaded}
                                            onComplete={this.onCropComplete}
                                            onChange={this.onCropChange}
                                            maxWidth={300}
                                            maxHeight={300}
                                            imageStyle={{
                                                width: '300px'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='modal-footer'>
                                <Button
                                    text='Cortar'
                                    width='180px'
                                    onClick={() => {
                                        $(`#image-crop-modal`).toggle();
                                        return this.onCropChange;
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {croppedImageUrl ?
                    <img alt="Crop" className='crop-image' src={croppedImageUrl} />
                    :
                    <canvas width="180px" height="160px" id="canvas" />
                }
                <div className="edit-photo-container">
                    <input type="file" id="img" name="img" accept="image/jpg, image/jpeg, image/png" onChange={this.onSelectFile} />
                    <Button image text="Faça upload de uma imagem" width="380px" className="select-image-container"></Button>
                </div>
            </div>
        )
    }
};

export default ImageUploader;