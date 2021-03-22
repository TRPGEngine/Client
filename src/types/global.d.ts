type PickFunctionComponentProps<P extends React.FC<any>> = P extends React.FC<
  infer P
>
  ? P
  : never;
