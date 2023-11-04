/* eslint-disable @typescript-eslint/no-explicit-any */
import getColorUsed from '@/lib/getColorUsed';
import uploadConfig from '@/lib/uploadConfig';
import { labelStore } from '@/store/label.store';
import { disableTooltipStore, mapStore, randomizeData$, refreshMap$ } from '@/store/map.store';
import { Spacer, Tabs, Toggle, useToasts } from '@geist-ui/react';
import { Edit, Type, Upload } from '@geist-ui/react-icons';
import { useStore } from '@state-adapt/react';
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
    const map = useStore(mapStore);
    const label = useStore(labelStore);
    const [, setToast] = useToasts();
    const setAttr = (v: any, attr: string) => mapStore.setAttr({ attr, v });
    const uploadDataConfig = (e: any) => {
        const successToast = () =>
            setToast({
                text: 'Succesfullly Loaded Map Configuration.',
                type: 'success',
                delay: 5000
            });
        const errorToast = () =>
            setToast({
                text: 'Error while Loaded Map Configuration.',
                type: 'error',
                delay: 5000
            });
        uploadConfig(
            e.target.files[0],
            mapStore.set,
            labelStore.set,
            map.defaultFillColor,
            mapId,
            successToast,
            errorToast
        );
    };
    const uniquePalette = getColorUsed(map.mapData);
    return (
        <div>
            <div className="control-container">
                <div className="control-box">
                    <EditControls
                        uploadDataConfig={uploadDataConfig}
                        map={map.state}
                        handleAttrChange={setAttr}
                        randomiseData={() => randomizeData$.next(stateCodes)}
                        refreshMap={() => refreshMap$.next(stateCodes)}
                    />
                </div>
                <div className="control-box">
                    <InputLabel text="Disable Tooltip" />
                    <Toggle
                        onChange={(e: any) => disableTooltipStore.set(e.target.checked)}
                        size="large"
                    />
                    <Spacer y={0.7} />
                    <Tabs hideDivider initialValue="1">
                        <Tabs.Item label="Legend" value="1">
                            <LegendAllControls
                                uniquePalette={uniquePalette}
                                map={map.state}
                                handleAttrChange={setAttr}
                                toggleHideLegend={mapStore.toggleHideLegend}
                                smoothGradient={mapStore.setLegendSmoothGradient}
                                toggleSource={mapStore.setHideSource}
                            />
                        </Tabs.Item>
                        <Tabs.Item label="Labels" value="2">
                            <LabelControls />
                        </Tabs.Item>
                    </Tabs>
                </div>
                <div className="control-box">
                    <ExportControls map={map.state} label={label.state} mapId={mapId} />
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
                                map={map.state}
                                handleAttrChange={setAttr}
                                randomiseData={() => randomizeData$.next(stateCodes)}
                                refreshMap={() => refreshMap$.next(stateCodes)}
                                uploadDataConfig={uploadDataConfig}
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
                                onChange={(e: any) => disableTooltipStore.set(e.target.checked)}
                                size="large"
                            />
                            <Spacer y={0.7} />
                            <Tabs hideDivider initialValue="1">
                                <Tabs.Item label="Legend" value="1">
                                    <LegendAllControls
                                        uniquePalette={uniquePalette}
                                        map={map.state}
                                        handleAttrChange={setAttr}
                                        toggleHideLegend={mapStore.toggleHideLegend}
                                        smoothGradient={mapStore.setLegendSmoothGradient}
                                        toggleSource={mapStore.setHideSource}
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
                            <ExportControls label={label.state} map={map.state} mapId={mapId} />
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
