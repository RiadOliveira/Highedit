import React, {
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Container, InputContainer } from './styles';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({
  type,
  onChange,
  defaultValue,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const parsedEvent = { ...event };
      const { value } = parsedEvent.target;

      if (type === 'color' && !value.includes('#')) {
        parsedEvent.target.value = `#${value}`;
      }

      if (onChange) onChange(parsedEvent);
      setInputValue(parsedEvent.target.value);
    },
    [onChange, type],
  );

  return (
    <Container>
      <InputContainer
        {...props}
        type={type}
        ref={inputRef}
        value={inputValue}
        onChange={event => handleInputChange(event)}
      />
      {type === 'color' && (
        <InputContainer
          type="text"
          isSecondary
          value={inputValue}
          onChange={event => handleInputChange(event)}
        />
      )}
    </Container>
  );
};

export default Input;
