declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userName?: string;
      userRole?: string;
      userEmail?: string;
      userPhone?: string;
    }
  }
}

export {};
