export interface LectureRoom {
  name: string;
  floorNumber: number;
  lectureCapacity: number | null;
  examCapacity: number | null;
  currentSeats: number | null;
}

export const newLibraryRooms: LectureRoom[] = [
  { name: "NL 5", floorNumber: 0, lectureCapacity: 390, examCapacity: 195, currentSeats: 200 },
  { name: "NL 5 ANNEX", floorNumber: 0, lectureCapacity: 252, examCapacity: 126, currentSeats: 100 },
  { name: "NL 2", floorNumber: 0, lectureCapacity: 40, examCapacity: 20, currentSeats: 50 },
  { name: "NL 2 ANNEX", floorNumber: 0, lectureCapacity: 120, examCapacity: 60, currentSeats: 89 },
  { name: "NL 8", floorNumber: 0, lectureCapacity: 70, examCapacity: 45, currentSeats: 50 },
  { name: "NL 8 ANNEX 1", floorNumber: 0, lectureCapacity: 30, examCapacity: 15, currentSeats: 30 },
  { name: "NL ANNEX 2", floorNumber: 0, lectureCapacity: 90, examCapacity: 45, currentSeats: 22 },
  { name: "NL 10", floorNumber: 1, lectureCapacity: 216, examCapacity: 108, currentSeats: 100 },
  { name: "NL 10 ANNEX", floorNumber: 1, lectureCapacity: 216, examCapacity: 108, currentSeats: 90 },
  { name: "NL 11", floorNumber: 1, lectureCapacity: 156, examCapacity: 78, currentSeats: 70 },
  { name: "NL 12", floorNumber: 1, lectureCapacity: 98, examCapacity: 45, currentSeats: 60 },
  { name: "NL 13", floorNumber: 1, lectureCapacity: 126, examCapacity: 68, currentSeats: 70 },
  { name: "NL 14", floorNumber: 1, lectureCapacity: 304, examCapacity: 152, currentSeats: 200 },
  { name: "NL 15", floorNumber: 1, lectureCapacity: 168, examCapacity: 84, currentSeats: 84 },
  { name: "NL 15 ANNEX", floorNumber: 1, lectureCapacity: 102, examCapacity: 51, currentSeats: 60 },
  { name: "NL 16", floorNumber: 1, lectureCapacity: 240, examCapacity: 120, currentSeats: 76 },
  { name: "NL 16 ANNEX 1", floorNumber: 1, lectureCapacity: 240, examCapacity: 120, currentSeats: 70 },
  { name: "NL 16 ANNEX 2", floorNumber: 1, lectureCapacity: 154, examCapacity: 77, currentSeats: 60 },
  { name: "NL 17", floorNumber: 1, lectureCapacity: 154, examCapacity: 77, currentSeats: 77 },
  { name: "NL 17 ANNEX", floorNumber: 0, lectureCapacity: 108, examCapacity: 54, currentSeats: 54 },
  { name: "LIBRARY", floorNumber: 2, lectureCapacity: null, examCapacity: null, currentSeats: 0 },
  { name: "POST GRADUATE LIBRARY", floorNumber: 0, lectureCapacity: null, examCapacity: null, currentSeats: 0 },
];

