import { useCallback, useEffect, useState } from "react";
import { Autocomplete, Icon } from "@shopify/polaris";
import { countries } from "@/utils/countries";
import { SearchIcon } from "@shopify/polaris-icons";

export default function CountryAutocomplete({
    label = "Ülke",
    placeholder = "Ülke seçin veya arayın",
    value = "",
    countryCode = "",
    error = "",
    onChange = () => {},
}) {
    const [inputValue, setInputValue] = useState(value);
    const [options, setOptions] = useState(
        countries.map((country) => ({
            label: country.label,
            value: country.value,
        }))
    );
    const [selectedOption, setSelectedOption] = useState([]);

    useEffect(() => {
        if (countryCode) {
            const country = countries.find((c) => c.value === countryCode);
            if (country) {
                setSelectedOption([country.value]);
                setInputValue(country.label);
            }
        } else {
            setSelectedOption([]);
            setInputValue("");
        }
    }, [countryCode]);

    const updateText = useCallback((value) => {
        setInputValue(value);

        if (value === "") {
            setOptions(
                countries.map((country) => ({
                    label: country.label,
                    value: country.value,
                }))
            );
            return;
        }

        const filterRegex = new RegExp(value, "i");
        const resultOptions = countries
            .filter((country) => country.label.match(filterRegex))
            .map((country) => ({
                label: country.label,
                value: country.value,
            }));

        setOptions(resultOptions);
    }, []);

    const handleSelect = useCallback((selected) => {
        const selectedValue = selected[0];
        setSelectedOption(selected);

        const country = countries.find((c) => c.value === selectedValue);
        if (country) {
            setInputValue(country.label);
            onChange(country.value, country.label);
        }
    }, []);

    const handleClear = useCallback(() => {
        setSelectedOption([]);
        setInputValue("");
        onChange("", "");
    }, []);

    return (
        <Autocomplete
            label={label}
            options={options}
            selected={selectedOption}
            onSelect={handleSelect}
            textField={
                <Autocomplete.TextField
                    onChange={updateText}
                    label={label}
                    value={inputValue}
                    prefix={<Icon source={SearchIcon} tone="base" />}
                    placeholder={placeholder}
                    clearButton
                    onClearButtonClick={handleClear}
                    error={error}
                />
            }
        />
    );
}
