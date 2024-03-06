// 必要なインポート
import React, { useState } from 'react';
import { Popup } from 'react-leaflet';
import {updatePin,deletePin} from '../services/PinApi'; 
import PinData from '../models/PinData';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { IconButton, Button, TextField } from '@mui/material';

/**
 * propsの定義
 */
interface propIf {
  pin: PinData;
  reload: () => void; // 明示的に関数の型を定義
}

// ピン情報の編集（削除含む）
/**
 * ピンデータの編集と削除
 * 1. 選択したピンの情報をポップアップで表示する
 * 2.a. 編集ボタン押下後は、ポップアップを出力してピンの情報入力を促す
 * 3.a. 入力された情報を基にピン情報を更新する
 * 2.b. 削除ボタン押下後は、ポップアップを出力して削除要否の確認を促す
 * 3.b. ピン情報を削除する
 * @param pin ピンのデータ
 * @param reload 親コンポーネントのFetchAllPinsComponentを再レンダリングさせるためのstateのsetter
 * @returns 参照/編集/削除のポップアップ
 */
const EditPinComponent: React.FC<propIf> = ({pin, reload }) => {
  // 編集モードか削除モードかの状態を管理
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // 各ピン項目の情報の状態を管理
  const [editTitle, setEditTitle] = useState(pin.title);
  const [editDescription, setEditDescription] = useState(pin.description);
  const [editCategory, setEditCategory] = useState(pin.category);
  const [editImageUrl, setEditImageUrl] = useState(pin.imageUrl);

  // 初期化
  const handleInit = () => {
    setEditTitle("");
    setEditDescription("");
    setEditCategory("");
    setEditImageUrl("");
  };

  // 編集ボタン=>保存ボタン押下後の更新処理（API呼び出し）
  const handleUpdate = async () => {
    await updatePin(pin.id, { ...pin, title: editTitle, description: editDescription, category: editCategory, imageUrl: editImageUrl });
    setEditMode(false);
    reload();
    // 初期化
    handleInit();
  };

  // 削除ボタン=>削除ボタン押下後の更新処理（API呼び出し）
  const handleDelete = async () => {
    await deletePin(pin.id);
    setConfirmDelete(false);
    reload();
    // 初期化
    handleInit();
  };

  // キャンセルボタン押下後の処理
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditMode(false);
    setConfirmDelete(false);
  }

  // 編集ボタン押下後の処理
  const handleEditModeChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditMode(true);
  }

  // 削除ボタン押下後の処理
  const handleConfirmDeleteChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmDelete(true);
  }

  // 編集ボタン押下後のポップアップ
  if (editMode) {
    return (
      <Popup> 
        <div>
          <label><TextField id="standard-basic" label="タイトル" variant="standard" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} /></label><br/><br/>
          <label><TextField id="standard-multiline-flexible" label="説明" multiline maxRows={2} variant="standard" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} /></label><br/><br/>
          <label><TextField id="standard-basic" label="カテゴリ" variant="standard" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} /></label><br/><br/>
          <label><TextField id="standard-basic" label="画像URL" variant="standard" value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} /></label><br/><br/>
          <Button variant="outlined" color="success" onClick={handleUpdate}>保存</Button>
          <Button variant="text" onClick={handleCancel}>キャンセル</Button>
        </div>
      </Popup>
    );
  }

  // 削除ボタン押下後のポップアップ
  if (confirmDelete) {
    return (
      <Popup>
        <div>
          <h2>このピンを削除しますか？</h2>
          <Button variant="outlined" color="error" onClick={handleDelete}>削除</Button>
          <Button variant="text" onClick={handleCancel}>キャンセル</Button>
        </div>
      </Popup>
    );
  }

  // 登録済みのピン押下後のポップアップ
  return (
    <Popup>
      <div>
        <h2>{pin.title}</h2>
        <h4>{pin.description}</h4>
        {pin.imageUrl && <img src={pin.imageUrl} alt={pin.title} style={{ maxWidth: '100px' }} />}<br />
        <p>カテゴリ：<span>{pin.category}</span></p>
        <Button variant="outlined" startIcon={<Edit />} onClick={handleEditModeChange}>編集</Button>
        <IconButton  onClick={handleConfirmDeleteChange}><Delete /></IconButton>
      </div>
    </Popup>
  );
};

export default EditPinComponent;