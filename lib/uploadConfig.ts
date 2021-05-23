/* eslint-disable @typescript-eslint/no-explicit-any */
import fillAllMap from "./fillAllMap";
import importLabelConfig from "./importLabelConfig";

// @ts-ignore
const uploadConfig = (file , setMap , def) => {
  let fileReader: any;

  const handleConfigUpload = (f: any) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(f);
  };

  const handleFileRead = () => {
    const content = fileReader.result;
    const Data = JSON.parse(content)
    setMap(Data.mapData)
    fillAllMap(Data.mapData.mapData ,def )
    importLabelConfig(Data.labelData)
  };

  handleConfigUpload(file)

}

export default uploadConfig;