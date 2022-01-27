import React, { useEffect, useRef, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import { useModal } from 'hooks/modal';
import { Container, SelectContainer, Option, ArrowIcon } from './styles';
import ScrollBar from './ScrollBar';

interface SelectProps {
  setFunction: (optionId: string) => void;
}

interface ISearchedTextProps {
  text: string;
  time: Date;
}

const Select: React.FC<SelectProps> = ({ setFunction }) => {
  const {
    modalProps: { options },
  } = useModal();
  const selectRef = useRef<HTMLDivElement>(null);

  const [searchedTextProps, setSearchedTextProps] =
    useState<ISearchedTextProps>({} as ISearchedTextProps);

  const [selectedOption, setSelectedOption] = useState(0);
  const [isShowingOptions, setIsShowingOptions] = useState(false);

  const [scrollTopDistance, setScrollTopDistance] = useState(0);

  const handleSelectOption = (index: number) => {
    setIsShowingOptions(false);
    setSelectedOption(index);
  };

  useEffect(() => {
    if (selectRef.current) {
      if (isShowingOptions) {
        selectRef.current.scrollTo({ top: selectedOption * 60 });

        selectRef.current.addEventListener('keydown', event => {
          if (event.code === 'Space') event.preventDefault();
        });
      } else selectRef.current?.removeEventListener('keydown', () => null);
    }
  }, [selectedOption, isShowingOptions]);

  useEffect(() => {
    if (options.length > 0) {
      setFunction(options[selectedOption].value);
    }
  }, [options, selectedOption, setFunction]);

  // Search system through select.
  const handleKeyPress = (key: string) =>
    setSelectedOption(() => {
      let searchText: string;

      if (key === 'Enter') {
        setIsShowingOptions(false);
        searchText = searchedTextProps.text;
      } else {
        searchText = key.toLowerCase();

        // If the difference in time of the last input and the current is lower
        // than 1, add the key to the search text.
        if (
          searchedTextProps.time &&
          differenceInSeconds(new Date(Date.now()), searchedTextProps.time) < 1
        )
          searchText = (searchedTextProps.text + key).toLowerCase();
      }

      const findedIndex = options.findIndex(({ label }) =>
        label.toLowerCase().startsWith(searchText),
      );

      // If not find any option with the searched text, resets it.
      if (findedIndex === -1) {
        setSearchedTextProps({ text: '', time: new Date(Date.now()) });
        return 0;
      }

      setSearchedTextProps({ text: searchText, time: new Date(Date.now()) });

      return findedIndex;
    });

  return (
    <Container>
      <SelectContainer
        tabIndex={0}
        onKeyUp={({ key }) => handleKeyPress(key)}
        onScroll={({ currentTarget: { scrollTop } }) =>
          setScrollTopDistance(scrollTop)
        }
        onMouseLeave={() => setIsShowingOptions(false)}
        isShowingOptions={isShowingOptions}
        hasScrollBar={options.length > 4}
        ref={selectRef}
        style={{ overflowY: isShowingOptions ? 'scroll' : 'hidden' }}
      >
        {!isShowingOptions ? (
          <Option
            onClick={() => {
              setIsShowingOptions(true);
              selectRef.current?.focus();
            }}
          >
            <ArrowIcon size={40} />
            {options.length > 0 && options[selectedOption].label}
          </Option>
        ) : (
          <>
            {options.length > 4 && (
              <ScrollBar
                dataLength={options.length}
                scrollTop={scrollTopDistance}
              />
            )}

            {options.map(({ label }, index) => (
              <Option onClick={() => handleSelectOption(index)} key={label}>
                <p>{label}</p>
              </Option>
            ))}
          </>
        )}
      </SelectContainer>
    </Container>
  );
};

export default Select;
