/* eslint-disable max-len */
import React, {
  useRef, createContext, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import { Search, Close } from '../../icons';

import newId from '../utils/newId';

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

  const renderChildrensSplitSubmitButton = (currentChildren) => {
    const submitButtonInternal = React.Children.toArray(currentChildren).find(child => child.type.name === 'SearchFieldSubmitButton' && child.props.submitButtonLocation === 'internal');

    const submitButtonExternal = React.Children.toArray(currentChildren).find(child => child.type.name === 'SearchFieldSubmitButton' && child.props.submitButtonLocation === 'external');

    const childrensFilter = React.Children.toArray(currentChildren).filter((child) => child.type.name !== 'SearchFieldSubmitButton');

    const childrens = childrensFilter.map((child) => React.cloneElement(child, { ...child.props }));

    return { childrens, submitButtonInternal, submitButtonExternal };
  };

  const {
    childrens,
    submitButtonInternal,
    submitButtonExternal,
  } = renderChildrensSplitSubmitButton(children);

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      onReset={handleClear}
      className="pgn__search"
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
        <div
          className={classNames(
            'pgn__searchfield',
            { 'has-focus': hasFocus },
            className,
          )}
        >
          {childrens}
          {submitButtonInternal}
        </div>
        {submitButtonExternal}
      </SearchFieldContext.Provider>
    </form>
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
};

SearchFieldAdvanced.defaultProps = {
  className: undefined,
  formAriaLabel: undefined,
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
