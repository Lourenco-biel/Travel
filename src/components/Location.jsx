import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const Location = ({ onValueChange, reset, onReset }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (reset) {
          setSelectedOption(null);
          setOptions([]);
          onReset();
        }
      }, [reset]);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onValueChange(selectedOption.value);
    };

    const handleInputChange = (inputValue) => {
        axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&types=(cities)&key=AIzaSyDrXNYYxk7i1y0ALoh2AlGd-QPT03bwdUA`)
            .then((response) => {
                const { predictions } = response.data;
                const options = predictions.map((prediction) => ({
                    value: prediction.description,
                    label: prediction.description,
                }));
                setOptions(options);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    

    return (
        <div style={{ marginTop: '4px' }}>
            <Select
                styles={{ width: '100%' }}
                placeholder='Digite o endereço'
                options={options}
                value={selectedOption}
                onChange={handleChange}
                onInputChange={handleInputChange}
            />
        </div>
    );
};

export default Location;