export const pgmRooms: LectureRoom[] = [
  { name: "PGM-LH 1", floorNumber: 0, lectureCapacity: 82, examCapacity: 41, currentSeats: 30 },
  { name: "PGM-LH 2", floorNumber: 0, lectureCapacity: 40, examCapacity: 20, currentSeats: 24 },
  { name: "PGM-LH 3", floorNumber: 0, lectureCapacity: 40, examCapacity: 20, currentSeats: 22 },
  { name: "PGM-LH 4", floorNumber: 0, lectureCapacity: 40, examCapacity: 20, currentSeats: 30 },
  { name: "PGM-LH 5", floorNumber: 0, lectureCapacity: 40, examCapacity: 20, currentSeats: 15 },
  { name: "PGM-LH 6", floorNumber: 0, lectureCapacity: 40, examCapacity: 20, currentSeats: 30 },
  { name: "PGM-LH 7", floorNumber: 1, lectureCapacity: 80, examCapacity: 40, currentSeats: 60 },
  { name: "PGM-LH 8", floorNumber: 1, lectureCapacity: 40, examCapacity: 20, currentSeats: 37 },
  { name: "PGM-LH 9", floorNumber: 1, lectureCapacity: 40, examCapacity: 20, currentSeats: 34 },
  { name: "PGM-LH 10", floorNumber: 1, lectureCapacity: 80, examCapacity: 40, currentSeats: 60 },
  { name: "PGM-LH 11", floorNumber: 1, lectureCapacity: 40, examCapacity: 20, currentSeats: null },
  { name: "PGM-LH 12", floorNumber: 1, lectureCapacity: 80, examCapacity: 40, currentSeats: 34 },
  { name: "PGM-LH 13", floorNumber: 2, lectureCapacity: 96, examCapacity: 48, currentSeats: 50 },
  { name: "PGM-LH 14", floorNumber: 2, lectureCapacity: 56, examCapacity: 28, currentSeats: 40 },
  { name: "PGM-LH 15", floorNumber: 2, lectureCapacity: 56, examCapacity: 28, currentSeats: 45 },
  { name: "PGM-LH 16", floorNumber: 2, lectureCapacity: 56, examCapacity: 28, currentSeats: 40 },
  { name: "PGM-LH 17", floorNumber: 2, lectureCapacity: 56, examCapacity: 28, currentSeats: 30 },
  { name: "PGM-LH 18", floorNumber: 2, lectureCapacity: 56, examCapacity: 28, currentSeats: 25 },
  { name: "PGM-LH 19", floorNumber: 2, lectureCapacity: 124, examCapacity: 62, currentSeats: 50 },
  { name: "PGM-LH 20", floorNumber: 2, lectureCapacity: 124, examCapacity: 62, currentSeats: 60 },
  { name: "PGM-LH 21", floorNumber: 3, lectureCapacity: 30, examCapacity: 15, currentSeats: 30 },
  { name: "PGM-LH 22", floorNumber: 3, lectureCapacity: 154, examCapacity: 74, currentSeats: 60 },
  { name: "PGM-LH 23", floorNumber: 3, lectureCapacity: 154, examCapacity: 74, currentSeats: 45 },
  { name: "PGM-LH 24", floorNumber: 3, lectureCapacity: 30, examCapacity: 15, currentSeats: 30 },
  { name: "PGM-LH 25", floorNumber: 3, lectureCapacity: 154, examCapacity: 74, currentSeats: 56 },
  { name: "PGM-LH 26", floorNumber: 3, lectureCapacity: 154, examCapacity: 74, currentSeats: 60 },
  { name: "PGM-LH 27", floorNumber: 3, lectureCapacity: 156, examCapacity: 74, currentSeats: 54 },
  { name: "PGM-LH 28", floorNumber: 3, lectureCapacity: 156, examCapacity: 74, currentSeats: 59 },
  { name: "PGM-AMPHI THEATRE EAST WING", floorNumber: 4, lectureCapacity: 514, examCapacity: 257, currentSeats: 514 },
  { name: "PGM-LH 32", floorNumber: 4, lectureCapacity: 154, examCapacity: 72, currentSeats: 50 },
  { name: "PGM-LH 34", floorNumber: 4, lectureCapacity: 144, examCapacity: 72, currentSeats: 60 },
  { name: "PGM-AMPHI THEATRE WEST WING", floorNumber: 4, lectureCapacity: 514, examCapacity: 257, currentSeats: 514 },
];

// Map building names to their rooms
export const buildingRooms: Record<string, LectureRoom[]> = {
  'NEW LIBRARY': newLibraryRooms,
  'PROFESSOR GEORGE MAGOHA': pgmRooms,
};
