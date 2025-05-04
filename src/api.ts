import axios from "axios";

const API_URL = "http://localhost:5215"; 

export const fetchBoard = async () => {
  const response = await axios.get(`${API_URL}/chess/board`);
  return response.data;
};

export async function makeMove(from: string, to: string): Promise<{ from: { row: number; col: number }, to: { row: number; col: number } }> {
  try {
    const response = await axios.post(`${API_URL}/chess/move`, { from, to });
    return response.data; // { from: {row, col}, to: {row, col} }
  } catch (error: any) {
    console.error("Move failed:", error.response?.data || error.message);
    throw error;
  }
}

export async function fetchValidMoves(from: string): Promise<string[]> {
  try {
    const response = await axios.get(`${API_URL}/chess/moves`, {
      params: { from },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching valid moves:", error);
    return [];
  }
};