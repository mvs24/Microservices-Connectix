const USERTYPE = "USERTYPE";

export interface USER {
  type: typeof USERTYPE;
  payload: {
    a: number;
  };
}
