import L, { LatLng } from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import PinData from '../models/PinData';
import { addPin } from '../services/PinApi';
import customMarkerIcon from '../utils/customMarkerIcon';
import { Button, TextField } from '@mui/material';

/**
 * propsの定義
 */
interface propIf {
  reload: () => void; // 明示的に関数の型を定義
}

/**
 * ピンデータの登録
 * 1. 押下した地図の座標を読み取る
 * 2. 押下した場所のピンとポップアップを出力してピンの情報入力を促す
 * 3. 入力された情報を基にピン情報を追加登録する
 * @param reload 親コンポーネントのFetchAllPinsComponentを再レンダリングさせるためのstateのsetter
 * @returns 追加するピン情報を記載するためのポップアップ
 */
export const AddPinComponent: React.FC<propIf> = ({ reload }) => {
  // ピン位置の状態保持
  const [position, setPosition] = useState<LatLng | null>(null);
  // pinの初期設定
  const [pin, setPin] = useState<PinData>({
    id: '',
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    category: '',
    imageUrl: '',
  });
  // マーカーへの参照
  const markerRef = useRef<L.Marker | null>(null);

  // クリックにより位置情報を取得
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  // マーカーがレンダリングされた後にポップアップを開くための参照を定義
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [position]);

  // キャンセルボタン押下後の処理
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // 初期化
    setPosition(null); // フォームを閉じる
    setPin({ id: "", title: "", description: "", latitude: 0, longitude: 0, category: "", imageUrl: "" })
  }

  // 登録APIを呼び出すための処理
  const handleSave = async () => {
    if (position && pin) {
      const savePin: PinData = {
        id: "",
        title: pin.title,
        description: pin.description,
        latitude: position.lat,
        longitude: position.lng,
        category: pin.category,
        imageUrl: pin.imageUrl
      }
      // 登録APIを呼び出し
      await addPin(savePin)
        .then(responseData => { // 成功した場合の処理
          reload();
        })
        .catch(error => { // エラーが発生した場合の処理
          console.error('ピンの追加に失敗しました。', error);
        });
      setPosition(null); // フォームを閉じる
      // 初期化
      setPin({ id: "", title: "", description: "", latitude: 0, longitude: 0, category: "", imageUrl: "" })
    }
  };

  // もしpinがundefinedの可能性があるなら、pinを使用する前にチェックする
  if (!pin) return null;

  // positionがnullでない場合（＝クリックしてpositionに何かしら値が入った状態）、ピンとポップアップを返す
  return position === null ? null : (
    <>
      <Marker position={position} icon={customMarkerIcon} ref={markerRef} // MarkerにRefを設定
      >
        <Popup>
          <div>
            <label><TextField id="standard-basic" label="タイトル" variant="standard" value={pin.title} onChange={(e) => setPin({ ...pin, title: e.target.value })} /></label><br />
            <label><TextField id="standard-multiline-flexible" label="説明" multiline maxRows={2} variant="standard" value={pin.description} onChange={(e) => setPin({ ...pin, description: e.target.value })} /></label><br />
            <label><TextField id="standard-basic" label="カテゴリ" variant="standard" value={pin.category} onChange={(e) => setPin({ ...pin, category: e.target.value })} /></label><br />
            <label><TextField id="standard-basic" label="画像URL" variant="standard" value={pin.imageUrl} onChange={(e) => setPin({ ...pin, imageUrl: e.target.value })} /></label><br />
            <Button variant="outlined" color="success" onClick={handleSave}>保存</Button>
            <Button variant="text" onClick={handleCancel}>キャンセル</Button>
          </div>
        </Popup>
      </Marker>
    </>
  );
}