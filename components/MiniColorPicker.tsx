/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
import { colorPickerPalette } from '@/data/colors';
import getColorUsed from '@/lib/getColorUsed';
import { mapStore } from '@/store/map.store';
import { MapStoreType } from '@/typings/map.store';
import { useTheme } from '@geist-ui/react';
import React from 'react';

interface Props {
    bgColor: string;
    map: MapStoreType;
    changeColor: typeof mapStore.changeColor;
    index: number;
}

const MiniColorPicker: React.FC<Props> = ({ index, bgColor, map, changeColor }) => {
    const theme = useTheme();
    const uniquePalette: string[] = getColorUsed(map.mapData);
    const [open, setOpen] = React.useState<boolean>(false);
    return (
        <>
            <div
                style={{ backgroundColor: bgColor }}
                onClick={() => setOpen(!open)}
                className="box pointer">
                {open && (
                    <div className="picker absolute">
                        <div className="flex flex-col ">
                            {colorPickerPalette.map((d, i) => (
                                <div key={`${d[i]}-${i}`} className="flex justify-evenly">
                                    {d.map((el) => (
                                        <div
                                            onClick={() => changeColor({ v: el, bgColor, index })}
                                            key={el}
                                            style={{ backgroundColor: el }}
                                            className={`palette-box ${
                                                uniquePalette.includes(el) ? 'border' : ''
                                            }`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .palette-box {
                    width: 15px;
                    height: 15px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                    border-radius: 2px;
                    border: 1px solid #121212;
                }
                .border {
                    border: 1px solid white !important;
                }
                .picker {
                    background-color: ${theme.palette.accents_1};
                    border: 1px solid ${theme.palette.accents_2};
                    padding-top: 5px;
                    padding-left: 5px;
                    z-index: 1000;
                    top: 150%;
                    left: -5%;
                    border-radius: 5px;
                }
                .box {
                    position: relative;
                    width: 20px;
                    height: 20px;
                    border-radius: 2px;
                }
            `}</style>
        </>
    );
};

export default MiniColorPicker;
