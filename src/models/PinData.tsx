/**
 * ピンのデータ情報の型
 */
interface PinData {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    category: string;
    imageUrl: string;
  }
export default PinData;
