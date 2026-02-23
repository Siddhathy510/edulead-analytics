export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  attendance: number;
  internalMarks: number;
  assignmentScore: number;
  riskLevel: "safe" | "at-risk";
  riskProbability: number;
  riskExplanation: string;
  blockHash: string;
  blockNumber: number;
  blockTimestamp: string;
  attendanceHistory: number[];
  marksHistory: number[];
}

const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "0x" + Math.abs(hash).toString(16).padStart(12, "0") + 
    Math.random().toString(16).slice(2, 14);
};

const createStudent = (
  id: string, name: string, email: string, dept: string, sem: number,
  attendance: number, marks: number, assignment: number,
  attHistory: number[], marksHistory: number[], blockNum: number
): StudentRecord => {
  const prob = calculateRisk(attendance, marks);
  const riskLevel = prob >= 0.5 ? "safe" : "at-risk";
  const explanations: string[] = [];
  if (attendance < 75) explanations.push("Low attendance detected");
  if (marks < 50) explanations.push("Declining academic trend");
  if (assignment < 60) explanations.push("Assignment scores need improvement");

  return {
    id, name, email, department: dept, semester: sem,
    attendance, internalMarks: marks, assignmentScore: assignment,
    riskLevel, riskProbability: prob,
    riskExplanation: explanations.length > 0 ? explanations.join(". ") : "Performance is on track",
    blockHash: generateHash(`${id}-${name}-${attendance}-${marks}`),
    blockNumber: blockNum,
    blockTimestamp: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    attendanceHistory: attHistory,
    marksHistory: marksHistory,
  };
};

export const calculateRisk = (attendance: number, marks: number): number => {
  const attScore = Math.min(attendance / 100, 1);
  const markScore = Math.min(marks / 100, 1);
  return Math.round((attScore * 0.4 + markScore * 0.6) * 100) / 100;
};

export const initialStudents: StudentRecord[] = [
  createStudent("s1", "Alex Johnson", "alex@edu.com", "Computer Science", 4, 92, 85, 88, [88, 90, 85, 92, 91, 92], [78, 80, 82, 85, 84, 85], 1),
  createStudent("s2", "Maria Garcia", "maria@edu.com", "Computer Science", 3, 78, 72, 75, [82, 80, 76, 74, 78, 78], [70, 68, 72, 74, 71, 72], 2),
  createStudent("s3", "Ryan Patel", "ryan@edu.com", "Data Science", 5, 65, 45, 50, [75, 72, 68, 65, 63, 65], [55, 50, 48, 46, 44, 45], 3),
  createStudent("s4", "Emma Liu", "emma@edu.com", "AI & ML", 4, 95, 91, 94, [90, 92, 93, 95, 94, 95], [88, 89, 90, 91, 92, 91], 4),
  createStudent("s5", "David Kim", "david@edu.com", "Cybersecurity", 3, 58, 40, 42, [70, 65, 62, 60, 58, 58], [50, 48, 44, 42, 41, 40], 5),
  createStudent("s6", "Sophie Brown", "sophie@edu.com", "Data Science", 4, 88, 79, 82, [84, 85, 86, 88, 87, 88], [75, 76, 78, 79, 80, 79], 6),
  createStudent("s7", "James Taylor", "james@edu.com", "Computer Science", 5, 71, 55, 58, [78, 76, 74, 72, 71, 71], [60, 58, 57, 56, 55, 55], 7),
  createStudent("s8", "Aisha Khan", "aisha@edu.com", "AI & ML", 3, 96, 93, 95, [92, 94, 95, 96, 95, 96], [90, 91, 92, 93, 94, 93], 8),
];

export interface BlockchainRecord {
  blockNumber: number;
  timestamp: string;
  dataHash: string;
  studentId: string;
  studentName: string;
  action: string;
}

export const getBlockchainLedger = (students: StudentRecord[]): BlockchainRecord[] => {
  return students.map((s) => ({
    blockNumber: s.blockNumber,
    timestamp: s.blockTimestamp,
    dataHash: s.blockHash,
    studentId: s.id,
    studentName: s.name,
    action: "Record Created",
  })).sort((a, b) => a.blockNumber - b.blockNumber);
};
