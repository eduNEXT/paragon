/* eslint-disable max-len */
import React, {
  useRef, createContext, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import { Search, Close } from '../../icons';

import newId from '../utils/newId';
import Button from '../Button';

export const SearchFieldContext = createContext();

const SearchFieldAdvanced = (props) => {
  const {
    children,
    className,
    screenReaderText,
    icons,
    onSubmit,
    onClear,
    onChange,
    onBlur,
    onFocus,
    value: initialValue,
    formAriaLabel,
    submitButtonLocation,
  } = props;

  const [hasFocus, setHasFocus] = useState(false);
  const [value, setValue] = useState(initialValue);

  const isInitialMount = useRef(true);
  const inputId = useRef(`${newId('pgn-searchfield-input-')}`);
  const inputRef = useRef();
  const submitButtonRef = useRef();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      onChange(value);
    }
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(value);
    if (submitButtonRef && submitButtonRef.current) {
      submitButtonRef.current.focus();
    }
  };

  const handleClear = () => {
    setValue('');
    onClear();
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = (event) => {
    setHasFocus(true);
    onFocus(event);
  };

  const handleBlur = (event) => {
    setHasFocus(false);
    onBlur(event);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="d-flex">
      <div
        className={classNames(
          'pgn__searchfield', 'd-flex', 'w-100',
          { 'has-focus': hasFocus },
          className,
        )}
      >
        <form
          role="search"
          onSubmit={handleSubmit}
          onReset={handleClear}
          className="d-flex align-items-center w-100"
          aria-label={formAriaLabel}
        >
          <SearchFieldContext.Provider
            value={{
              inputId,
              screenReaderText,
              icons,
              value,
              handleFocus,
              handleBlur,
              handleChange,
              refs: {
                input: inputRef,
                submitButton: submitButtonRef,
              },
            }}
          >
            {children}
          </SearchFieldContext.Provider>
        </form>
      </div>
      {submitButtonLocation === 'external' && <Button className="ml-2" onClick={handleSubmit} ref={submitButtonRef}>Search</Button>}
    </div>
  );
};

SearchFieldAdvanced.propTypes = {
  /** specifies the nested child elements. At a minimum, `SearchField.Label` and `SearchField.Input` are required. */
  children: PropTypes.node.isRequired,
  /** specifies a callback function for when the `SearchField` is submitted by the user. For example:
  ```jsx
  <SearchField onSubmit={(value) => { console.log(value); } />
  ``` */
  onSubmit: PropTypes.func.isRequired,
  /** specifies a custom class name. */
  className: PropTypes.string,
  /** specifies a callback function for when the user loses focus in the `SearchField` component. The default is an empty function. For example:
  ```jsx
  <SearchField onBlur={event => console.log(event)} />
  ``` */
  onBlur: PropTypes.func,
  /** specifies a callback function for when the value in `SearchField` is changed by the user. The default is an empty function. For example:
  ```jsx
  <SearchField onChange={value => console.log(value)} />
  ``` */
  onChange: PropTypes.func,
  /** specifies a callback function for when the value in `SearchField` is cleared by the user. The default is an empty function. For example:
  ```jsx
  <SearchField onClear={() => console.log('search cleared')} />
  ``` */
  onClear: PropTypes.func,
  /** specifies a callback function for when the user focuses in the `SearchField` component. The default is an empty function. For example:
  ```jsx
  <SearchField onFocus={event => console.log(event)} />
  ``` */
  onFocus: PropTypes.func,
  /** specifies the screenreader text for both the clear and submit buttons (e.g., for i18n translations). The default is `{ label: 'search', clearButton: 'clear search', searchButton: 'submit search' }`. */
  screenReaderText: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    submitButton: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    clearButton: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  }),
  /** specifies the initial value for the input. The default is an empty string. */
  value: PropTypes.string,
  /** specifies the icon element(s) to use for the clear and submit buttons. The default is `{ submit: <Icon src={Search} />, clear: <Icon src={Close} /> }`. */
  icons: PropTypes.shape({
    submit: PropTypes.element.isRequired,
    clear: PropTypes.element,
  }),
  /** specifies the aria-label attribute on the form element. This is useful if you use the `SearchField` component more than once on a page. */
  formAriaLabel: PropTypes.string,
  /** specifies whether the search button is internal as an icon or external as a button. */
  submitButtonLocation: PropTypes.string,
};

SearchFieldAdvanced.defaultProps = {
  className: undefined,
  formAriaLabel: undefined,
  submitButtonLocation: 'internal',
  value: '',
  screenReaderText: {
    label: 'search',
    submitButton: 'submit search',
    clearButton: 'clear search',
  },
  icons: {
    clear: <Icon src={Close} />,
    submit: <Icon src={Search} />,
  },
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  onClear: () => {},
};

export default SearchFieldAdvanced;
