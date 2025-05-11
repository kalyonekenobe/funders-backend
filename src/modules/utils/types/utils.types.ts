export interface CountResponse {
  count: number;
}

export interface ObjectKeysCountResponse {
  [key: string | number]: CountResponse;
}
