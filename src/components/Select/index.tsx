import React, { useEffect, useRef, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import { useModal } from 'hooks/modal';
import fontsList from 'utils/fontsList';
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
    modalProps: { type, initialValue },
  } = useModal();
  const selectRef = useRef<HTMLDivElement>(null);

  const [searchedTextProps, setSearchedTextProps] =
    useState<ISearchedTextProps>({} as ISearchedTextProps);

  const [selectedOption, setSelectedOption] = useState(
    initialValue ? fontsList.findIndex(font => font === initialValue) : 0,
  );
  const [isShowingOptions, setIsShowingOptions] = useState(false);

  const [scrollTopDistance, setScrollTopDistance] = useState(0);

  const handleSelectOption = (index: number) => {
    setIsShowingOptions(false);
    setSelectedOption(index);
  };

  useEffect(() => {
    if (selectRef.current) {
      if (isShowingOptions) {
        selectRef.current.scrollTo({ top: Number(selectedOption) * 54 });

        selectRef.current.addEventListener('keydown', event => {
          if (event.code === 'Space') event.preventDefault();
        });
      } else selectRef.current?.removeEventListener('keydown', () => null);
    }
  }, [selectedOption, isShowingOptions]);

  useEffect(() => {
    if (type === 'select') setFunction(fontsList[selectedOption]);
  }, [selectedOption, setFunction, type]);

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
        ) {
          searchText = (searchedTextProps.text + key).toLowerCase();
        }
      }

      const findedIndex = fontsList.findIndex(font =>
        font.toLowerCase().startsWith(searchText),
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
        ref={selectRef}
        style={{ overflowY: isShowingOptions ? 'scroll' : 'hidden' }}
      >
        {!isShowingOptions ? (
          <Option
            style={{ fontSize: 24 }}
            onClick={() => {
              setIsShowingOptions(true);
              selectRef.current?.focus();
            }}
          >
            <p
              style={{
                marginRight: 16,
                fontSize:
                  fontsList[selectedOption].split(',')[0].length > 15 ? 16 : 22,
              }}
            >
              {fontsList[selectedOption].split(',')[0]}
            </p>
            <ArrowIcon size={34} />
          </Option>
        ) : (
          <>
            <ScrollBar
              dataLength={fontsList.length}
              scrollTop={scrollTopDistance}
            />

            {fontsList.map((font, index) => (
              <Option onClick={() => handleSelectOption(index)} key={font}>
                <p
                  style={{ fontSize: font.split(',')[0].length > 15 ? 14 : 18 }}
                >
                  {font.split(',')[0]}
                </p>
              </Option>
            ))}
          </>
        )}
      </SelectContainer>
    </Container>
  );
};

export default Select;
