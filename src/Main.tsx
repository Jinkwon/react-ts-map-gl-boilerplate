import React, {
  FC,
  ReactNode,
  useState
} from 'react';
import { Layer, Source } from 'react-map-gl';
import MapView from './components/organisms/MapView';

const initViewport = {
  longitude: 127.03553922219496,
  latitude: 37.484501601554435,
  pitch: 0,
  // pitch: 0,
  // bearing: 0,
  zoom: 14,
};

interface PropTypes {
  children?: ReactNode;

}

const Main: FC<PropTypes> = (props: PropTypes) => {
  const [viewport, setViewport] = useState<any>(initViewport);

  return (<>
    <MapView
      viewport={viewport}
      onViewportChange={(viewport) => setViewport(viewport)}
    >
    
    </MapView>
  </>);
};

export default Main;
