import React, {
  FC,
  ReactNode
} from 'react';

interface PropTypes {
  children?: ReactNode;

}

const Main: FC<PropTypes> = (props: PropTypes) => {
  return (<>
    Good job
  </>);
};

export default Main;
