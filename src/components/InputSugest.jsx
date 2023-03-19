import React, { useState } from "react";
import Autosuggest from "react-autosuggest";

const GOOGLE_MAPS_API_KEY = "AIzaSyDStxGWyeXr_7BihlpAyHhcWtNYRIvx03U";

const getSuggestions = async (value) => {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.results) {
        return data.results.map((result) => result.formatted_address);
    }

    return [];
};

const AutocompleteInput = () => {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const onSuggestionsFetchRequested = async ({ value }) => {
        setSuggestions(await getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (event, { suggestionValue }) => {
        setValue(suggestionValue);
    };

    const inputProps = {
        placeholder: "Digite o endereço",
        value,
        onChange: (_, { newValue }) => setValue(newValue),
    };

    return (
        <Autosuggest
            clasName='input'
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={(suggestion) => <div>{suggestion}</div>}
            inputProps={inputProps}
        />
    );
};

export default AutocompleteInput;
