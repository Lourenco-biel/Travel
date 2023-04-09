import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const GeocodingComponent = ({ onValueChange, reset, onReset }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [placePhotos, setPlacePhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [verifyPhotos, setVerifyPhotos] = useState(false);

    useEffect(() => {
        if (reset) {
            setSelectedOption(null);
            setOptions([]);
            setPlacePhotos([])
            setSelectedPhoto(null)
            setVerifyPhotos(false)
            onReset();
        }
    }, [reset]);

    const handleSelect = (option) => {
        setSelectedOption(option);
        axios
            .get(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${option.value}&fields=photo&key=AIzaSyDrXNYYxk7i1y0ALoh2AlGd-QPT03bwdUA`
            )
            .then((response) => {
                const photos = response.data.result.photos;
                if (photos && photos.length > 0) {
                    const photoUrls = photos.map((photo) => {
                        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyDrXNYYxk7i1y0ALoh2AlGd-QPT03bwdUA`;
                        return {
                            value: url,
                            label: (
                                <img
                                    src={url}
                                    alt="Place photo"
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ),
                        };
                    });
                    setPlacePhotos(photoUrls);
                    setVerifyPhotos(true)
                } else {
                    setPlacePhotos([]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handlePhotoSelect = (placePhoto) => {
        setSelectedPhoto(placePhoto);
        onValueChange(placePhoto.value);
    };

    return (
        <div style={{ marginTop: '4px' }}>
            {verifyPhotos && !selectedPhoto ?
                <div className='imagem-Google'
                >
                    {placePhotos?.map(placePhoto => {
                        return (
                            <div key={placePhoto.value}
                                onClick={() => handlePhotoSelect(placePhoto)}
                            >
                                <img
                                    style={{ width: '280px' }}
                                    src={placePhoto.value}
                                    alt={placePhoto.value}
                                />
                            </div>
                        )
                    })}
                </div>
                : selectedPhoto !== null ?
                    <div
                        className='imagem-Google'
                        style={{ width: 'auto', marginBottom:'14px' }}
                        onClick={() => setSelectedPhoto(null)}
                        onInputChange={handlePhotoSelect}
                    >
                        <img
                            style={{ maxWidth: '200px' }}
                            src={selectedPhoto.value}
                            alt={selectedPhoto.value} />
                    </div>
                    :
                    null
            }
            <Select
                options={options}
                value={selectedOption}
                onChange={handleSelect}
                placeholder='Nome do lugar'
                onInputChange={(inputValue) => {
                    axios
                        .get(
                            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&types=(cities)&key=AIzaSyDrXNYYxk7i1y0ALoh2AlGd-QPT03bwdUA`
                        )
                        .then((response) => {
                            const { predictions } = response.data;
                            const options = predictions.map((prediction) => ({
                                value: prediction.place_id,
                                label: prediction.description,
                            }));
                            setOptions(options);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }}
            />
        </div>
    );
};

export default GeocodingComponent;
