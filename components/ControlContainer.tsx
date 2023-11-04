/* eslint-disable @typescript-eslint/no-explicit-any */
import getColorUsed from '@/lib/getColorUsed';
import uploadConfig from '@/lib/uploadConfig';
import { labelStore } from '@/store/label.store';
import { disableTooltipStore, mapStore, randomizeData$, refreshMap$ } from '@/store/map.store';
import { Spacer, Tabs, Toggle, useToasts } from '@geist-ui/react';
import { Edit, Upload, Type } from '@geist-ui/react-icons';
import { useStore } from '@state-adapt/react';
import React from 'react';
import EditControls from './Controls/EditControls';
import ExportControls from './Controls/ExportControls';
import LabelControls from './Controls/LabelControls';
import LegendAllControls from './Controls/LegendAllControls';
import InputLabel from './InputLabel';
import HideWaterBodies from './MapAddons/HideWaterBodies';

interface Props {
    mapId: string;
    stateCodes: { [key: string]: string };
    hideWaterBodies?: boolean;
}

const ControlContainer: React.FC<Props> = ({ mapId, stateCodes, hideWaterBodies }) => {
    const map = useStore(mapStore);
    const label = useStore(labelStore);
    const [, setToast] = useToasts();
    const setAttr = (v: any, attr: string) => mapStore.setAttr({ attr, v });
    const uploadDataConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            e.target.files![0],
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
        <div className="mt">
            <div className="flex flex-col">
                <Tabs initialValue="1" hideDivider>
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
                            {hideWaterBodies ? (
                                <>
                                    <Spacer y={0.7} />
                                    <HideWaterBodies id="water_bodies" />
                                </>
                            ) : null}
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
                            <Tabs initialValue="1">
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
                            <ExportControls map={map.state} label={label} mapId={mapId} />
                        </div>
                    </Tabs.Item>
                </Tabs>
            </div>
            <style jsx>{`
                .mt {
                    margin-top: 30px;
                }
                .file-input {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 150px;
                    height: 100%;
                    opacity: 0;
                }
                .control-box {
                    width: 320px;
                    height: 80vh;
                    padding-top: 20px;
                    padding-bottom: 100px;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    position: relative;
                }
            `}</style>
        </div>
    );
};

export default ControlContainer;
