/* eslint-disable @typescript-eslint/no-explicit-any */
import { colorPickerPalette } from '@/data/colors';
import resetFullMap from '@/lib/resetFullMap';
import uploadConfig from '@/lib/uploadConfig';
import { labelAtom } from '@/store/label.store';
import { disableTooltip, mapAtom } from '@/store/map.store';
import { LabelStoreType } from '@/typings/label.store';
import { LegendData, MapData, MapStoreType } from '@/typings/map.store';
import { Spacer, Tabs, Toggle } from '@geist-ui/react';
import { Edit, Type, Upload } from '@geist-ui/react-icons';
import { useAtom } from 'jotai';
import React from 'react';
import EditControls from './Controls/EditControls';
import ExportControls from './Controls/ExportControls';
import LabelControls from './Controls/LabelControls';
import LegendAllControls from './Controls/LegendAllControls';
import InputLabel from './InputLabel';

interface Props {
    mapId: string;
    stateCodes: { [key: string]: string };
}

const HorControlContainer: React.FC<Props> = ({ mapId, stateCodes }) => {
    const [map, setMap] = useAtom<MapStoreType>(mapAtom);
    const [label, setLabel] = useAtom<LabelStoreType>(labelAtom);
    const [, setTooltip] = useAtom(disableTooltip);
    const handleAttrChange = (v: string, a: string) => {
        // @ts-ignore
        setMap((st: MapStoreType) => ({
            ...st,
            [a]: v
        }));
    };
    const randomiseData = () => {
        const colorIdx = Math.floor(Math.random() * colorPickerPalette.length);
        const legendData: LegendData[] = [];
        colorPickerPalette[colorIdx].forEach((t, i) =>
            legendData.push({ fill: t, text: `${i * 10}`, hide: false })
        );
        const mapData: MapData[] = [];
        Object.keys(stateCodes).forEach((m) => {
            const rand = Math.floor(Math.random() * 10);
            mapData.push({
                fill: colorPickerPalette[colorIdx][rand],
                code: m,
                hide: false
            });
        });
        // @ts-ignore
        setMap((st: MapStoreType) => ({
            ...st,
            mapData,
            legendData
        }));
    };
    const toggleHideLegend = (b: any) => {
        // @ts-ignore
        setMap((st: MapStoreType) => ({
            ...st,
            hideLegend: b
        }));
    };
    const smoothGradient = (v: any) => {
        // @ts-ignore
        setMap((st: MapStoreType) => ({
            ...st,
            legendSmoothGradient: v
        }));
    };
    const refreshMap = () => {
        // @ts-ignore
        setMap((st: MapStoreType) => ({
            ...st,
            mapStrokeWidth: '1',
            mapStrokeColor: 'white',
            defaultFillColor: 'black',
            legendData: [],
            mapData: [],
            legendTextColor: 'white',
            hideLegend: false,
            legendSmoothGradient: false
        }));
        // @ts-ignore
        setLabel({
            data: [],
            scalingFactor: 1
        });
        const el = document.getElementById('labels-container');
        if (el) {
            el.innerHTML = '';
        }
        resetFullMap(stateCodes);
    };
    const uploadDataConfig = (e: any) => {
        // @ts-ignore
        uploadConfig(
            // @ts-ignore
            e.target.files[0],
            setMap,
            setLabel,
            // @ts-ignore
            map.defaultFillColors
        );
    };
    return (
        <div>
            <div className="control-container">
                <div className="control-box">
                    <EditControls
                        map={map}
                        handleAttrChange={handleAttrChange}
                        randomiseData={randomiseData}
                        refreshMap={refreshMap}
                    />
                </div>
                <div className="control-box">
                    <InputLabel text="Disable Tooltip" />
                    <Toggle onChange={(e: any) => setTooltip(e.target.checked)} size="large" />
                    <Spacer y={0.7} />
                    <Tabs hideDivider initialValue="1">
                        <Tabs.Item label="Legend" value="1">
                            <LegendAllControls
                                map={map}
                                handleAttrChange={handleAttrChange}
                                toggleHideLegend={toggleHideLegend}
                                smoothGradient={smoothGradient}
                            />
                        </Tabs.Item>
                        <Tabs.Item label="Labels" value="2">
                            <LabelControls />
                        </Tabs.Item>
                    </Tabs>
                </div>
                <div className="control-box">
                    <ExportControls
                        map={map}
                        label={label}
                        mapId={mapId}
                        uploadDataConfig={uploadDataConfig}
                    />
                </div>
            </div>
            <div className="control-container-tabs">
                <Tabs initialValue="1">
                    <Tabs.Item
                        label={
                            <>
                                <Edit /> Edit{' '}
                            </>
                        }
                        value="1">
                        <div className="control-box">
                            <EditControls
                                map={map}
                                handleAttrChange={handleAttrChange}
                                randomiseData={randomiseData}
                                refreshMap={refreshMap}
                            />
                        </div>
                    </Tabs.Item>
                    <Tabs.Item
                        label={
                            <>
                                <Type /> Legend
                            </>
                        }
                        value="2">
                        <div className="control-box">
                            <Spacer y={0.7} />
                            <InputLabel text="Disable Tooltip" />
                            <Toggle
                                onChange={(e: any) => setTooltip(e.target.checked)}
                                size="large"
                            />
                            <Spacer y={0.7} />
                            <Tabs hideDivider initialValue="1">
                                <Tabs.Item label="Legend" value="1">
                                    <LegendAllControls
                                        map={map}
                                        handleAttrChange={handleAttrChange}
                                        toggleHideLegend={toggleHideLegend}
                                        smoothGradient={smoothGradient}
                                    />
                                </Tabs.Item>
                                <Tabs.Item label="Labels" value="2">
                                    <LabelControls />
                                </Tabs.Item>
                            </Tabs>
                        </div>
                    </Tabs.Item>
                    <Tabs.Item
                        label={
                            <>
                                <Upload /> Export{' '}
                            </>
                        }
                        value="3">
                        <div className="control-box">
                            <ExportControls
                                label={label}
                                map={map}
                                mapId={mapId}
                                uploadDataConfig={uploadDataConfig}
                            />
                        </div>
                    </Tabs.Item>
                </Tabs>
            </div>
            <style jsx>{`
                .control-container {
                    padding-top: 30px;
                    display: flex;
                    justify-content: space-between;
                }
                .control-container-tabs {
                    display: none;
                    margin-right: auto;
                    margin-left: auto;
                }
                .control-box {
                    min-width: 360px;
                    padding: 20px 5px 100px 5px;
                }
                @media screen and (max-width: 800px) {
                    .control-container {
                        display: none;
                    }
                    .control-container-tabs {
                        padding-top: 30px;
                        display: block;
                    }
                    .controls-box {
                        width: 90%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default HorControlContainer;
