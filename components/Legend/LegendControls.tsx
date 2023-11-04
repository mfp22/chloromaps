/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
import { mapStore, removeLegend$ } from '@/store/map.store';
import { Input } from '@geist-ui/react';
import { Eye, XCircle, EyeOff, ChevronUp, ChevronDown } from '@geist-ui/react-icons';
import { useStore } from '@state-adapt/react';
import React from 'react';
import InputLabel from '../InputLabel';
import MiniColorPicker from '../MiniColorPicker';

const LegendControls = () => {
    const map = useStore(mapStore);
    return (
        <div className="ctx">
            {map.legendData.length > 0 && <InputLabel text="Legend Settings" />}{' '}
            {map.legendData.map((dt, i) => (
                <div key={dt.fill} className="wrapper">
                    <div
                        className="icon-btn flex-center pointer"
                        onClick={() => mapStore.toggleHideLegend({ i, f: dt.fill })}>
                        {dt.hide ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                    <MiniColorPicker
                        index={i}
                        map={map.state}
                        changeColor={mapStore.changeColor}
                        bgColor={dt.fill}
                    />
                    <Input
                        width="150px"
                        size="mini"
                        placeholder="Legend Value"
                        value={dt.text}
                        onChange={(e) => mapStore.changeLegendText({ i, t: e.target.value })}
                    />
                    <div
                        className="icon-btn flex-center pointer"
                        onClick={() => removeLegend$.next({ i, fill: dt.fill, map: map.state })}>
                        <XCircle size={20} />
                    </div>
                    <div className="flex-center flex-col up-down pointer">
                        <ChevronUp onClick={() => mapStore.changeLegendPos({ idx: i, up: true })} />
                        <ChevronDown
                            onClick={() => mapStore.changeLegendPos({ idx: i, up: false })}
                        />
                    </div>
                </div>
            ))}
            <style jsx>{`
                .up-down {
                    opacity: 0.6;
                    height: 30px;
                }
                .up-down:hover {
                    opacity: 1;
                }
                .ctx {
                    width: 320px;
                }
                .box {
                    width: 20px;
                    height: 20px;
                    border-radius: 2px;
                    margin-right: 5px;
                }
                .icon-btn {
                    opacity: 0.5;
                }
                .icon-btn:hover {
                    opacity: 1;
                }
                .wrapper {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default LegendControls;
