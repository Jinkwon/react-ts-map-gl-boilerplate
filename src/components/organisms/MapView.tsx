import React, {
  FC,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Layer } from 'react-map-gl';
import ReactMapGL, {
  ViewportProps,
} from 'react-map-gl';
import ResizeObserver, { DOMRect } from 'react-resize-observer';
import { InteractiveMapProps } from 'react-map-gl/dist/es6/components/interactive-map';
import { useDebounce, useDebounceCallback } from '@react-hook/debounce';
import axios from 'axios';
import styled from 'styled-components';

interface PropTypes {
  viewport?: any;
  onViewportChange?: (viewport: any) => void;
  onLoad?: (event: any) => void;
  onResize?: (event: any) => void;
  children?: ReactNode;
  onClick?: (data: any) => void;
  onError?: (error: any) => void;
  onHover?: (data: any) => void;
  mapStyle?: string | object;
  popupNode?: ReactNode;
  deckLayers?: any[];
  hideSymbol?: boolean;
}
const MapView = forwardRef((props: PropTypes, ref) => {
  const [rect, setRect] = useDebounce<DOMRect>(null, 500);
  const [map, setMap] = useState<mapboxgl.Map>(null);
  const [viewport, setViewport] = useState<InteractiveMapProps>(props.viewport);
  const [styleObject, setStyleObject] = useState<object>(null);

  const containerRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    setViewport: (viewport: any) => {
      setViewport(viewport);
    },
  }));

  const load = async () => {

    const styleUrl = 'https://api.maptiler.com/maps/basic/style.json?key=HPv7qYIcyDeysnfb8IFM';

    const result = await axios({
      url: styleUrl,
      method: 'get',
    });
    const style = result.data;
    if (props.hideSymbol) {
      style.layers = style.layers.filter((l: any) => {
        return l.type !== 'symbol';
      });
    }
    setStyleObject(style);
  };

  useEffect(() => {
    void load();
    const onWindowResize = () => {
      if (!containerRef.current) {
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      setRect(rect);
    };
    onWindowResize();
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!map || !rect || !rect.width || !rect.height) {
      return;
    }

    if (!styleObject) {
      return;
    }
    setViewport((prev) => ({
      ...prev,
      width: rect.width,
      height: rect.height,
    }));
    onResize({
      width: rect.width,
      height: rect.height,
    });
  }, [rect, map, styleObject]);

  const notifyChangeViewport = useDebounceCallback((viewState) => {
    props?.onViewportChange?.(viewState);
  }, 100);

  function onViewportChange(viewState: ViewportProps): void {
    setViewport(viewState);
    notifyChangeViewport(viewState);
  }

  function onLoad(event: MapLoadEvent): void {
    
    const map = event.target;
    setMap(map);

    props.onLoad && props.onLoad(event);

    const style = map.getStyle();

    setInteractiveLayerIds(
      style.layers.filter((l) => l.type === 'symbol').map((l) => l.id)
    );
  }

  function onResize(dimensions: { width: number; height: number }): void {
    props.onResize && props.onResize(dimensions);
  }

  const [interactiveLayerIds, setInteractiveLayerIds] = useState([]);

  return (
    <Container ref={containerRef}>
      <ReactMapGL
        key={'static-map'}
        {...viewport}
        onViewportChange={(viewport: any) => setViewport(viewport)}
        mapOptions={{
          attributionControl: false,
          localIdeographFontFamily: false,
        }}
        mapStyle={styleObject}
        onLoad={onLoad}
        onError={props?.onError}
        onResize={onResize}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((r) => {
            return (
              <Layer
                key={`index_${r}`}
                id={`index_${r}`}
                type="background"
                paint={{
                  'background-opacity': 0,
                }}
              />
            );
          })}
        {props.children}
      </ReactMapGL>

      <ResizeObserver
        onResize={(rect) => {
          setRect(rect);
        }}
      />
    </Container>
  );
});

export default MapView;

interface ExtraState {
  inTransition?: boolean;
  isDragging?: boolean;
  isHovering?: boolean;
  isPanning?: boolean;
  isRotating?: boolean;
  isZooming?: boolean;
}

export interface MapLoadEvent {
  type: string;
  target: mapboxgl.Map;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

