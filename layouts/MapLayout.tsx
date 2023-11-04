import React, { PropsWithChildren } from 'react';
import ReactTooltip from 'react-tooltip';
import { disableTooltipStore, mapStore } from '@/store/map.store';
import { useStore } from '@state-adapt/react';
import fillAllMap from '@/lib/fillAllMap';
import LegendContainer from '@/components/Legend/LegendContainer';
import useDrag from 'hooks/use-drag';
import { labelStore } from '@/store/label.store';

interface Props {
    viewBox: number[];
    name: string;
    stateCodes: { [key: string]: string };
    width: number;
    center?: boolean;
    strokeWidth?: number;
}

const MapLayout: React.FC<PropsWithChildren<Props>> = ({
    viewBox,
    name,
    stateCodes,
    width,
    center,
    children,
    ...props
}) => {
    const [hover, setHover] = React.useState('');
    const map = useStore(mapStore);
    const tooltip = useStore(disableTooltipStore);
    const svgRef = React.useRef<SVGSVGElement>(null);
    // ? This helps to have consistent font-size
    const scalingFactor = viewBox[2] / width;
    React.useEffect(() => {
        labelStore.setScalingFactor(scalingFactor);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scalingFactor]);
    useDrag(svgRef);
    React.useMemo(() => {
        fillAllMap(map.mapData, map.defaultFillColor, stateCodes);
    }, [map.mapData, map.defaultFillColor, stateCodes]);
    return (
        <div className={`flex flex-col map-container no-trans ${center ? 'mx-auto' : ''}`}>
            {hover !== '' && (
                <ReactTooltip id={name}>
                    <span style={{ fontWeight: 'bold' }}>{stateCodes[hover]}</span>
                </ReactTooltip>
            )}
            <svg
                ref={svgRef}
                id={`${name}-map`}
                data-tip
                data-for={name}
                fill="none"
                stroke={map.mapStrokeColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={map.mapStrokeWidth}
                version="1.2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewBox.join(' ')}
                width={width}
                {...props}>
                <g
                    style={{ pointerEvents: 'visible' }}
                    onClick={(e) => mapStore.fillColor(e.target as Element)}
                    onMouseOver={(e) => {
                        if (!tooltip.state) {
                            setHover((e.target as SVGGElement).id);
                        }
                    }}
                    onMouseLeave={() => {
                        if (!tooltip.state) {
                            setHover('');
                        }
                    }}>
                    {children}
                </g>
                <g id="labels-container" />
            </svg>
            {!map.hideLegend && (
                <LegendContainer
                    data={map.legendData}
                    legendTextColor={map.legendTextColor}
                    legendSmoothGradient={map.legendSmoothGradient}
                    hideSource={map.hideSource}
                    sourceText={map.sourceText}
                />
            )}
        </div>
    );
};

export default MapLayout;
