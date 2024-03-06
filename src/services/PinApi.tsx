import PinData from '../models/PinData';

/**
 * DBに格納された全ピンデータを取得する関数
 * @returns 格納された全ピンデータ
 */
export const fetchAllPins = async () => {
  const response = await fetch('https://assampleapp.azurewebsites.net/');
  if (!response.ok) {
    throw new Error('ピンの取得に失敗しました。');
  }
  return response.json();
};

/**
 * 指定したピンデータを取得する関数
 * @param id 指定したピンのID
 * @returns 指定したピンのデータ
 */
export const fetchPin = async (id: string) => {
  const response = await fetch(`https://assampleapp.azurewebsites.net/${id}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('ピンの取得に失敗しました。');
  }
  const responseData: PinData = await response.json();
  return responseData;
};

/**
 * 指定したピンデータを追加する関数
 * @param pinData 指定したピンのデータ
 * @returns 追加したピンのデータ
 */
export const addPin = async (pinData: Omit<PinData, 'id'>) => {
  const response = await fetch('https://assampleapp.azurewebsites.net/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pinData),
  });
  if (!response.ok) {
    throw new Error('ピンの追加に失敗しました。');
  }
  const responseData: PinData = await response.json();
  return responseData;
};

/**
 * 指定したピンを更新する関数
 * @param id 指定したピンのID
 * @param pinData 指定したピンのデータ
 * @returns 更新したピンのデータ
 */
export const updatePin = async (id: string, pinData: Omit<PinData, 'id'>) => {
  const response = await fetch(`https://assampleapp.azurewebsites.net/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pinData),
  });
  if (!response.ok) {
    throw new Error('ピンの更新に失敗しました。');
  }
  const responseData: PinData = await response.json();
  return responseData;
};

/**
 * 指定したピンを削除する関数
 * @param id 指定したピンのID
 */
export const deletePin = async (id: string) => {
  const response = await fetch(`https://assampleapp.azurewebsites.net/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('ピンの削除に失敗しました。');
  }
};
