import styled from 'styled-components/native';

const TInput = styled.TextInput.attrs((props) => ({
  underlineColorAndroid: 'transparent',
  autoCorrect: false,
  autoCapitalize: 'none',
  textAlignVertical: 'top',
  ...props,
}))`
  min-height: 32px;
  min-width: 200px;
  border-radius: 3px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 4px 6px;
`;

export default TInput;
