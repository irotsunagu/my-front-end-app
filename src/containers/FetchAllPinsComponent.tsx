import React, { useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';
import PinData from '../models/PinData';
import { fetchAllPins } from '../services/PinApi';
import EditPinComponent from './EditPinComponent'; 
import { AddPinComponent } from './AddPinComponent'; 
import customMarkerIcon from '../utils/customMarkerIcon';

/**
 * propsの定義
 */
interface propIf {
  showMarker: boolean;
  reloadState: boolean;
  reload: () => void; // 明示的に関数の型を定義
}

/**
 * 全ピンのマーカーを返却する関数
 * AddPinComonentおよびEditPinComponentの親コンポーネント
 * @param reload 親コンポーネントのFetchAllPinsComponentを再レンダリングさせるためのstateのsetter
 * @returns 全ピンのマーカー
 */
export const FetchAllPinsComponent: React.FC<propIf> = ( {showMarker, reloadState, reload }) => {
  const [pins, setPins] = useState<PinData[]>([]);

  // 全ピン情報の取得
  useEffect(() => {
    fetchAllPins().then(setPins).catch(console.error);
  }, [reloadState,reload]);

  if (!showMarker) return null;

  return (
    <>
      <AddPinComponent reload={reload} />
      {pins.map(pin => (
        <Marker key={pin.id} position={[pin.latitude, pin.longitude]} icon={customMarkerIcon}>
          <EditPinComponent pin={pin}  reload={reload} />
        </Marker>
      ))}
    </>
  );
};
