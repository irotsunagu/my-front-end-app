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
  // 各ピン項目の情報の状態を管理
  const [editTitle, setEditTitle] = useState(' ');
  const [editDescription, setEditDescription] = useState(' ');
  const [editCategory, setEditCategory] = useState(' ');
  const [editImageUrl, setEditImageUrl] = useState(' ');

  // 初期化
  const handleInit = () => {
    setEditTitle("");
    setEditDescription("");
    setEditCategory("");
    setEditImageUrl("");
  };

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
    handleInit();
  }

  // 登録APIを呼び出すための処理
  const handleSave = async () => {
    if (position) {
      const savePin: PinData = {
        id: "",
        title: editTitle,
        description: editDescription,
        latitude: position.lat,
        longitude: position.lng,
        category: editCategory,
        imageUrl: editImageUrl
      }

      // 登録APIを呼び出し
      await addPin(savePin)
        .then(responseData => { // 成功した場合の処理
          reload();
        })
        .catch(error => { // エラーが発生した場合の処理
          console.error('ピンの追加に失敗しました。', error);
        });
      
      // 初期化
      setPosition(null); // フォームを閉じる
      handleInit();
    }
  };

  // positionがnullでない場合（＝クリックしてpositionに何かしら値が入った状態）、ピンとポップアップを返す
  return position === null ? null : (
    <>
      <Marker position={position} icon={customMarkerIcon} ref={markerRef} // MarkerにRefを設定
      >
        <Popup>
          <div>
            <label><TextField id="standard-basic" label="タイトル" variant="standard" value={editTitle} onChange={(e) => setEditTitle( e.target.value )} /></label><br/><br/>
            <label><TextField id="standard-basic" label="説明" variant="standard" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} /></label><br/><br/>
            <label><TextField id="standard-basic" label="カテゴリ" variant="standard" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} /></label><br/><br/>
            <label><TextField id="standard-basic" label="画像URL" variant="standard" value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} /></label><br/><br/>
            <Button variant="outlined" color="success" onClick={handleSave}>保存</Button>
            <Button variant="text" onClick={handleCancel}>キャンセル</Button>
          </div>
        </Popup>
      </Marker>
    </>
  );
}